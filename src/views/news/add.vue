<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t('route.category')}}</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup
        :disable="loadingAdd||loadingDrafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="$store.state.app.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="loadingAdd"
          @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" color="blue" icon="check_circle" :label="$t('global.add')"
          :loading="loadingAdd" :disable="loadingDrafts" @click.prevent="onSubmit(1)"
          :dense="$store.state.app.dense.button">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" color="amber" icon="receipt" :label="$t('global.drafts')"
          :loading="loadingDrafts" :disable="loadingAdd" @click.prevent="onSubmit(0)"
          :dense="$store.state.app.dense.button">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.state.app.dense.form"
        class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="content" :label="$t('global.content')" />
        <q-tab name="upload" :label="$t('global.upload')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-select v-model="type" :options="types" :dense="$store.state.app.dense.input"
                :options-dense="$store.state.app.dense.input" :label="$t('global.types')"
                :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]"
                @input="onGetCategories" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-select v-model="category" :options="categories"
                :dense="$store.state.app.dense.input" :options-dense="$store.state.app.dense.input"
                label="Danh mục" :rules="[v=>v&&Object.keys(v).length||$t('error.required')]" />
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
              <q-input v-model.trim="form.url" :dense="$store.state.app.dense.input"
                label="Đường dẫn file" />
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
        <q-tab-panel name="upload">
          <div class="row q-gutter-xs">
            <q-btn icon="cloud_upload" label="Tải ảnh" :dense="$store.state.app.dense.button"
              @click="dialogUploadImage=true" />
          </div>
          <br />
          <div class="row q-gutter-xs" v-if="image&&image.length">
            <q-img v-for="(e,i) in image" :key="i" :src="`${host}/${e.fullName}`"
              spinner-color="primary" class="rounded-borders"
              style="height: 140px; max-width: 150px">
            </q-img>
          </div>
          <q-separator class="q-mb-md q-mt-md" />
          <div class="row q-gutter-xs">
            <q-btn icon="attach_file" label="Tải tệp đính kèm"
              :dense="$store.state.app.dense.button" @click="dialogUploadAttach=true" />
          </div>
          <br />
          <div class="row q-gutter-xs" v-if="attach&&attach.length">
            <q-list dense>
              <q-item v-for="(e,i) in attach" :key="i">
                <q-item-section>{{e.fileName}}</q-item-section>
                <q-item-section avatar class="cursor-pointer"
                  @click="onOpenViewFile(e.fileName,`${host}/${e.fullName}`)">
                  <q-icon color="primary" name="remove_red_eye" />
                </q-item-section>
              </q-item>
            </q-list>
            <!-- <q-btn v-for="(e,i) in attach" :key="i" flat color="primary"
              icon="attach_file" :label="e.filename"
              :dense="$store.state.app.dense.button"
              @click="onOpenViewFile(e.filename,`${host}/${e.fullName}`)" /> -->
          </div>
        </q-tab-panel>
        <q-tab-panel name="attributes">
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
              <q-btn flat round color="blue" icon="add" size="sm"
                :dense="$store.state.app.dense.button" @click.prevent="onAddTag" />
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
    <!-- Upload Image dialog-->
    <q-dialog v-model="dialogUploadImage" persistent>
      <q-card style="width:500px">
        <q-toolbar>
          <q-avatar icon="cloud_upload" />
          <q-toolbar-title>Tải ảnh</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-uploader ref="uploadImages" square flat :url="uploadUrl" :headers="uploadHeaders"
            @uploaded="onUploadedImages" @finish="onUploadFinish" :max-file-size="1024*1024*2"
            accept=".jpg,.jpeg,.png,.gif" style="width:100%">
            <!-- <template v-slot:list="scope"></template> -->
          </q-uploader>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Upload attach dialog-->
    <q-dialog v-model="dialogUploadAttach" persistent>
      <q-card style="width:500px">
        <q-toolbar>
          <q-avatar icon="attach_file" />
          <q-toolbar-title>Tải tệp đính kèm</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-uploader ref="uploadAttach" square flat :url="uploadUrl" :headers="uploadHeaders"
            @uploaded="onUploadedAttach" @finish="onUploadFinish" :max-file-size="1024*1024*50"
            accept=".doc,.docx,.xls,.xlsx,.pdf" style="width:100%">
            <!-- <template v-slot:list="scope"></template> -->
          </q-uploader>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- View file dialog-->
    <q-dialog v-model="dialogView" :maximized="maximizedView" persistent>
      <view-file :dialog.sync="dialogView" :maximized.sync="maximizedView" :item="viewItem" />
    </q-dialog>
  </q-card>
