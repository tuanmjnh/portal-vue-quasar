<template>
  <div id="q-app">
    <!-- <q-spinner-pie color="primary" size="2em" /> -->
    <q-inner-loading :showing="$store.state.loading.get">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
    <!-- <b>{{$q.platform}}</b> -->
    <component
      v-if="$store.state.auth.user && $store.state.auth.user.roles && $store.state.auth.user.roles.length>0"
      :is="layout">
      <!-- <transition name="fade" mode="out-in"> -->
      <!-- <transition  enter-active-class="animated fadeIn"> -->
      <!-- <q-transition appear enter="fadeInLeft" leave="fadeOutRight" mode="out-in"> -->
      <router-view :key="$route.path" />
      <!-- </transition> -->
      <!-- </transition> -->
      <!-- <router-view :layout.sync="layout" /> -->
    </component>
    <router-view :key="$route.path" v-else />
  </div>
</template>

<script>
import spa from './layouts/spa/index'
import mobile from './layouts/mobile'
import electron from './layouts/electron'
export default {
  name: 'App',
  components: { spa, mobile, electron },
  data() {
    return {
      platform: 'tuanmjnh'
    }
  },
  created() {
    this.$q.dark.set(this.$store.state.app.darkMode)
  },
  computed: {
    layout() {
      if (this.$q.platform.is.mobile) return 'mobile'
      else if (this.$q.platform.is.electron) return 'electron'
      else return 'spa'
    }
  }
}
</script>
