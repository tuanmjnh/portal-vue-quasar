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
      <q-card-section>
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-5">
          </div>
          <q-space />
          <div class="col-12 col-md-6">
            <q-input v-model.trim="form.code" v-lowercase :dense="denseInput"
              :label="$t('global.code')" :rules="[v=>v&&v.length>0||$t('error.required')]"
              :readonly="item?true:false" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-12">
            <q-input v-model.trim="form.title" :dense="denseInput"
              :label="$t('global.name')"
              :rules="[v=>v&&v.length>0||$t('error.required')]" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col-3">
            <q-input v-model="form.orders" type="number" :dense="denseInput"
              :label="$t('global.order')"
              :rules="[v=>v!==null&&v!==''||$t('error.required')]" />
          </div>
          <q-space v-if="item" />
          <div class="col-5 self-center" v-if="item">
            <q-toggle v-model="form.flag" :true-value="1" :dense="denseInput"
              :label="form.flag?$t('global.publish'):$t('global.drafts')" />
          </div>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
// import autoComplete from '@/components/auto-complete'
import * as api from '@/api/command'
export default {
  components: { },
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loading_add: false,
      loading_drafts: false,
      tabs: 'main',
      form: {},
      default: {
        key: '',
        code: '',
        title: '',
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
        }
      },
      deep: true,
      immediate: true
    }
  },
  // mounted() {
  //   this.onGetKey()
  // },
  methods: {
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (this.item) {
            this.loading_add = true
            api.update(this.form).then((x) => {
              if (x.ok) {
                const index = this.items.indexOf(this.item)
                if (index > -1) this.items.splice(index, 1, this.form)
              }
            }).finally(() => {
              this.loading_add = false
            })
          } else {
            this.form.flag = action
            if (action) this.loading_add = true
            else this.loading_drafts = true
            api.insert(this.form).then((x) => {
              this.items.push(x)
              this.reset()
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
