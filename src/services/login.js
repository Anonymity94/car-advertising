import request from '@/utils/request';

export async function login(params) {
  return request('/api/account/admin/login', {
    method: 'POST',
    body: params,
  });
}

export async function logout() {
  return request('/api/account/admin/logout', {
    method: 'GET',
  });
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
