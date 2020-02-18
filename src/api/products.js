import * as http from '@/utils/http-client'
const collection = '/products'

export async function select(params) {
  return http.API_MAIN.get(collection, { params })
}

export async function find(params) {
  return http.API_MAIN.get(`${collection}/find`, { params })
}

export async function exist(params) {
  return http.API_MAIN.get(`${collection}/exist`, { params })
}

export async function getMeta(params) {
  return http.API_MAIN_ONCE({ method: 'get', params: params, url: `${collection}/get-meta` })
}

export async function insert(params) {
  return http.API_MAIN.post(collection, params)
}

export async function update(params) {
  return http.API_MAIN.put(collection, params)
}

export async function lock(params) {
  return http.API_MAIN.patch(collection, params)
}
