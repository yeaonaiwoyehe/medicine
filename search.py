import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# 加载数据库
features_db = np.load("features.npy")
paths = np.load("paths.npy")

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