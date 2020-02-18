import http from '@/utils/http-client'
const collection = '/nhanvien'

export async function select(params) {
  return http.get(collection, { params })
}
