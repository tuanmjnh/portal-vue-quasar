<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t('route.category')}}</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup
        :disable="loading_add||loading_drafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="$store.state.app.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="loading_add"
          @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" :dense="$store.state.app.dense.button" color="blue"
          icon="check_circle" :label="$t('global.add')" :loading="loading_add"
          :disable="loading_drafts" @click.prevent="onSubmit(1)">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" :dense="$store.state.app.dense.button" color="amber"
          icon="receipt" :label="$t('global.drafts')" :loading="loading_drafts"
          :disable="loading_add" @click.prevent="onSubmit(0)">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.state.app.dense.form"
        class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="content" :label="$t('global.content')" />
        <q-tab name="images" :label="$t('global.images')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              Parent: <q-badge color="blue">{{dependent?dependent.label:'Root'}}</q-badge>
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              Level: <q-badge color="blue">{{form.levels}}</q-badge>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div v-if="!dependent&&!item" class="col-12 col-md-5">
              <q-select v-model="key" :options="keys" :dense="$store.state.app.dense.input"
                :options-dense="$store.state.app.dense.input" :label="$t('global.types')"
                :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]" />
            </div>
            <!-- <div class="col-1" v-if="!dependent&&!item"></div> -->
            <div class="col">
              <q-input v-model.trim="form.code" v-uppercase :dense="$store.state.app.dense.input"
                :label="$t('global.code')" :rules="[v=>!!v||$t('error.required')]"
                :hint="$t('category.hit_code')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.title" v-uppercaseFirst
                :dense="$store.state.app.dense.input" :label="$t('global.title')"
                :rules="[v=>!!v||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.url" :dense="$store.state.app.dense.input" v-lowercase
                label="URL" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.icon" :dense="$store.state.app.dense.input" label="Icon">
                <template v-slot:append>
                  <div v-html="form.icon"></div>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model="form.quantity" type="number" :dense="$store.state.app.dense.input"
                :label="$t('global.quantity')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <q-space />
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.start_at" :dense="$store.state.app.dense.input" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="startAt" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.start_at" today-btn @input="()=>$refs.startAt.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col col-md-6">
              <q-input v-model.trim="form.end_at" :dense="$store.state.app.dense.input" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="endAt" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.end_at" today-btn @input="()=>$refs.endAt.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-3">
              <q-input v-model="form.orders" type="number" :dense="$store.state.app.dense.input"
                :label="$t('global.order')" :rules="[v=>!!v||$t('error.required')]"
                class="col-md-4" />
            </div>
            <q-space v-if="item" />
            <div class="col-5 self-center" v-if="item">
              <q-toggle v-model="form.flag" :true-value="1" :dense="$store.state.app.dense.input"
                :label="form.flag?$t('global.publish'):$t('global.drafts')" />
            </div>
          </div>
          <div class="q-gutter-sm">
            <q-input v-model.trim="form.descs" autogrow :dense="$store.state.app.dense.input"
              :label="$t('global.desc')" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="content">
          <q-editor v-model="form.content" min-height="5rem" />
        </q-tab-panel>
        <q-tab-panel name="images">
          <q-uploader ref="upload" square flat :url="upload_url" :headers="upload_headers"
            @added="onUploadAdded" @uploaded="onUploaded" @finish="onUploadFinish"
            :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif" style="width:100%">
            <!-- <template v-slot:list="scope"></template> -->
          </q-uploader>
          <q-space />
          <q-img :src="form.avatar" spinner-color="red" class="rounded-borders"
            style="height:200px;max-width:284px;margin-top:55px;">
            <!-- <div class="absolute-top text-subtitle1 text-center">
              Caption
            </div> -->
          </q-img>
          <!-- <q-input v-model="form.avatar" :label="$t('users.avatar')" /> -->
        </q-tab-panel>
        <q-tab-panel name="attributes">
          <div class="q-pt-md q-pb-md" v-if="positions&&positions.length">
            <span>{{$t('global.position')}}</span>
            <q-option-group v-model="form.position" :options="positions" color="green"
              type="checkbox" inline />
          </div>
          <q-separator v-if="positions&&positions.length" />
          <div class="q-pt-md q-pb-md">
            Tags:
          </div>
          <div class="row q-gutter-md">
            <!-- <span class="col-12 col-md-2">Tags</span> -->
            <!-- <q-space /> -->
            <div class="col-9 col-md-6">
              <q-input v-model.trim="tag" :dense="$store.state.app.dense.input" label="Tags" />
            </div>
            <q-space />
            <div>
              <q-btn flat round color="blue" icon="add" size="sm" @click.prevent="onAddTag" />
            </div>
          </div>
          <div class="q-pb-md">
            <!-- <template> -->
            <q-chip v-for="(e,i) in tags" :key="i" removable clickable @click="onEditTag(e)"
              @remove="onRemoveTag(e)" color="primary" text-color="white">{{e}}</q-chip>
            <!-- </template> -->
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
  </q-card>
