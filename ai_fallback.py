import requests
import base64
import os

def call_ai_api(image_path):
    API_KEY = os.getenv("API_KEY")
    SECRET_KEY = os.getenv("SECRET_KEY")

    if not API_KEY or not SECRET_KEY:
        return {
            "name": "AI未配置",
            "similarity": 0,
            "description": "未配置API_KEY",
            "source": "baiduAI"
        }

    # 获取token
    token_url = "https://aip.baidubce.com/oauth/2.0/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": API_KEY,
        "client_secret": SECRET_KEY
    }

    token_resp = requests.post(token_url, data=data)
    access_token = token_resp.json().get("access_token")

    # 图片转base64
    with open(image_path, "rb") as f:
        img_base64 = base64.b64encode(f.read()).decode()

    # 调用识别
    url = "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general"
    params = {"access_token": access_token}
    payload = {"image": img_base64}

    resp = requests.post(url, params=params, data=payload)
    result = resp.json()

    if "result" in result and len(result["result"]) > 0:
        best = result["result"][0]
        return {
            "name": best["keyword"],
            "similarity": best["score"],
            "description": f"AI识别：{best['keyword']}（{best['score']}）",
            "source": "baiduAI"
        }
    else:
        return {
            "name": "未识别",
            "similarity": 0,
            "description": "AI无法识别",
            "source": "baiduAI"
        }