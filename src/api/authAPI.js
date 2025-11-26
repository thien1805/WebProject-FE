import axios from 'axios';
import API_BASE_URL from './config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

//Add token to all request
//interceptors: let you run your code or modify request/response before they are handled by then or catch

apiClient.interceptors.request.use(
    (config) => {
    const token = localStorage.getItem('access_token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => { 
        return Promise.reject(error);
}
);

apiClient.interceptors.response.use(
    (response) => response, //Pass through successful responses
    async (error) => { //Handle 401 errors
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                const response = await axios.post(`${API_BASE_URL}/api/v1/token/refresh`, {
                    refresh: refreshToken,
                });
                const { access } = response.data;
                localStorage.setItem('access_token', access);

                //Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return apiClient(originalRequest); //send the original request again
            }
            catch (refreshError) {
              //  Refresh token failed, clear storage and bubble error to UI
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


//AUTH APIs 
export const register = async (userData) => {
    try {
        const response = await apiClient.post('/api/v1/auth/register/', userData);
        console.log('Register API response:', response);
        console.log('Register API response.data:', response.data);
        console.log('Register API response.status:', response.status);
        // Trả về response.data, nếu null/undefined thì trả về object rỗng
        // Điều này đảm bảo không throw error khi đăng ký thành công
        return response.data || {};
    } catch (error){
        console.error('Register API error:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        // Throw error.response.data nếu có (lỗi từ backend)
        // Hoặc throw error object với message nếu không có response
        if (error.response && error.response.data){
            throw error.response.data;
        }
        // Nếu không có response data, throw error object với message
        throw { general: error.message || 'Register failed. Please try again.' };
    }
};

export const login = async (credentials) => {
    try {
        // Không gửi token khi login (public endpoint)
        const response = await apiClient.post('/api/v1/auth/login/', credentials);
        console.log('Login API response:', response);
        console.log('Login API response.data:', response.data);
        console.log('Login API response.status:', response.status);
        
        //Save tokens and user to LocalStorage
        if (response.data && response.data.tokens){
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            console.log('✅ Tokens đã được lưu vào localStorage');
        }
        return response.data || {};
    } catch (error){
        console.error('Login API error:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error response.data:', error.response?.data);
        
        // Throw error data từ backend hoặc error message
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw { message: error.message || 'Login failed. Please try again.' };
    }
};

export const logout = async() => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken){
            await apiClient.post('/api/v1/auth/logout', { refresh: refreshToken });
        } 
    } catch (error){
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

export const getProfilfe = async () => {
    try {
        const response = await apiClient.get('/api/v1/auth/profile');    
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await apiClient.put('/api/v1/auth/profile', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


//Check if user is authenticated
export const isAuthenticated = ()  => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
};

export const getCurrrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export default apiClient;
