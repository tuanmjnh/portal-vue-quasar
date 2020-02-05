import Cookies from 'js-cookie'
import { Get, Set, GetAll } from '@/i18n'
import { i18n } from '@/boot/i18n'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  sizes: [
    { key: 'md', value: 14 },
    { key: 'lg', value: 18 },
    { key: 'sm', value: 12 },
    { key: 'xs', value: 10 }
  ],
  size: Cookies.get('size') || 'md',
  language: Get(),
  languages: GetAll(),
  useLogs: true,
  dense: {
    form: true,
    button: false,
    input: true,
    table: true,
    menu: false
  },
  darkMode: Cookies.get('darkMode') && Cookies.get('darkMode').toLowerCase() === 'true' || false
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    i18n.locale = language
    Set(language)
  },
  SET_SIZE: (state, size) => {
    state.size = size.key
    Cookies.set('size', size.key)
    document.body.style.fontSize = `${size.value}px`
  },
  SET_DARK_MODE: (state, val) => {
    state.darkMode = val
    Cookies.set('darkMode', val)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
