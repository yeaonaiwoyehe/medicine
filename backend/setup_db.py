# -*- coding: utf-8 -*-
"""
初始化数据库：建表 + 将 knowledge.json 导入 MySQL（qiyao_tongsu）。
运行：cd backend && python setup_db.py
"""
import json
import os
import sys

import pymysql

from db_config import DB_CONFIG

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------- 建表 ----------
DDL = [
    """
    CREATE TABLE IF NOT EXISTS artifacts (
        id                       INT AUTO_INCREMENT PRIMARY KEY,
        image_id                 VARCHAR(255) NOT NULL UNIQUE COMMENT '图片文件名(知识库key)',
        name                     VARCHAR(255) COMMENT '文物名称',
        dynasty                  VARCHAR(255) COMMENT '年代',
        type                     VARCHAR(100) COMMENT '类别',
        material                 VARCHAR(255) COMMENT '材质',
        description              TEXT COMMENT '描述',
        acupoint                 VARCHAR(255) COMMENT '相关穴位',
        celebrity                VARCHAR(255) COMMENT '相关人物',
        `usage`                  TEXT COMMENT '用途',
        benefit                  VARCHAR(255) COMMENT '功效/作用',
        `function`               VARCHAR(255) COMMENT '功能',
        `value`                  VARCHAR(255) COMMENT '价值',
        cultural_value           TEXT COMMENT '文化价值',
        cultural_significance    TEXT COMMENT '文化意义',
        chinese_medicinal_materials TEXT COMMENT '中药材相关',
        author                   VARCHAR(255) COMMENT '作者',
        content_introduction     TEXT COMMENT '内容简介',
        created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        KEY idx_type (type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文物知识主表'
    """,
    """
    CREATE TABLE IF NOT EXISTS artifact_history (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        artifact_id INT NOT NULL COMMENT '文物id',
        period      VARCHAR(255) COMMENT '时期',
        title       VARCHAR(255) COMMENT '事件标题',
        `change`    TEXT COMMENT '变化描述',
        impact      TEXT COMMENT '影响',
        FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
        KEY idx_artifact (artifact_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文物历史演变子表'
    """,
]


def get_scalar(item, *names):
    """从 JSON 条目中取第一个非空字段值。"""
    for n in names:
        v = item.get(n)
        if v not in (None, "", [], {}):
            return v if not isinstance(v, list) else None
    return None


def main():
    conn = pymysql.connect(**DB_CONFIG, autocommit=True)
    cur = conn.cursor()

    # 建表
    for ddl in DDL:
        cur.execute(ddl)
    print("[OK] 表结构创建完成: artifacts, artifact_history")

    # 清空旧数据（可重复执行）
    cur.execute("SET FOREIGN_KEY_CHECKS=0")
    cur.execute("TRUNCATE TABLE artifact_history")
    cur.execute("TRUNCATE TABLE artifacts")
    cur.execute("SET FOREIGN_KEY_CHECKS=1")

    # 读取 knowledge.json
    with open(os.path.join(BASE_DIR, "knowledge.json"), "r", encoding="utf-8") as f:
        knowledge = json.load(f)

    total = 0
    for image_id, item in knowledge.items():
        name = get_scalar(item, "name") or image_id
        dynasty = get_scalar(item, "dynasty")
        typ = get_scalar(item, "type")
        material = get_scalar(item, "material")
        description = get_scalar(item, "description")
        acupoint = get_scalar(item, "acupoint")
        celebrity = get_scalar(item, "celebrity")
        usage = get_scalar(item, "usage")
        benefit = get_scalar(item, "benefit")
        function = get_scalar(item, "function")
        value = get_scalar(item, "value")
        cultural_value = get_scalar(item, "cultural_value", "culturalValue")
        cultural_significance = get_scalar(item, "culturalSignificance")
        cmm = get_scalar(item, "chineseMedicinalMaterials")
        author = get_scalar(item, "author")
        content_intro = get_scalar(item, "content_introduction")

        cur.execute(
            """INSERT INTO artifacts
               (image_id, name, dynasty, type, material, description, acupoint,
                celebrity, `usage`, benefit, `function`, `value`, cultural_value,
                cultural_significance, chinese_medicinal_materials, author,
                content_introduction)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (image_id, name, dynasty, typ, material, description, acupoint,
             celebrity, usage, benefit, function, value, cultural_value,
             cultural_significance, cmm, author, content_intro),
        )
        artifact_id = cur.lastrowid

        # 历史演变子表
        hist = item.get("historical_changes") or []
        for h in hist:
            if not isinstance(h, dict):
                continue
            cur.execute(
                """INSERT INTO artifact_history
                   (artifact_id, period, title, `change`, impact)
                   VALUES (%s,%s,%s,%s,%s)""",
                (artifact_id,
                 h.get("period"), h.get("title"), h.get("change"), h.get("impact")),
            )
        total += 1

    cur.execute("SELECT COUNT(*) FROM artifacts")
    artifacts_cnt = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM artifact_history")
    hist_cnt = cur.fetchone()[0]

    print(f"[OK] 导入完成: 文物 {artifacts_cnt} 条, 历史演变 {hist_cnt} 条")
    cur.close()
    conn.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[失败] {e}", file=sys.stderr)
        sys.exit(1)
