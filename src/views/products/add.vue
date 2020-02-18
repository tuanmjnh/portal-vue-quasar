<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t('route.product')}}</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup
        :disable="loading_add||loading_drafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="denseButton" color="amber" icon="offline_pin"
          :label="$t('global.update')" :loading="loading_add" @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" color="blue" icon="check_circle"
          :label="$t('global.add')" :loading="loading_add" :disable="loading_drafts"
          @click.prevent="onSubmit(1)">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" color="amber" icon="receipt"
          :label="$t('global.drafts')" :loading="loading_drafts" :disable="loading_add"
          @click.prevent="onSubmit(0)">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="denseForm" class="text-deep-purple"
        align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="sub" :label="$t('tabs.sub')" />
        <q-tab name="images" :label="$t('global.images')" />
        <q-tab name="plus" :label="$t('tabs.plus')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12">
              <!-- {{$t('category.title_product')}}: <q-badge color="blue" class="cursor-pointer relative-position">
                {{form.categories?form.categories:$t('category.select')}}
                <div v-if="!form.categories" class="q-field__bottom row items-start q-field__bottom--animated">
                  <div class="q-field__messages col">
                    <div>{{$t('error.required')}}</div>
                  </div>
                </div>
              </q-badge> -->
              <q-input v-model.trim="categoriesSelected" v-uppercaseFirst
                :dense="denseInput" :readonly="true" :label="$t('category.title_product')"
                :rules="[v=>v&&v.length>0||$t('error.required')]">
                <template v-slot:after>
                  <q-btn round dense flat icon="pageview"
                    @click="dialog_categories=!dialog_categories">
                    <q-tooltip>{{$t('category.select')}}</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.title" v-uppercaseFirst :dense="denseInput"
                :label="$t('product.name')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.code" v-uppercase debounce="500"
                :dense="denseInput" :label="$t('product.code')"
                :rules="[v=>v&&v.length>0||$t('error.required'),v=>!existCode||$t('error.exist')]"
                :hint="$t('category.hit_code')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-4">
              <q-input v-model.trim="form.price" type="number" :dense="denseInput"
                :label="$t('global.price')" />
            </div>
            <q-space />
            <div class="col-4">
              <q-input v-model="form.price_sale" type="number" :dense="denseInput"
                :label="$t('global.price_sale')" />
            </div>
            <q-space />
            <div class="col-2">
              <q-select v-model="price_unit" :dense="denseInput"
                :options="unitsPriceLocal" use-input hide-selected fill-input
                input-debounce="200" @filter="onFilterUnitPrice" option-value="_id"
                option-label="name" :hint="$t('global.price_unit')"
                :rules="[v=>v||$t('error.required')]">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name" />
                      <q-item-label v-if="scope.opt.desc" caption>{{`${scope.opt.desc}`}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">{{$t('table.no_data')}}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <!-- <q-input v-model="form.price_unit" type="number" :dense="denseInput" :label="$t('global.price_unit')" /> -->
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-3">
              <q-input v-model="form.quantity" type="number" :dense="denseInput"
                :label="$t('global.quantity')" />
            </div>
            <div class="col-2">
              <q-select v-model="unit" use-input hide-selected fill-input
                input-debounce="200" :dense="denseInput" :options="unitsLocal"
                :hint="$t('global.unit')" @filter="onFilterUnit" option-value="_id"
                option-label="name" :rules="[v=>v||$t('error.required')]">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name" />
                      <q-item-label v-if="scope.opt.desc" caption>{{`${scope.opt.desc}`}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">{{$t('table.no_data')}}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <q-space />
            <div class="col-6">
              <q-input v-model="form.orders" type="number" :dense="denseInput"
                :label="$t('global.order')"
                :rules="[v=>v!==null&&v!==''||$t('error.required')]" class="col-md-4" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="sub">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.author" :dense="denseInput"
                :label="$t('product.origin')" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.date" :dense="denseInput"
                :label="$t('product.date')" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.start_at" :dense="denseInput" readonly
                :label="$t('global.start_date')">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="startAt" transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="form.start_at" today-btn
                        @input="()=>$refs.startAt.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col col-md-6">
              <q-input v-model.trim="form.end_at" :dense="denseInput" readonly
                :label="$t('global.end_date')">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="endAt" transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="form.end_at" today-btn
                        @input="()=>$refs.endAt.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-sm q-mb-lg">
            <div class="col-12">
              <q-input v-model.trim="form.desc" autogrow :dense="denseInput"
                :label="$t('global.desc')" />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-12">{{$t('global.content')}}</div>
            <div class="col-12">
              <q-editor v-model="form.content" min-height="5rem" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="images">
          <div class="row">
            <div class="col text-right">
              <q-btn round dense flat icon="cloud_upload" color="primary"
                @click="dialog_upload=!dialog_upload">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('files.upload')}}
                </q-tooltip>
              </q-btn>
              <q-btn round dense flat icon="pageview" color="secondary"
                @click="dialog_files=!dialog_files">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('files.open_file')}}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="row">
            <div class="col-12 q-gutter-sm images">
              <q-img v-for="(e,i) in form.images" :src="e" :key="i"
                spinner-color="primary">
                <!-- <div class="absolute-top text-subtitle1 text-center">
              Caption
            </div> -->
                <i class="material-icons img-delete" @click="onDeleteImage(e)">clear</i>
              </q-img>
            </div>
          </div>
          <!-- <q-input v-model="form.avatar" :label="$t('users.avatar')" /> -->
        </q-tab-panel>
        <q-tab-panel name="plus">
          <!-- <div class="q-pt-md q-pb-md">
            <span>{{$t('global.position')}}</span>
            <q-option-group v-model="form.unit" :options="units" color="green" inline />
          </div>
          <q-separator /> -->
          <div class="q-pt-md q-pb-md">
            <div class="col-12">{{$t('global.pin')}}:</div>
            <div class="col-12">
              <!-- <q-checkbox v-model="pins" v-for="(e,i) in pin" :label="e.name" :key="i" /> -->
              <q-option-group v-model="form.pin" :options="pin" type="checkbox" inline />
            </div>
          </div>
          <q-separator class="q-mb-md q-mt-md" />
          <div class="row q-gutter-md">
            <div class="col-12">{{$t('global.tags')}}:</div>
            <!-- <span class="col-12 col-md-2">Tags</span> -->
            <!-- <q-space /> -->
            <div class="col-9 col-md-6">
              <q-input v-model.trim="tag" :dense="denseInput" label="Tags" />
            </div>
            <q-space />
            <div class="col">
              <q-btn flat round color="blue" icon="add" size="sm"
                @click.prevent="onAddTag" />
            </div>
          </div>
          <div class="col-12">
            <q-chip v-for="(e,i) in form.tags" :key="i" removable clickable
              @click="onEditTag(e)" @remove="onRemoveTag(e)" color="primary"
              text-color="white">{{e}}</q-chip>
          </div>
          <q-separator class="q-mb-md q-mt-md" />
          <div class="row q-gutter-md">
            <div class="col-12">{{$t('global.attributes')}}:</div>
            <div class="col-6 col-md-5">
              <auto-complete :value.sync="attr.key" :items.sync="meta.keys"
                :label="$t('global.key')" :no-data="$t('table.no_data')"
                @input="onFilterMetaKey" />
            </div>
            <q-space />
            <div class="col-6 col-md-5">
              <auto-complete :value.sync="attr.value" :items.sync="meta.values"
                :label="$t('global.value')" :no-data="$t('table.no_data')"
                @input="onFilterMetaValue" />
            </div>
            <q-space />
            <div class="col">
              <q-btn flat round color="blue" icon="add" size="sm"
                @click.prevent="onAddMeta" />
            </div>
          </div>
          <br />
          <q-list v-if="form.meta" dense bordered separator padding
            class="rounded-borders">
            <q-item v-for="(v,k,i) in form.meta" :key="i">
              <q-item-section>{{k}}</q-item-section>
              <q-item-section>{{v}}</q-item-section>
              <q-item-section side>
                <q-btn flat round color="light-green" icon="edit" size="sm"
                  @click.prevent="onEditMeta(k,v)" />
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="red" icon="cancel" size="sm"
                  @click.prevent="onRemoveMeta(k)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
    <!-- Dialog categories -->
    <q-dialog v-model="dialog_categories">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>{{$t('category.title_product')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-card-section>
          <tm-tree :nodes="categories" node-key="_id" label="label"
            :no-nodes-label="$t('table.no_data')" :selected.sync="categoriesSelected"
            :expanded-all="true" @on-selected="onSelectCategory">
            <template v-slot:content-after="prop">
              <div class="row items-center">
                <q-icon :name="prop.node.icon" color="blue-grey" size="20px"
                  class="q-mr-sm" />
                <div
                  :class="['node-label q-pr-md',prop.node.flag===1?'':'text-blue-grey-4']"
                  :style="{color:prop.node.color?prop.node.color:'#009688'}">
                  {{ prop.node.label }}
                </div>
              </div>
            </template>
          </tm-tree>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Dialog Files -->
    <q-dialog v-model="dialog_files">
      <q-card style="width:672px;max-width:80vw;">
        <q-toolbar>
          <q-toolbar-title>{{$t('files.title')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <tm-files url="http://localhost:8001/api/file-manager" :selected.sync="files"
            :accept="['image/*']" multiple
            :headers="{'x-access-token': `Bearer ${$store.state.auth.token}`}"
            @on-finish="onFilesAccept">
          </tm-files>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Dialog Upload -->
    <q-dialog v-model="dialog_upload">
      <q-card style="width:500px;max-width:80vw;">
        <q-toolbar>
          <q-toolbar-title>{{$t('files.upload')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-uploader ref="upload" square flat multiple :max-file-size="1024*1024*2"
            accept=".jpg,.jpeg,.png,.gif" style="width:100%" @uploaded="onUploaded"
            @finish="onUploadFinish" url="http://localhost:8001/api/file-manager" :headers="[
          { name: 'Upload-Path', value: 'products' },
          { name: 'Upload-Rename', value: true },
          {'x-access-token': `Bearer ${$store.state.auth.token}`}]">
            <template v-slot:list="scope">
              <div class="q-gutter-xs">
                <q-img v-for="file in scope.files" :key="file.name" :src="file.__img.src"
                  spinner-color="white" class="vertical-middle" />
              </div>
            </template>
          </q-uploader>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import * as api from '@/api/products'
import normalize from '@/utils/search'
import tmTree from '@/components/tm-tree'
import tmFiles from '@/components/tm-files'
import autoComplete from '@/components/auto-complete'
export default {
  components: { tmTree, tmFiles, autoComplete },
  props: {
    dialog: { type: Boolean, default: true },
    items: { type: Array, default: () => [] },
    item: { type: Object, default: () => { } },
    categories: { type: Array, default: () => [] },
    category: { type: Array, default: () => [] },
    units: { type: Array, default: () => [] },
    unitsPrice: { type: Array, default: () => [] },
    pin: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loading_add: false,
      loading_drafts: false,
      dialog_categories: false,
      dialog_files: false,
      dialog_upload: false,
      tabs: 'main',
      form: {},
      // categories: [],
      categoriesSelected: '',
      attr: {},
      meta: { keys: [], values: [] },
      tag: '',
      unit: null,
      price_unit: null,
      existCode: false,
      unitsLocal: [],
      unitsPriceLocal: [],
      files: [],
      default: {
        categories: null,
        title: null,
        code: null,
        desc: null,
        content: '',
        url: null,
        images: [],
        quantity: 0,
        price: 0,
        price_sale: 0,
        price_unit: '',
        unit: '',
        tags: null,
        attribute: null,
        author: null,
        date: null,
        pin: [],
        meta: null,
        start_at: null,
        end_at: null,
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
        if (this.item) {
          this.form = { ...this.item }
          this.form.unit = this.units.find(x => x._id === this.form.unit)
          this.form.price_unit = this.unitsPrice.find(x => x._id === this.form.price_unit)
          if (this.category.length) this.categoriesSelected = this.category[0].title
        }
      },
      deep: true,
      immediate: true
    },
    'form.code'(val) {
      if (val) {
        api.exist({ code: val.toUpperCase() }).then((x) => {
          if (x) this.existCode = true
        })
      }
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
    onFilesAccept(selected) {
      this.dialog_files = false
      if (selected.length) this.form.images = [...this.form.images, ...selected.map(x => x.fullName)]
    },
    onUploadFinish() {
      this.dialog_upload = false
    },
    onUploaded(info) {
      var res = JSON.parse(info.xhr.response)
      if (res.length > 0) this.form.images.push(res[0].fullName)
    },
    onDeleteImage(img) {
      const index = this.form.images.indexOf(img)
      if (index > -1) this.form.images.splice(index, 1)
    },
    onFilterUnit(val, update, abort) {
      update(() => {
        if (val === '') {
          this.unitsLocal = this.units
        } else {
          const needle = normalize(val.toLowerCase())
          // this.form.region = this.regions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          this.unitsLocal = this.units.filter(v => normalize(v.name.toLowerCase()).indexOf(needle) > -1)
        }
      })
    },
    onFilterUnitPrice(val, update, abort) {
      update(() => {
        if (val === '') {
          this.unitsPriceLocal = this.unitsPrice
        } else {
          const needle = normalize(val.toLowerCase())
          // this.form.region = this.regions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          this.unitsPriceLocal = this.unitsPrice.filter(v => normalize(v.name.toLowerCase()).indexOf(needle) > -1)
        }
      })
    },
    onSelectCategory(item) {
      if (!item.children || !item.children.length) {
        this.form.categories = [item._id]
        this.dialog_categories = false
      } else {
        this.categoriesSelected = ''
      }
    },
    onSubmit(action) {
      if (this.unit) this.form.unit = this.unit.name
      if (this.price_unit) this.form.price_unit = this.price_unit.name
      // this.form.images = this.images.map(x => x.fullName)
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
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        this.form.images = []
        this.attr = {}
        this.tag = ''
        this.categoriesSelected = ''
        this.unit = this.units[0]
        this.price_unit = this.unitsPrice[0]
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style scoped>
.images {
  min-height: 100px;
}
.images .q-img {
  height: 100px;
  max-width: 100px;
}
.img-delete {
  color: #fff;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #b71c1c;
  display: none;
}
.images .q-img:hover .img-delete {
  display: initial;
}
</style>
