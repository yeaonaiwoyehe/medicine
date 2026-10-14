# -*- coding: utf-8 -*-
"""数据库访问层：从 MySQL 读取/管理文物知识。"""
import pymysql

from db_config import DB_CONFIG


def get_conn():
    """返回一个 DictCursor 连接。开启 autocommit，写入即时生效。调用方负责 close。"""
    return pymysql.connect(**DB_CONFIG, autocommit=True,
                           cursorclass=pymysql.cursors.DictCursor)


def get_artifact(image_id):
    """
    按 image_id（图片文件名）查询文物，返回与 knowledge.json 兼容的 dict；
    找不到返回 None。附带 historical_changes 数组。
    """
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM artifacts WHERE image_id=%s", (image_id,))
            row = cur.fetchone()
            if not row:
                return None

            # 历史演变
            cur.execute(
                "SELECT period, title, `change`, impact "
                "FROM artifact_history WHERE artifact_id=%s ORDER BY id",
                (row["id"],),
            )
            row["historical_changes"] = cur.fetchall()

            # 内部字段不外露
            row.pop("id", None)
            row.pop("created_at", None)

            # 兼容原 JSON 的 camelCase 字段名（部分前端用）
            if row.get("cultural_significance") is not None:
                row["culturalSignificance"] = row["cultural_significance"]
            if row.get("chinese_medicinal_materials") is not None:
                row["chineseMedicinalMaterials"] = row["chinese_medicinal_materials"]
            return row
    finally:
        conn.close()


def list_artifacts(keyword=None, limit=100, offset=0):
    """管理后台用：分页/关键字查询文物列表。"""
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            sql = "SELECT * FROM artifacts"
            params = []
            if keyword:
                sql += " WHERE name LIKE %s OR type LIKE %s OR dynasty LIKE %s"
                like = f"%{keyword}%"
                params = [like, like, like]
            sql += " ORDER BY id DESC LIMIT %s OFFSET %s"
            params += [limit, offset]
            cur.execute(sql, params)
            rows = cur.fetchall()
            for r in rows:
                r.pop("created_at", None)
            return rows
    finally:
        conn.close()


def count_artifacts(keyword=None):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            if keyword:
                like = f"%{keyword}%"
                cur.execute(
                    "SELECT COUNT(*) AS c FROM artifacts "
                    "WHERE name LIKE %s OR type LIKE %s OR dynasty LIKE %s",
                    (like, like, like),
                )
            else:
                cur.execute("SELECT COUNT(*) AS c FROM artifacts")
            return cur.fetchone()["c"]
    finally:
        conn.close()


def delete_artifact(artifact_id):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM artifacts WHERE id=%s", (artifact_id,))
            return cur.rowcount > 0
    finally:
        conn.close()


# 允许写入/更新的字段（管理后台增删改查用）
EDITABLE_FIELDS = [
    "image_id", "name", "dynasty", "type", "material", "description",
    "acupoint", "celebrity", "usage", "benefit", "function", "value",
    "cultural_value", "cultural_significance",
    "chinese_medicinal_materials", "author", "content_introduction",
]


def _clean(data):
    """只保留可编辑字段，缺失置 None。"""
    cleaned = {}
    for f in EDITABLE_FIELDS:
        v = data.get(f)
        cleaned[f] = v if v not in (None, "") else None
    return cleaned


def create_artifact(data):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            d = _clean(data)
            cols = ", ".join(f"`{c}`" for c in EDITABLE_FIELDS)
            marks = ", ".join(["%s"] * len(EDITABLE_FIELDS))
            vals = [d[c] for c in EDITABLE_FIELDS]
            cur.execute(
                f"INSERT INTO artifacts ({cols}) VALUES ({marks})", vals)
            return cur.lastrowid
    finally:
        conn.close()


def update_artifact(artifact_id, data):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            # 只更新请求中实际提供的字段（避免把 image_id 等改成 NULL）
            fields = [f for f in EDITABLE_FIELDS if data.get(f) not in (None, "")]
            if not fields:
                return True
            sets = ", ".join(f"`{c}`=%s" for c in fields)
            vals = [data[c] for c in fields] + [artifact_id]
            cur.execute(f"UPDATE artifacts SET {sets} WHERE id=%s", vals)
            return cur.rowcount > 0
    finally:
        conn.close()

