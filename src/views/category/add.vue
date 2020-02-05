<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar icon="open_in_new" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t('route.category')}} {{$t(`route.${$route.meta.type}`)}}</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup :disable="loading_add||loading_drafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="denseButton" color="amber" icon="offline_pin" :label="$t('global.update')"
          :loading="loading_add" @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" color="blue" icon="check_circle" :label="$t('global.add')" :loading="loading_add"
          :disable="loading_drafts" @click.prevent="onSubmit(1)">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" color="amber" icon="receipt" :label="$t('global.drafts')" :loading="loading_drafts"
          :disable="loading_add" @click.prevent="onSubmit(0)">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="denseForm" class="text-deep-purple" align="justify">
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
              Level: <q-badge color="blue">{{form.level}}</q-badge>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.title" v-uppercaseFirst :dense="denseInput" :label="$t('global.title')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.code" v-uppercase :dense="denseInput" :label="$t('global.code')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" :hint="$t('category.hit_code')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.url" :dense="denseInput" v-lowercase label="URL" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model="form.quantity" type="number" :dense="denseInput" :label="$t('global.quantity')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.icon" :dense="denseInput" label="Icon">
                <template v-slot:append>
                  <q-icon :name="form.icon" /></template>
              </q-input>
            </div>
            <q-space />
            <div class="col col-md-6 self-center">
              {{$t('global.color_pick')}}:
              <q-badge :style="{backgroundColor:form.color}" @click="dialog_color_pick=true">{{form.color}}</q-badge>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.start_at" :dense="denseInput" readonly>
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
              <q-input v-model.trim="form.end_at" :dense="denseInput" readonly>
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
              <q-input v-model="form.orders" type="number" :dense="denseInput" :label="$t('global.order')"
                :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
            </div>
            <q-space v-if="item" />
            <div class="col-5 self-center" v-if="item">
              <q-toggle v-model="form.flag" :true-value="1" :dense="denseInput"
                :label="form.flag?$t('global.publish'):$t('global.drafts')" />
            </div>
          </div>
          <div class="q-gutter-sm">
            <q-input v-model.trim="form.desc" autogrow :dense="denseInput" :label="$t('global.desc')" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="content">
          <q-editor v-model="form.content" min-height="5rem" />
        </q-tab-panel>
        <q-tab-panel name="images">
          <q-uploader ref="upload" square flat :url="upload_url" :headers="upload_headers" @added="onUploadAdded"
            @uploaded="onUploaded" @finish="onUploadFinish" :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif"
            style="width:300px;">
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
          <div class="q-pt-md q-pb-md">
            <span>{{$t('global.position')}}</span>
            <q-option-group v-model="form.position" :options="positions" color="green" type="checkbox" inline />
          </div>
          <q-separator />
          <div class="q-pt-md q-pb-md">
            Tags:
          </div>
          <div class="row q-gutter-md">
            <!-- <span class="col-12 col-md-2">Tags</span> -->
            <!-- <q-space /> -->
            <div class="col-9 col-md-6">
              <q-input v-model.trim="tag" :dense="denseInput" label="Tags" />
            </div>
            <q-space />
            <div>
              <q-btn flat round color="blue" icon="add" size="sm" @click.prevent="onAddTag" />
            </div>
          </div>
          <div class="q-pb-md">
            <!-- <template> -->
            <q-chip v-for="(e,i) in form.tags" :key="i" removable clickable @click="onEditTag(e)"
              @remove="onRemoveTag(e)" color="primary" text-color="white">{{e}}</q-chip>
            <!-- </template> -->
          </div>
          <q-separator />
          <div class="q-pt-md q-pb-md">
            Attributes:
          </div>
          <div class="row q-gutter-md">
            <div class="col-6 col-md-5">
              <auto-complete :value.sync="attr.key" :items.sync="meta.keys" :label="$t('global.key')"
                :no-data="$t('table.no_data')" @input="onFilterMetaKey" />
              <!-- <q-input v-model.trim="attr.key" :dense="denseInput" v-lowercase label="Key" /> -->
            </div>
            <q-space />
            <div class="col-6 col-md-5">
              <auto-complete :value.sync="attr.value" :items.sync="meta.keys" :label="$t('global.value')"
                :no-data="$t('table.no_data')" @input="onFilterMetaKey" />
              <!-- <q-input v-model.trim="attr.value" :dense="denseInput" label="Value" /> -->
            </div>
            <q-space />
            <div>
              <q-btn flat round color="blue" icon="add" size="sm" @click.prevent="onAddMeta" />
            </div>
          </div>
          <br />
          <q-list v-if="form.meta" dense bordered separator padding class="rounded-borders">
            <q-item v-for="(v,k,i) in form.meta" :key="i">
              <q-item-section>{{k}}</q-item-section>
              <q-item-section>{{v}}</q-item-section>
              <q-item-section side>
                <q-btn flat round color="light-green" icon="edit" size="sm" @click.prevent="onEditMeta(k,v)" />
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="red" icon="cancel" size="sm" @click.prevent="onRemoveMeta(k)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
    <!-- Dialog color pick -->
    <q-dialog v-model="dialog_color_pick">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>{{$t('global.color_pick')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-card-section>
          <q-color v-model="form.color" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import autoComplete from '@/components/auto-complete'
import * as api from '@/api/categories'
export default {
  components: { autoComplete },
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    dependent: { type: Object, default: () => null },
    positions: { type: Array, default: () => [] },
    expanded: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loading_add: false,
      loading_drafts: false,
      dialog_color_pick: false,
      tabs: 'main',
      form: {},
      attr: {},
      meta: { keys: [], values: [] },
      tag: '',
      upload_url: process.env.API_FILE_UPLOAD,
      upload_headers: [{ name: 'Upload-Path', value: 'category' }, { name: 'Upload-Rename', value: true }],
      default: {
        type: this.$route.meta.type,
        code: null,
        dependent: null,
        level: 1,
        title: '',
        desc: null,
        content: '',
        url: null,
        images: null,
        quantity: null,
        position: [],
        tags: null,
        icon: 'spa',
        color: '#009688',
        meta: null,
        start_at: null, // this.$moment().format('YYYY/MM/DD'),
        end_at: null, // this.$moment().format('YYYY/MM/DD'),
        orders: 1,
        flag: 1
      }
    }
  },
  computed: {
    denseForm() {
      return this.$store.state.app.dense.form
    },
    denseInput() {
      return this.$store.state.app.dense.input
    },
    denseButton() {
      return this.$store.state.app.dense.button
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) this.form = { ...this.item }
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
      if (!this.form.tags) this.form.tags = []
      this.form.tags.push(this.tag)
      this.tag = ''
    },
    onEditTag(val) {
      this.tag = val
      this.onRemoveTag(val)
    },
    onRemoveTag(val) {
      const i = this.form.tags.indexOf(val)
      if (i > -1) this.form.tags.splice(i, 1)
      if (this.form.tags.length < 1) this.form.tags = null
    },
    onAddMeta() {
      if (!this.attr.key || !this.attr.value) {
        this.$q.notify({
          color: 'warning',
          timeout: 3000,
          message: 'The attr is required Key and Value!'
        })
        return
      }
      if (!this.form.meta) this.form.meta = []
      this.form.meta.push(this.attr)
      this.attr = {}
    },
    onEditMeta(key, val) {
      this.onRemoveMeta(key)
      this.attr = { key: key, value: val }
    },
    onRemoveMeta(key) {
      delete this.form.meta[key]
      if (Object.keys(this.form.meta).length < 1) this.form.meta = null
      this.attr = {}
    },
    onFilterMetaKey(val) {
      let data = { key: true }
      if (val) data.filter = val
      api.getMeta(data).then((x) => {
        if (x) {
          this.meta.keys = x.data
        }
      })
    },
    onFilterMetaValue(val) {
      let data = {}
      if (val) data.filter = val
      api.getMeta(data).then((x) => {
        if (x) {
          this.meta.values = x.data
        }
      })
    },
    onUploadAdded(files) {
      if (this.$refs.upload.files.length > 0) {
        this.$refs.upload.removeUploadedFiles()
      }
    },
    onUploadFinish() {
      console.log('Finish')
    },
    onUploaded(info) {
      var res = JSON.parse(info.xhr.response)
      if (res.length > 0) {
        this.form.images = `${process.env.API_UPLOAD}/${res[0].filename}`
      }
    },
    getDependent() {
      console.log(this.dependent)
      if (this.dependent) return this.dependent.label
      else return 'Root'
    },
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
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
          this.form.dependent = this.dependent._id
          this.form.level = this.dependent.level + 1
        }
        this.attr = {}
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
