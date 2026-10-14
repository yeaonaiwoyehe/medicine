from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid

from feature_extractor import extract_feature
from search import search
from db import (get_artifact, list_artifacts, count_artifacts,
                create_artifact, update_artifact, delete_artifact)

USE_AI = False
if USE_AI:
    from ai_fallback import call_ai_api

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "..", "frontend", "program(4)", "public")

# 将前端 public 目录作为 Flask 静态根目录，确保 css/js/image 可直接访问
app = Flask(__name__, static_folder=PUBLIC_DIR, static_url_path="")
CORS(app)

UPLOAD_FOLDER = os.path.join(BASE_DIR, "temp")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

THRESHOLD = 0.6

# ✅ 用绝对路径加载
with open(os.path.join(BASE_DIR, "knowledge.json"), "r", encoding="utf-8") as f:
    knowledge = json.load(f)


@app.route('/')
def home():
    return app.send_static_file("index.html")


@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({"success": False, "message": "未上传图片"})

    file = request.files['image']

    filename = str(uuid.uuid4()) + ".jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        feat = extract_feature(filepath)
        result = search(feat)

        similarity = result["similarity"]
        img_id = result["image"]

        if similarity >= THRESHOLD:
            # 优先从 MySQL 数据库读知识，查不到则回退 knowledge.json
            info = get_artifact(img_id) or knowledge.get(img_id, {})

            response = {
                "success": True,
                "source": "database",
                "top1": {
                    "image_id": img_id,
                    "similarity": similarity,
                    **info
                }
            }

        else:
            if USE_AI:
                ai_result = call_ai_api(filepath)
            else:
                ai_result = {
                    "name": "未知中医器具",
                    "description": "未匹配到数据库"
                }

            response = {
                "success": True,
                "source": "ai",
                "similarity": similarity,
                **ai_result
            }

        return jsonify(response)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


# ==================== 管理后台接口 ====================

@app.route('/admin')
def admin_page():
    return app.send_static_file("admin.html")


@app.route('/admin/api/artifacts', methods=['GET'])
def admin_list():
    keyword = request.args.get('keyword', '').strip()
    page = max(int(request.args.get('page', 1)), 1)
    page_size = min(max(int(request.args.get('page_size', 20)), 1), 100)
    offset = (page - 1) * page_size
    rows = list_artifacts(keyword=keyword or None, limit=page_size, offset=offset)
    total = count_artifacts(keyword=keyword or None)
    return jsonify({
        "success": True,
        "data": rows,
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@app.route('/admin/api/artifacts', methods=['POST'])
def admin_create():
    data = request.get_json(silent=True) or {}
    if not data.get('image_id'):
        return jsonify({"success": False, "message": "image_id(图片文件名) 不能为空"}), 400
    try:
        new_id = create_artifact(data)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    return jsonify({"success": True, "id": new_id})


@app.route('/admin/api/artifacts/<int:artifact_id>', methods=['PUT'])
def admin_update(artifact_id):
    data = request.get_json(silent=True) or {}
    try:
        ok = update_artifact(artifact_id, data)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    if not ok:
        return jsonify({"success": False, "message": "未找到该记录"}), 404
    return jsonify({"success": True})


@app.route('/admin/api/artifacts/<int:artifact_id>', methods=['DELETE'])
def admin_delete(artifact_id):
    try:
        ok = delete_artifact(artifact_id)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    if not ok:
        return jsonify({"success": False, "message": "未找到该记录"}), 404
    return jsonify({"success": True})


# ❗ 不再使用 debug
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)