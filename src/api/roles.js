import http from '@/utils/http-client'
const collection = '/roles'

export async function select(params) {
  return new Promise((resolve, reject) => {
    http.get(collection, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function insert(params) {
  return new Promise((resolve, reject) => {
    http.post(collection, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function update(params) {
  return new Promise((resolve, reject) => {
    http.put(collection, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function lock(params) {
  return new Promise((resolve, reject) => {
    http.patch(collection, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}
