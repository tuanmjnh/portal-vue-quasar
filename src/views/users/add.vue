<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t('roles.title')}}</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup
        :disable="loading_add||loading_drafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
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
          @click.prevent="onSubmit(true)">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" color="amber" icon="receipt"
          :label="$t('global.drafts')" :loading="loading_drafts" :disable="loading_add"
          @click.prevent="onSubmit(false)">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="denseForm" class="text-deep-purple"
        align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="roles" :label="$t('roles.title')" />
        <q-tab name="avatar" :label="$t('users.avatar')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.email" :dense="denseInput" v-lowercase
                :label="$t('users.email')"
                :rules="[v=>v&&v.length>0||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.full_name" :dense="denseInput"
                :label="$t('users.full_name')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.date_birth" :dense="denseInput" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="form.date_birth" today-btn
                        @input="()=>$refs.qDateProxy.hide()" />
                      <!-- @input="() => $refs.qDateProxy.hide()" -->
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <!-- <q-input v-model="form.date_birth" :label="$t('users.date_birth')" placeholder="DD/MM/YYYY" /> -->
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.person_number" type="number" :dense="denseInput"
                :label="$t('users.person_number')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-3">
              <q-select v-model="selected_region" use-input hide-selected fill-input
                input-debounce="0" :dense="denseInput" :options="regions"
                @filter="onFilterRegion" :hint="$t('users.select_region')"
                :option-value="opt=>opt===null?null:opt.id"
                :option-label="opt=>opt===null?$t('table.no_data'):opt.name_l"
                :rules="[v=>v||$t('error.required')]">
                <!-- <template v-slot:selected-item="scope">
                  <q-item-label v-html="scope.opt.name_l" />
                  <q-item-label caption>{{`+${scope.opt.pc}`}}</q-item-label>
                </template> -->
                <!-- <template v-slot:selected>
                  <q-chip v-if="form.region" dense square color="white" text-color="primary"
                    class="q-my-none q-ml-xs q-mr-none">
                    <q-avatar color="primary" text-color="white" />
                    {{ form.region.name_l }}
                  </q-chip>
                  <q-badge v-else>*none*</q-badge>
                </template> -->
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name_l" />
                      <q-item-label caption>{{`+${scope.opt.pc}`}}</q-item-label>
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
            <div class="col-6 col-md-5">
              <q-input v-model.trim="form.phone" outlined :hint="$t('users.phone')"
                :placeholder="$t('users.phone')" :dense="denseInput"
                :rules="[v=>v&&v.length>0||$t('error.required')]">
                <template v-if="selected_region" v-slot:prepend>
                  <span
                    style="font-size:14px;line-height:0">+{{selected_region.pc}}</span>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5 self-center">
              <q-toggle v-model="form.verified" :true-value="true" :dense="denseInput"
                :label="$t('users.verified')"
                :text-color="form.verified?'green':'blue-grey-10'" />
            </div>
            <q-space />
            <div class="col-12 col-md-6 self-center" v-if="item">
              <q-toggle v-model="form.enable" :true-value="true" :dense="denseInput"
                :label="form.enable?$t('global.working'):$t('global.lock')" />
            </div>
          </div>
          <q-input v-model.trim="form.note" autogrow :label="$t('global.desc')"
            :dense="denseInput" />
        </q-tab-panel>
        <q-tab-panel name="roles">
          <q-tree ref="menu" class="col-12 col-sm-6" :nodes="roles" :dense="denseInput"
            :ticked.sync="form.roles" node-key="id" tick-strategy="leaf"
            :no-nodes-label="$t('table.no_data')" />
          <!-- <q-btn flat color="positive" icon="check_circle" :label="$t('global.add')" @click="onTicked">
          </q-btn> -->
        </q-tab-panel>
        <q-tab-panel name="avatar" class="row">
          <q-uploader ref="upload" square flat :url="upload_url" :headers="upload_headers"
            @added="onUploadAdded" @uploaded="onUploaded" @finish="onUploadFinish"
            :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif"
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
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
  </q-card>
</template>

<script>
import * as api from '@/api/users'
import regionData from '@/i18n/region'
export default {
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    roles: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loading_add: false,
      loading_drafts: false,
      tabs: 'main',
      upload_url: process.env.API_FILE_UPLOAD,
      upload_headers: [{ name: 'Upload-Path', value: 'users' }, { name: 'Upload-Rename', value: true }],
      regions: regionData,
      selected_region: null,
      form: {},
      default: {
        email: null,
        password: null,
        full_name: null,
        phone: null,
        person_number: null,
        region: null,
        avatar: null,
        note: null,
        date_birth: this.$moment().format('YYYY/MM/DD'),
        roles: [],
        verified: false,
        enable: true
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
          this.form.date_birth = this.$moment(this.form.date_birth, 'YYYY/MM/DD').format('YYYY/MM/DD')
          const userRegion = this.regions.find(x => x.id === parseInt(this.form.region))
          if (userRegion) this.selected_region = userRegion
          // this.$refs.upload.removeUploadedFiles()
          // console.log(this.$refs.upload)
        }
      },
      deep: true,
      immediate: true
    }
    // form: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
  },
  methods: {
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.region = this.selected_region.id
          if (this.item) {
            this.loading_add = true
            api.update(this.form).then((x) => {
              if (x) {
                const index = this.items.indexOf(this.item)
                if (index > -1) this.items.splice(index, 1, this.form)
              }
            }).finally(() => {
              this.loading_add = false
            })
          } else {
            this.form.enable = action
            if (action) this.loading_add = true
            else this.loading_drafts = true
            api.insert(this.form).then((x) => {
              this.items.push(x)
              this.$q.notify({
                color: 'teal',
                message: `Username: ${x.email} - Password: ${x.password}`
              })
            }).finally(() => {
              this.loading_add = false
              this.loading_drafts = false
              this.reset()
            })
          }
        }
      })
    },
    onFilterRegion(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        // this.form.region = this.regions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        this.regions = regionData.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
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
        this.form.avatar = `${process.env.API_UPLOAD}/${res[0].filename}`
      }
    },
    onTicked() {
      console.log(this.$refs.menu.getTickedNodes())
      console.log(this.$refs.menu.getExpandedNodes())
    },
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        this.selected_region = this.regions[202]
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
