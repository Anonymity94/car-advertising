import request from '@/utils/request';

export async function adminLogin(params) {
  return request('/account/admin/login', {
    method: 'POST',
    body: params,
  });
}

export async function adminLogout() {
  return request('/account/admin/logout', {
    method: 'GET',
  });
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
