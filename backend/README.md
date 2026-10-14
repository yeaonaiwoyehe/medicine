# 器药同溯——中医药文物智能识别与知识检索系统

项目已整理为前后端两个目录：

```
G:\houduan\
├── backend\    # 后端：Flask 识别服务（本目录）
│   ├── app.py                  # 主程序：/ 首页 + /upload 识别 + /admin 管理接口
│   ├── feature_extractor.py    # ResNet18 图像特征提取
│   ├── search.py               # 特征相似度检索
│   ├── build_features.py       # 构建特征库（images -> features.npy）
│   ├── ai_fallback.py          # AI 兜底识别（USE_AI 开关）
│   ├── db.py / db_config.py    # MySQL 数据访问层 / 连接配置
│   ├── setup_db.py             # 初始化：建表 + 导入 knowledge.json
│   ├── features.npy / paths.npy  # 预构建的图像特征库
│   ├── knowledge.json          # 原始知识库（已导入 MySQL，作为兜底）
│   ├── images\                 # 识别特征库源图（244张）
│   └── deploy_public\          # 独立部署版后端样板
└── frontend\                   # 前端展示
    ├── program(4)\             # 完整前端（Next.js/React + Three.js 3D）
    ├── public_upload_no3d\     # 无 3D 上传版
    └── images1\                # 地图分布图（map.html 引用）
```

## 数据库（MySQL）

- 数据库名：`qiyao_tongsu`，连接配置在 `backend/db_config.py`（改密码改这里）。
- 表：`artifacts`（文物主表，209 条）+ `artifact_history`（历史演变子表，719 条）。
- 首次建库/重新导入：
  ```powershell
  conda activate py312
  cd G:\houduan\backend
  python setup_db.py    # 建表 + 把 knowledge.json 导入 MySQL
  ```
- 识别接口 `/upload` 优先从数据库读知识，查不到时回退 `knowledge.json`。

## 管理后台

- 页面：浏览器访问 `http://localhost:5000/admin`（文物列表、搜索、新增、编辑、删除）。
- 接口：`GET/POST /admin/api/artifacts`、`PUT/DELETE /admin/api/artifacts/<id>`。

## 运行方式

依赖：`py312` conda 环境（含 torch + Flask，已装好）。
也可用任意 Python 3.8+ 环境：`pip install -r backend\requirements.txt`

### 方式一：一键运行（推荐，前后端一起）
后端 Flask 会同时托管前端页面，只跑一个服务即可。

```powershell
# 激活环境
conda activate py312
# 启动（会托管 frontend\program(4)\public 页面）
cd G:\houduan\backend
python app.py
```

浏览器访问 http://localhost:5000/ 即可使用（首页、上传识别、3D 展示都在里面）。

### 方式二：前后端独立开发
- 后端接口：`cd G:\houduan\backend` 后 `python app.py`（端口 5000）
- 前端独立跑：`cd G:\houduan\frontend\program(4)` 后 `npm install && npm run dev`

> 说明：前端上传接口默认指向线上服务器 `http://39.107.123.87:5000/upload`；
> 本地联调时在页面 JS（`frontend\program(4)\public\js\main.js`）把
> `UPLOAD_API_URL` 改为 `http://127.0.0.1:5000/upload`。

## 重新构建特征库（新增文物图时）
```powershell
cd G:\houduan\backend
python build_features.py   # 会扫描 backend\images\ 重新生成 features.npy / paths.npy
```
