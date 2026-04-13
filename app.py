from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid

from feature_extractor import extract_feature
from search import search

USE_AI = False
if USE_AI:
    from ai_fallback import call_ai_api

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "program(4)", "public")

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
            info = knowledge.get(img_id, {})

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


# ❗ 不再使用 debug
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)