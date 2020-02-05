import * as http from '@/utils/http-client'
const collection = '/types'

export async function select(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.get(collection, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}
export async function getKey(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.get(`${collection}/get-key`, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}
export async function insert(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.post(collection, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function update(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.put(collection, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function lock(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.patch(collection, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}
