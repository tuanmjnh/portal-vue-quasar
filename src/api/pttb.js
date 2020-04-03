import http from '@/utils/http-client';
const collection = '/pttb';

export async function getAllowUpdateTuyenThu(params) {
  return http.get(`${collection}/allow-update-tuyen-thu`, { params });
}
export async function getTuyenThu(params) {
  return http.get(`${collection}/tuyen-thu`, { params });
}

export async function updateTuyenThu(params) {
  return http.put(`${collection}/tuyen-thu`, params);
}
