<template>
  <!-- <q-list> -->
  <!-- <template v-for="(item,index) in items"> -->
  <q-item v-if="!item.hidden" clickable v-ripple @click="onRouterLink(item.path)" :inset-level="insetLevel"
    :active="active" :dense="dense">
    <q-item-section avatar>
      <q-icon :name="item.icon" color="blue-grey" />
    </q-item-section>
    <q-item-section>{{$t(`route.${item.title}`)}}</q-item-section>
  </q-item>
  <!-- </template> -->
  <!-- </q-list> -->
</template>
<script>
import path from 'path'
import { openURL } from 'quasar'
import { isExternal } from '@/utils/validate'
export default {
  props: {
    // items: { type: Array, default: () => [] }
    basePath: { type: String, default: null },
    // path: { type: String, default: '' },
    // icon: { type: String, default: '' },
    // title: { type: String, default: '' },
    // hidden: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    active: { type: Boolean, default: () => false },
    dense: { type: Boolean, default: () => false },
    insetLevel: { type: Number, default: 0 }
  },
  data() {
    return {
    }
  },
  methods: {
    onRouterLink(path) {
      if (isExternal(path)) {
        openURL(path)
      } else {
        this.$router.push(this.basePath ? `${this.basePath}/${path}` : path).catch(e => { })
      }
      // console.log(this.$route)
      // var x = path.resolve('category', path)
    }
  }
}
</script>
