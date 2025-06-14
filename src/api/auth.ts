import api from './index';

export async function login(username: string, password: string) {
  const response = await api.post('/authentication/login', {
    username,
    password
  });
  return response.data;
}

export async function register(username: string, email: string, password: string) {
  const response = await api.post('/authentication/register', {
    username,
    email,
    password
  });
  return response.data;
}

export async function changePassword(username: string, newPassword: string) {
  const res = await api.post('/authentication/change-password', { username, newPassword });
  return res.data;
}