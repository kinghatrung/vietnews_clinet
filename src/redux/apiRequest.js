import axios from 'axios';
import {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
} from './authSlice';
import {
    putUserStart,
    putUserSuccess,
    putUserFailed,
    deleteUserFailed,
    deleteUserStart,
    deleteUserSuccess,
    getUserFailed,
    getUserStart,
    getUserSuccess,
} from './userSlice';

// người dùng đăng nhâọ
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:8080/api/auth/login', user);
        dispatch(loginSuccess(res.data));
        navigate('/');
    } catch (err) {
        dispatch(loginFailed());
        throw err;
    }
};

// người dùng đăng ký
export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post('http://localhost:8080/api/auth/register', user);
        dispatch(registerSuccess(res.data));
        navigate('/');
    } catch (err) {
        dispatch(registerFailed(err.response.data));
        throw err;
    }
};

// Lấy tất cả người dùng
export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUserStart());
    try {
        const res = await axiosJWT.get('http://localhost:8080/api/user', {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUserSuccess(res.data));
    } catch (err) {
        dispatch(getUserFailed());
    }
};

// Xóa người dùng
export const deleteUser = async (accessToken, dispatch, id) => {
    dispatch(deleteUserStart());
    try {
        const res = await axios.delete('http://localhost:8080/api/user/' + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (err) {
        dispatch(deleteUserFailed(err.response.data));
    }
};

// Sửa người dùng
export const putUser = async (accessToken, dispatch, id, updatedUser) => {
    dispatch(putUserStart());
    try {
        const res = await axios.put('http://localhost:8080/api/user/' + id, updatedUser, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(putUserSuccess(res.data));
    } catch (err) {
        dispatch(putUserFailed(err.response.data));
    }
};

// Người dùng đăng xuất
export const logoutUser = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post('http://localhost:8080/api/auth/logout', id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        navigate('/');
    } catch (err) {
        dispatch(logOutFailed());
    }
};
