import http from '@/utils/http-client'
const collection = '/loai-nv'

export async function select(params) {
  return new Promise((resolve, reject) => {
    http.get(collection, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}
