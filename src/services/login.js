import request from '@/utils/request';

export async function adminLogin(params) {
  return request('/api/account/admin/login', {
    method: 'POST',
    body: params,
  });
}

export async function adminLogout() {
  return request('/api/account/admin/logout', {
    method: 'GET',
  });
}
