import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../api/authAPI';

export const useLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Clear token cũ trước khi login (tránh conflict với token blacklist)
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Sử dụng hàm login từ authAPI.js - tự động lưu JWT vào localStorage
      const data = await login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', data);
      
      // Kiểm tra response - backend trả về { success: true, tokens: {...}, user: {...} }
      if (data && (data.success === true || data.tokens || data.user)) {
        console.log('✅ Login successful!', data);
        console.log('🔑 Access Token:', data.tokens?.access);
        console.log('👤 User Info:', data.user);
        
        setSuccess(true);
        
        // Redirect sau khi login thành công
        setTimeout(() => {
          // Redirect dựa trên role của user
          const user = data.user;
          if (user?.role === 'doctor') {
            navigate('/doctor/dashboard');
          } else if (user?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/'); // Patient hoặc default về home
          }
        }, 1500);
      } else {
        // Response không đúng format
        setError(data?.message || 'Invalid response from server');
        console.error('Invalid login response:', data);
      }
    } catch (err) {
      // Xử lý lỗi từ API
      console.error('Login error:', err);
      console.error('Error type:', typeof err);
      console.error('Error keys:', err && typeof err === 'object' ? Object.keys(err) : 'no keys');
      
      // Xử lý nhiều format error
      let errorMessage = 'Invalid email or password';
      
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        errorMessage = err.message || err.detail || err.error || err.general || 'Invalid email or password';
        
        // Nếu có lỗi validation từ backend (array)
        if (Array.isArray(err.message)) {
          errorMessage = err.message[0];
        } else if (Array.isArray(err.detail)) {
          errorMessage = err.detail[0];
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    handleKeyPress,
  };
};