</template>

<script>
// import autoComplete from '@/components/auto-complete'
import viewFile from '@/components/view-file'
import * as api from '@/api/news'
import * as apiTypes from '@/api/types'
import * as apiCategories from '@/api/categories'
export default {
  components: { viewFile },
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] }
    // types: { type: Array, default: () => [] },
    // categories: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loadingAdd: false,
      loadingDrafts: false,
      dialogUploadImage: false,
      dialogUploadAttach: false,
      dialogView: false,
      tabs: 'main',
      form: {},
      types: [],
      type: null,
      categories: [],
      category: null,
      tags: [],
      tag: '',
      host: process.env['HOST'],
      uploadUrl: process.env.API_FILE_UPLOAD,
      image: [],
      attach: [],
      viewItem: {},
      maximizedView: false,
      uploadHeaders: [
        { name: 'Upload-Path', value: 'news' },
        { name: 'Upload-Rename', value: true }
        // { name: 'Content-Type', value: 'multipart/form-data' }
      ],
      default: {
        app_key: '',
        group_id: null,
        title: '',
        icon: '<i class="material-icons">class</i>',
        image: null,
        url: null,
        quantity: 0,
        descs: null,
        content: '',
        attach: null,
        tags: null,
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
          if (this.form.image) {
            const tmp = { fileName: this.form.image, fullName: this.form.image }
            tmp.fileName = this.form.image.split('/')
            tmp.fileName = tmp.fileName[tmp.fileName.length - 1]
            this.image.push(tmp)
          }
          if (this.form.attach) {
            const tmp = { fileName: this.form.attach, fullName: this.form.attach }
            tmp.fileName = this.form.image.split('/')
            tmp.fileName = tmp.fileName[tmp.fileName.length - 1]
            this.attach.push(tmp)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.onSelect({ pagination: this.pagination })
    this.onGetTypes()
  },
  methods: {
    onGetTypes(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.length > 0) {
          this.types = x.map(x => ({ label: x.title, value: x.code }))
          if (this.item) {
            if (this.form.app_key) this.type = this.types.find(x => x.value === this.form.app_key)
            this.onGetCategories()
          } else {
            this.type = this.types[0]
          }
        }
      })
    },
    onGetCategories(props) {
      this.category = null
      apiCategories.select({ key: this.type.value }).then((x) => {
        this.categories = x.map(x => ({ label: x.title, value: x.id }))
        if (this.item) {
          if (this.form.group_id) this.category = this.categories.find(x => x.value === this.form.group_id)
        }
      })
    },
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
    onUploadedImages(info) {
      var res = JSON.parse(info.xhr.response)
      if (res.length > 0) {
        this.form.image = res[0].fullName// `${process.env.API_UPLOAD}/${res[0].fullName}`
        this.image = res
      } else this.form.image = null
    },
    onUploadedAttach(info) {
      var res = JSON.parse(info.xhr.response)
      if (res.length > 0) {
        this.form.attach = res[0].fullName// `${process.env.API_UPLOAD}/${res[0].fullName}`
        this.attach = res
      } else this.form.attach = null
    },
    onUploadFinish() {
      this.dialogUploadImage = false
      this.dialogUploadAttach = false
    },
    onOpenViewFile(title, url) {
      // window.open(url, '_blank')
      this.maximizedView = false
      this.viewItem = { title: title, url: url }
      this.dialogView = true
    },
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.tags = this.tags.join(',')
          if (this.type && this.type.value) this.form.app_key = this.type.value
          if (this.category && this.category.value) this.form.group_id = this.category.value
          if (this.item) {
            this.loadingAdd = true
            api.update(this.form).then((x) => {
              if (x.ok) {
                const index = this.items.indexOf(this.item)
                if (index > -1) this.items.splice(index, 1, this.form)
              }
            }).finally(() => {
              this.loadingAdd = false
            })
          } else {
            this.form.flag = action
            if (action) this.loadingAdd = true
            else this.loadingDrafts = true
            api.insert(this.form).then((x) => {
              this.items.push(x)
            }).finally(() => {
              this.loadingAdd = false
              this.loadingDrafts = false
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
        this.tags = []
        this.tag = ''
        // this.type = {}
        // this.category = {}
        this.image = []
        this.attach = []
        this.form.image = null
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
