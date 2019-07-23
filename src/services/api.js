import request from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export async function upload(formData) {
  return request('/api/upload', {
    method: 'POST',
    body: formData,
  });
}
