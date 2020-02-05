export default {
  // sidebar: state => state.app.sidebar,
  routes: state => state.auth.constant_routes.concat(state.auth.routes),
  language: state => state.app.language,
  languages: state => state.app.languages,
  size: state => state.app.size,
  sizes: state => state.app.sizes
  // device: state => state.app.device,
  // useLogs: state => state.app.useLogs,
  // visitedViews: state => state.tagsView.visitedViews,
  // cachedViews: state => state.tagsView.cachedViews,
  // // token: state => state.user.token,
  // // avatar: state => state.user.avatar,
  // // name: state => state.user.name,
  // // introduction: state => state.user.introduction,
  // // roles: state => state.user.roles,
  // permission_routes: state => state.permission.routes,
  // errorLogs: state => state.errorLog.logs,
  // roles: state => state.roles.items,
  // authUser: state => {
  //   // if (state.auth.user.phoneNumber) state.auth.user.phoneNumber = state.auth.user.phoneNumber.replace(`+${state.auth.user.phoneRegion}`, '')
  //   return state.auth.user
  // }
}
