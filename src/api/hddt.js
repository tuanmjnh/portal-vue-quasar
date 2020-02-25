import http from '@/utils/http-client'
const collection = '/hddt'

export async function select(params) {
  return http.get(collection, { params })
}

export async function getData(params) {
  return http.get(`${collection}/get-data`, { params })
}
