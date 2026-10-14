import os
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# 基于脚本所在目录加载，保证从任意位置启动都能找到特征库
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
features_db = np.load(os.path.join(BASE_DIR, "features.npy"))
paths = np.load(os.path.join(BASE_DIR, "paths.npy"))

# 归一化（提升稳定性）
features_db = features_db / np.linalg.norm(features_db, axis=1, keepdims=True)

def search(query_feature):
    query_feature = query_feature / np.linalg.norm(query_feature)

    sims = cosine_similarity([query_feature], features_db)[0]

    idx = np.argmax(sims)

    return {
        "image": paths[idx],
        "similarity": float(sims[idx])
    }