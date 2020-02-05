import * as http from '@/utils/http-client'
const collection = '/products'

export async function select(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.get(collection, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function find(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.get(`${collection}/find`, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function exist(params) {
  return new Promise((resolve, reject) => {
    http.API_MAIN.get(`${collection}/exist`, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function getMeta(params) {
  return new Promise((resolve, reject) => {
    return http.API_MAIN_ONCE({ method: 'get', params: params, url: `${collection}/get-meta` }).then((x) => {
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