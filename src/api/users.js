import http from '@/utils/http-client'
const collection = '/users'

export async function select(params) {
  return new Promise((resolve, reject) => {
    http.get(collection, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function find(params) {
  return new Promise((resolve, reject) => {
    http.get(`${collection}/find`, { params }).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}

export async function getPasword(params) {
  return new Promise((resolve, reject) => {
    http.get(`${collection}/get-password`, { params }).then((x) => {
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

export async function resetPassword(params) {
  return new Promise((resolve, reject) => {
    http.post(`${collection}/reset-password`, params).then((x) => {
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

export async function setRoles(params) {
  return new Promise((resolve, reject) => {
    http.patch(`${collection}/set-roles`, params).then((x) => {
      resolve(x)
    }).catch((e) => {
      reject(e)
    })
  })
}
