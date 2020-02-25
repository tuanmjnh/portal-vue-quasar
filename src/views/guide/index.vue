<template>
  <q-card>
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        Dữ liệu tài liệu - hướng dẫn
      </q-toolbar-title>
    </q-toolbar>
    <q-card-actions align="right">
      <div class="col-12 row">
        <div class="col-xs-12 col-sm-5 col-md-4">
          <q-select v-model="group" :options="groups"
            :dense="$store.state.app.dense.input"
            :options-dense="$store.state.app.dense.input" label="Nhóm tài liệu"
            @input="onSelect" />
        </div>
      </div>
    </q-card-actions>
    <!-- <q-separator /> -->
    <!-- <q-card-actions> -->
    <q-list separator :dense="$store.state.app.dense.form" padding>
      <template v-for="(e,i) in items">
        <q-expansion-item switch-toggle-side :dense="$store.state.app.dense.form"
          expand-separator :label="e.title" v-if="e.descs||e.content" :key="i">
          <q-card>
            <q-card-section class="q-pa-sm">
              <div class="text-caption q-pb-sm">{{e.descs}}</div>
              <div>{{e.content}}</div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-item v-else clickable v-ripple :key="i">
          <q-item-section avatar>
            <q-icon name="arrow_right" />
          </q-item-section>
          <q-item-section>
            {{e.title}}
          </q-item-section>
          <q-item-section avatar v-if="e.attach">
            <q-icon color="primary" name="attach_file"
              @click="onOpenUrl(e.title,`${host}/${e.attach}`)">
              <q-tooltip>
                Mở tệp đính kèm
              </q-tooltip>
            </q-icon>
          </q-item-section>
          <q-item-section avatar v-if="e.url">
            <q-icon color="primary" name="link" @click="onOpenUrl(e.title,e.url)">
              <q-tooltip>
                Truy cập đến đường dẫn
              </q-tooltip>
            </q-icon>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <!-- </q-card-actions> -->
    <!-- View file dialog-->
    <q-dialog v-model="dialogView" :maximized="maximizedView" persistent>
      <view-file :dialog.sync="dialogView" :maximized.sync="maximizedView"
        :item="viewItem" />
    </q-dialog>
  </q-card>
</template>

<script>
import viewFile from '@/components/view-file'
import * as api from '@/api/news'
import * as apiCategories from '@/api/categories'
export default {
  components: { viewFile },
  data() {
    return {
      dialogView: false,
      groups: [],
      group: null,
      items: [],
      viewItem: {},
      maximizedView: false,
      host: process.env['HOST'],
      pagination: {
        key: 'guide'
      }
    }
  },
  created() {
    this.onGetKey()
  },
  watch: {
    viewDialog(val) {
      if (!val) this.maximizedView = false
    }
  },
  methods: {
    onGetKey() {
      apiCategories.select({ key: 'guide' }).then(x => {
        this.groups = x.map(x => ({ value: x.id, label: x.title }))
      })
    },
    onSelect() {
      this.pagination.group_id = this.group.value
      api.select(this.pagination).then(x => {
        this.items = x
      })
    },
    onOpenUrl(title, url) {
      // window.open(url, '_blank')
      this.maximizedView = false
      this.viewItem = { title: title, url: url }
      this.dialogView = true
    }
  }
}
</script>

<style scoped>
.q-item__section,
.q-expansion-item >>> .q-item__section {
  min-width: initial;
}
</style>
