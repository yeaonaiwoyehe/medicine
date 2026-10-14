# -*- coding: utf-8 -*-
"""数据库连接配置（本机 MySQL）。如需更换，直接改这里。"""
import os

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "127.0.0.1"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "Zzx051008"),
    "database": os.getenv("DB_NAME", "qiyao_tongsu"),
    "charset": "utf8mb4",
    "connect_timeout": 5,
}
