# MyHealthCare Mock API Server

Mock API server để test frontend của MyHealthCare mà không cần backend thực.

## 📋 Yêu cầu

- Node.js 14+
- npm hoặc yarn

## 🚀 Setup & Chạy

### 1. Install dependencies

```bash
# Copy mock-package.json thành package.json trong thư mục chính (nếu chưa có)
cp mock-package.json package.json

# Install dependencies
npm install
```

### 2. Chạy mock server

```bash
# Development mode (auto-reload khi thay đổi file)
npm run dev

# Hoặc chạy trực tiếp
npm start
```

Server sẽ chạy tại: **http://localhost:5000**

### 3. Cấu hình Frontend

Trong file `src/api/authAPI.js` (hoặc config axios), đảm bảo baseURL là:

```javascript
const API_PREFIX = 'http://localhost:5000/api/v1';
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `GET /api/v1/user/me` - Lấy thông tin user hiện tại

### Appointments
- `POST /api/v1/appointments/book` - Đặt lịch khám
- `GET /api/v1/appointments/my-appointments` - Lấy danh sách appointments
- `GET /api/v1/appointments/:id` - Chi tiết appointment
- `POST /api/v1/appointments/:id/cancel` - Hủy appointment

### Medical Records
- `GET /api/v1/medical-records/my-records` - Lấy danh sách medical records
- `GET /api/v1/medical-records/:id` - Chi tiết medical record
- `POST /api/v1/medical-records` - Tạo medical record mới

### Doctors & Departments
- `GET /api/v1/departments` - Lấy danh sách departments
- `GET /api/v1/doctors/by-department/:departmentId` - Lấy danh sách doctors

### User Profile
- `GET /api/v1/user/profile` - Lấy profile user
- `POST /api/v1/user/profile` - Cập nhật profile

### Health Tracking
- `GET /api/v1/health-tracking/my-metrics` - Lấy health metrics

## 🔐 Test Credentials

```
Email: patient@example.com
Password: password123
Role: patient
```

## 🧪 Test Workflow

### 1. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password123"}'
```

### 2. Book Appointment
```bash
curl -X POST http://localhost:5000/api/v1/appointments/book \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id":"doc_001",
    "appointment_date":"2025-12-15",
    "appointment_time":"10:00",
    "symptoms":"Chest pain",
    "notes":"Feeling dizzy"
  }'
```

### 3. Get Appointments
```bash
curl http://localhost:5000/api/v1/appointments/my-appointments
```

## 📝 Data Structure

### Appointment
```json
{
  "appointment_id": "apt_001",
  "patient_id": "user_1",
  "doctor_id": "doc_001",
  "appointment_date": "2025-12-09",
  "appointment_time": "11:30",
  "status": "confirmed",
  "notes": "Chest pain",
  "symptoms": "Chest pain",
  "consultation_fee": 230961,
  "doctor": {
    "id": "doc_001",
    "full_name": "BS. Pham Thi Hoang",
    "specialization": "Internal Medicine",
    "clinic_address": "MyHealthCare Clinic, District 1, HCMC"
  }
}
```

### Medical Record
```json
{
  "record_id": "rec_001",
  "appointment_id": "apt_002",
  "patient_id": "user_1",
  "doctor_id": "doc_002",
  "diagnosis": "Normal heart condition",
  "treatment": "No treatment needed",
  "notes": "Patient is in good health",
  "doctor_comment": "Everything looks good. Continue healthy lifestyle.",
  "health_status": "Good",
  "visit_date": "2024-11-15"
}
```

## 🔄 CORS

Server đã enable CORS cho tất cả origins. Nếu bạn muốn restrict, edit `mock-server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

## 📦 Gửi cho Backend Team

Sau khi test xong, hãy copy `mock-server.js` và send cho backend team cùng với:

1. API Endpoints specification
2. Request/Response examples
3. Data models/schemas
4. Error handling conventions

Họ sẽ implement các endpoints này trên backend thực.

## 🐛 Debugging

Xem logs trong terminal để debug:
```bash
npm run dev
```

Tất cả API calls sẽ được log ra console.

## 📌 Notes

- Mock server lưu dữ liệu **in-memory** (sẽ reset khi restart)
- Không có persistent database
- JWT tokens là mock (không validate)
- Tất cả IDs được generate bằng timestamps

## 💡 Tips

1. **Test với Postman**: Import các endpoints vào Postman để test
2. **Browser DevTools**: Mở Network tab để xem request/response
3. **Console Logs**: Mock server log tất cả requests vào console

---

Made for MyHealthCare Frontend Development 🏥
