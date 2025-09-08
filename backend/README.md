# Cafe Manager - Backend API

Backend API cho ứng dụng quản lý quán cafe.

## Cấu trúc project

```
backend/
├── config/
│   └── database.js     # Cấu hình database
├── index.js           # Entry point
├── package.json       # Dependencies
├── .env              # Environment variables
└── .gitignore        # Git ignore rules
```

## Cài đặt và chạy

1. **Cài đặt dependencies:**

    ```bash
    npm install
    ```

2. **Cấu hình database:**

    - Tạo file `.env` dựa trên `.env.example`
    - Điền thông tin database Aiven vào file `.env`

3. **Chạy server:**

    ```bash
    npm run dev
    ```

4. **Test kết nối database:**
    - Mở browser: `http://localhost:5000/test-db`
    - Hoặc dùng curl: `curl http://localhost:5000/test-db`

## API Endpoints

### Cơ bản

-   `GET /` - Thông tin API
-   `GET /health` - Health check
-   `GET /test-db` - Test kết nối database

## Database (Aiven)

Project sử dụng MySQL trên Aiven cloud. Cần cấu hình các biến môi trường:

```env
DB_HOST=your_aiven_host
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=cafe_manager
```

## Development

Server sẽ chạy trên port 5000 (hoặc PORT trong .env).
CORS đã được cấu hình để cho phép frontend React (port 5173) truy cập.
