// src/pages/Login/hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Xoá token cũ
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      // Login qua AuthContext
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login result from AuthContext:', result);

      if (!result || !result.user) {
        throw new Error('Invalid response from server');
      }

      const user = result.user;
      console.log('👤 User Info:', user);

      setSuccess(true);

      // Chuẩn hoá role
      const rawRole =
        user.role || user.accountType || user.userType || 'patient';
      const role = String(rawRole).toLowerCase();

      console.log('🔎 Role after normalize:', role);

      // 👉 Redirect NGAY sau khi login thành công
      if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // patient hoặc bất kỳ role nào khác
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error type:', typeof err);
      console.error(
        'Error keys:',
        err && typeof err === 'object' ? Object.keys(err) : 'no keys'
      );

      let errorMessage = 'Invalid email or password';

      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        errorMessage =
          err.message ||
          err.detail ||
          err.error ||
          err.general ||
          'Invalid email or password';

        if (Array.isArray(err.message)) {
          errorMessage = err.message[0];
        } else if (Array.isArray(err.detail)) {
          errorMessage = err.detail[0];
        }
      }

      setError(errorMessage);
      setSuccess(false);
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