</template>

<script>
// import autoComplete from '@/components/auto-complete'
import * as api from '@/api/categories'
export default {
  components: {},
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    dependent: { type: Object, default: () => null },
    positions: { type: Array, default: () => [] },
    expanded: { type: Array, default: () => [] },
    keys: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loading_add: false,
      loading_drafts: false,
      tabs: 'main',
      form: {},
      meta: { keys: [], values: [] },
      key: null,
      tags: [],
      tag: '',
      upload_url: process.env.API_FILE_UPLOAD,
      upload_headers: [{ name: 'Upload-Path', value: 'category' }, { name: 'Upload-Rename', value: true }],
      default: {
        app_key: '',
        code: null,
        dependent: 0,
        levels: 1,
        title: '',
        descs: null,
        content: '',
        url: null,
        image: null,
        quantity: 0,
        position: null,
        tags: null,
        attach: null,
        icon: '<i class="material-icons">class</i>',
        color: '#009688',
        meta: null,
        start_at: null, // this.$moment().format('YYYY/MM/DD'),
        end_at: null, // this.$moment().format('YYYY/MM/DD'),
        orders: 1,
        flag: 1
      }
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) {
          this.form = { ...this.item }
          if (this.form.tags) this.tags = this.form.tags.split(',')
          if (!this.form.content) this.form.content = ''
          if (!this.form.image) this.form.image = null
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onAddTag() {
      if (!this.tag) {
        this.$q.notify({
          color: 'warning',
          timeout: 3000,
          message: 'The attr is required Key and Value!'
        })
        return
      }
      if (!this.tags) this.tags = []
      this.tags.push(this.tag)
      this.tag = ''
    },
    onEditTag(val) {
      this.tag = val
      this.onRemoveTag(val)
    },
    onRemoveTag(val) {
      const i = this.tags.indexOf(val)
      if (i > -1) this.tags.splice(i, 1)
      if (this.form.length < 1) this.tags = null
    },
    onUploadAdded(files) {
      if (this.$refs.upload.files.length > 0) {
        this.$refs.upload.removeUploadedFiles()
      }
    },
    onUploadFinish() {
      // console.log('Finish')
    },
    onUploaded(info) {
      var res = JSON.parse(info.xhr.response)
      if (res.length > 0) {
        this.form.image = `${process.env.API_UPLOAD}/${res[0].filename}`
      } else this.form.image = null
    },
    getDependent() {
      if (this.dependent) return this.dependent.label
      else return 'Root'
    },
    onSubmit(action) {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.tags = this.tags.join(',')
          if (this.key && this.key.value) this.form.app_key = this.key.value
          if (this.item) {
            this.loading_add = true
            api.update(this.form).then((x) => {
              if (x.ok) {
                if (!this.dependent) {
                  const index = this.items.indexOf(this.item)
                  if (index > -1) this.items.splice(index, 1, this.form)
                } else {
                  const index = this.dependent.children.indexOf(this.item)
                  if (index > -1) this.dependent.children.splice(index, 1, this.form)
                }
              }
            }).finally(() => {
              this.loading_add = false
            })
          } else {
            this.form.flag = action
            if (action) this.loading_add = true
            else this.loading_drafts = true
            api.insert(this.form).then((x) => {
              if (this.dependent) {
                this.expanded.push(x._id)
                if (!this.dependent.children) this.dependent.children = []
                this.dependent.children.push(x)
              } else this.items.push(x)
            }).finally(() => {
              this.loading_add = false
              this.loading_drafts = false
              this.reset()
            })
          }
        }
      })
    },
    findRoutes(routes, val, by) {
      const rs = []
      for (let e of routes) {
        if (e[by] === val) return e
      }
    },
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        if (this.dependent) {
          this.form.app_key = this.dependent.app_key
          this.form.dependent = this.dependent.id
          this.form.levels = this.dependent.levels + 1
        }
        this.form.image = null
        this.tags = []
        this.tag = ''
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style>
</style>
