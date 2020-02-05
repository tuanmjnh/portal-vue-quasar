<template>
  <q-list class="rounded-borders">
    <template v-for="(item,index) in items">
      <q-expansion-item v-if="isExpansion(item.children)" :key="index" expand-separator
        :header-class="onActive(item.name)?'q-item--active':''" :default-opened="onActive(item.name)" :dense="dense">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon color="blue-grey" :name="item.icon" />
          </q-item-section>
          <q-item-section>{{$t(`route.${item.title}`)}}</q-item-section>
        </template>
        <template v-for="(c,ii) in item.children">
          <q-expansion-item v-if="isExpansion(c.children)" :key="ii" expand-separator switch-toggle-side dense-toggle
            :header-inset-level=".1" :header-class="onActive(c.name)?'q-item--active':''"
            :default-opened="onActive(c.name)">
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon color="blue-grey" :name="c.iconn" />
              </q-item-section>
              <q-item-section>{{$t(`route.${c.title}`)}}</q-item-section>
            </template>
            <template v-for="(cc,iii) in c.children">
              <drawer-item :key="iii" :dense="dense" :item="cc" :basePath="`${item.path}/${c.path}`"
                :active="onActive(cc.name)" :inset-level=".1" />
            </template>
          </q-expansion-item>
          <drawer-item v-else :key="ii" :dense="dense" :item="c" :base-path="item.path" :active="onActive(c.name)"
            :inset-level=".5" />
          <!-- <drawer-item v-else :key="ii" :base-path:="" :path="c.path" :icon="c.meta.icon" :title="c.meta.title"
              :hidden="c.meta.hidden" /> -->
        </template>
      </q-expansion-item>
      <!-- <q-item v-if="item.meta && !item.meta.hidden" :key="index" clickable v-ripple @click="onRouterLink(item)">
          <q-item-section avatar>
            <q-icon :name="item.meta.icon" />
          </q-item-section>
          <q-item-section>{{$t(`route.${item.meta.title}`)}}</q-item-section>
        </q-item> -->
      <drawer-item v-else :key="index" :item="item" :active="onActive(item.name)" :dense="dense" />
      <!-- <drawer-item :key="index" :path="item.path" :icon="item.meta.icon" :title="item.meta.title"
          :hidden="item.meta.hidden" /> -->
    </template>
  </q-list>
</template>
<script>
import drawerItem from './drawer-item'
// import { openURL } from 'quasar'
// import { isExternal } from '@/utils/validate'
export default {
  components: { drawerItem },
  props: {
    items: { type: Array, default: () => [] },
    dense: { type: Boolean, default: false }
  },
  data() {
    return {
    }
  },
  methods: {
    // onRouterLink(item) {
    //   if (isExternal(item.path)) {
    //     openURL(item.path)
    //   } else {
    //     this.$router.push(item.path).catch(err => { })
    //   }
    // }
    onActive(name) {
      return this.$route.matched.map(x => x.name).indexOf(name) > -1 || false
    },
    isExpansion(children) {
      if (children && children.length) {
        const x = children.filter(x => x.hidden === false)
        // console.log(x)
        if (x && x.length > 0) return true
        else return false
      } else return false
    }
  }
}
</script>
<style lang="scss">
// .q-expansion-item--expanded {
//   .q-expansion-item__content {
//     background-color: #243040;
//   }
// }
</style>
