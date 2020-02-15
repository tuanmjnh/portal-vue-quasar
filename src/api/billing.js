import http from '@/utils/http-client'
const collection = '/billing'

export async function getKyCuoc(params) {
  return http.get(`${collection}/get-kycuoc`, { params })
}
