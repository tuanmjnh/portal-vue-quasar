import http from '@/utils/http-client'
const collection = '/auth'

export async function checkToken(params) {
  return new Promise((resolve, reject) => {
    http.get(collection, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function login(params) {
  return new Promise((resolve, reject) => {
    http.post(collection, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}
