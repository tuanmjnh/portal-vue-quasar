import http from '@/utils/http-client'
const collection = '/diaban'

export async function getQuan(params) {
  return http.get(`${collection}/quan`, { params })
}

export async function getPhuong(params) {
  return http.get(`${collection}/phuong`, { params })
}

export async function getPho(params) {
  return http.get(`${collection}/pho`, { params })
}

export async function update(params) {
  return http.post(collection, params)
}

export async function createPhoNVKC(params) {
  return http.post(`${collection}/create-pho-nv-kc`, params)
}

export async function updateDonvi(params) {
  return http.put(`${collection}/update-donvi`, params)
}

export async function updateDonviNV(params) {
  return http.put(`${collection}/update-donvi-nv`, params)
}

export async function updateDBPhoLike(params) {
  return http.put(`${collection}/update-pho-like`, params)
}

export async function updateDBQuan(params) {
  return http.put(`${collection}/update-quan`, params)
}

export async function updateDBPhuong(params) {
  return http.put(`${collection}/update-phuong`, params)
}

export async function updateDBPho(params) {
  return http.put(`${collection}/update-pho`, params)
}

export async function updatePhoCuoc(params) {
  return http.put(`${collection}/update-pho-cuoc`, params)
}

export async function updateDoiTuongCuoc(params) {
  return http.put(`${collection}/update-doituong-cuoc`, params)
}
