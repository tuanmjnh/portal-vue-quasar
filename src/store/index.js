import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// export default function (/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     modules,
//     getters,
//     state: {
//       $appLoading: true,
//       $getLoading: false,
//       $commitLoading: false
//     },
//     // enable strict mode (adds overhead!)
//     // for dev mode only
//     strict: process.env.DEV
//   })

//   return Store
// }

const Store = new Vuex.Store({
  modules,
  getters,
  state: {
    loading: {
      get: false,
      post: false,
      put: false,
      patch: false,
      delete: false
    }
  },
  mutations: {
    SET_LOADING(state, obj) {
      state.loading[obj.key] = obj.value
    },
    DONE_LOADING(state) {
      state.loading = {
        get: false,
        post: false,
        put: false,
        patch: false,
        delete: false
      }
    }
  },
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
})

export default Store
