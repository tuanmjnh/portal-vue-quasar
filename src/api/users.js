import http from '@/utils/http-client'
const collection = '/users'

export async function select(params) {
  return http.get(collection, { params })
}

export async function find(params) {
  return http.get(`${collection}/find`, { params })
}

export async function getPasword(params) {
  return http.get(`${collection}/get-password`, { params })
}

export async function insert(params) {
  return http.post(collection, params)
}

export async function update(params) {
  return http.put(collection, params)
}

export async function resetPassword(params) {
  return http.post(`${collection}/reset-password`, params)
}

export async function lock(params) {
  return http.patch(collection, params)
}

export async function setRoles(params) {
  return http.patch(`${collection}/set-roles`, params)
}
