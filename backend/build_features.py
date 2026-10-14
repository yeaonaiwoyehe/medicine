import os
import numpy as np
from feature_extractor import extract_feature

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
image_folder = os.path.join(BASE_DIR, "images")

features = []
paths = []

for file in os.listdir(image_folder):
    path = os.path.join(image_folder, file)

    try:
        feat = extract_feature(path)
        features.append(feat)
        paths.append(file)
        print("处理:", file)
    except:
        print("跳过:", file)

np.save(os.path.join(BASE_DIR, "features.npy"), features)
np.save(os.path.join(BASE_DIR, "paths.npy"), paths)

print("✅ 特征库构建完成")