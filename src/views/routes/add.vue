<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">routes</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup :disable="loading">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="denseButton" color="amber" icon="offline_pin"
          :label="$t('global.update')" :loading="loading" @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" color="blue" icon="check_circle" :label="$t('global.add')"
          :loading="loading" @click.prevent="onSubmit()">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="denseForm" class="text-deep-purple"
        align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              Dependent: <q-badge color="blue">{{dependent?dependent.label:'Root'}}
              </q-badge>
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              Level: <q-badge color="blue">{{form.level}}</q-badge>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.path" :dense="denseInput" v-lowercase label="Path"
                :rules="[!!v||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.name" :dense="denseInput" label="Name"
                :rules="[!!v||$t('error.required')]"
                :prefix="!item&&dependent?`${dependent.name}-`:''" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.component" :dense="denseInput" v-lowercase
                label="Component" :rules="[!!v||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.redirect" :dense="denseInput" label="Redirect" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.label" :dense="denseInput" v-lowercase label="Label"
                :rules="[!!v||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.icon" :dense="denseInput" label="Icon">
                <template v-slot:append>
                  <q-icon :name="form.icon" /></template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-8 col-md-3">
              <q-input v-model="form.orders" type="number" :dense="denseInput"
                :label="$t('global.order')" :rules="[!!v||$t('error.required')]" class="col-md-4" />
            </div>
            <q-space />
            <div class="col-5 col-md-3 self-center">
              <q-toggle v-model="form.hidden" :dense="denseInput" :true-value="true"
                label="Hidden" />
            </div>
            <div class="col-5 col-md-3 self-center">
              <q-toggle v-model="form.flag" :dense="denseInput" :true-value="1" label="Flag" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="attributes">
          <div class="q-pt-md q-pb-md">
            Attributes:
          </div>
          <div class="row q-gutter-md">
            <div class="col-6 col-md-5">
              <!-- <q-input v-model.trim="attr.key" :dense="denseInput" v-lowercase label="Key" /> -->
              <!-- <q-select v-model="attr.key" hide-selected fill-input use-input input-debounce="0" :dense="denseInput"
                :options-dense="denseInput" @new-value="onAddKey" :options="meta.keys" @filter="onFilterKey"
                :hint="$t('types.hit_key')" :label="$t('global.types')" /> -->
              <!-- <q-input v-model.trim="attr.key" :dense="denseInput" placeholder="Key" @focus="onFilterMeta(true)"
                @keyup="onFilterMeta(true)" @blur="onBlur">
              </q-input>
              <q-list v-if="isShowKey" bordered separator dense class="list-complete">
                <q-item clickable v-ripple v-for="(e,i) in meta" :key="i" @click="onSelected(e)">
                  <q-item-section>{{e}}</q-item-section>
                </q-item>
              </q-list> -->
              <auto-complete :value.sync="attr.key" :items.sync="meta.keys"
                :label="$t('global.key')" :no-data="$t('table.no_data')" @input="onFilterMetaKey" />
            </div>
            <q-space />
            <div class="col-6 col-md-5">
              <!-- <q-input v-model.trim="attr.value" :dense="denseInput" label="Value" /> -->
              <auto-complete :value.sync="attr.value" :items.sync="meta.values"
                :label="$t('global.value')" :no-data="$t('table.no_data')"
                @input="onFilterMetaValue" />
            </div>
            <q-space />
            <div>
              <q-btn flat round color="blue" icon="add" size="sm" @click.prevent="onAddMeta" />
            </div>
          </div>
          <br />
          <q-list v-if="form.meta&&form.meta.length>0" dense bordered separator padding
            class="rounded-borders">
            <q-item v-for="(e,i) in form.meta" :key="i">
              <q-item-section>{{e.key}}</q-item-section>
              <q-item-section>{{e.value}}</q-item-section>
              <q-item-section side>
                <q-btn flat round color="light-green" icon="edit" size="sm"
                  @click.prevent="onEditMeta(e)" />
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="red" icon="cancel" size="sm"
                  @click.prevent="onRemoveMeta(e.key)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
  </q-card>
</template>

<script>
import autoComplete from '@/components/auto-complete'
import * as api from '@/api/routes'
export default {
  components: { autoComplete },
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    dependent: { type: Object, default: () => null },
    expanded: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      tabs: 'main',
      form: {},
      attr: {},
      meta: { keys: [], values: [] },
      default: {
        path: '',
        name: '',
        component: 'layout',
        dependent: null,
        level: 1,
        redirect: '',
        label: '',
        icon: '',
        orders: 1,
        hidden: false,
        meta: null,
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
  created() {
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
    onAddMeta() {
      if (!this.attr.key || !this.attr.value) {
        this.$q.notify({
          color: 'warning',
          timeout: 3000,
          message: 'The attributes is required Key and Value!'
        })
        return
      }
      if (!this.form.meta) this.form.meta = []
      this.form.meta.push(this.attr)
      this.attr = {}
      // this.meta.keys.push(this.attr.key)
      // this.meta.values.push(this.attr.value)
    },
    onEditMeta({ key, value }) {
      this.onRemoveMeta(key)
      this.attr = { key: key, value: value }
    },
    onRemoveMeta(key) {
      // delete this.form.meta[key]
      // if (Object.keys(this.form.meta).length < 1) this.form.meta = null
      const i = this.form.meta.findIndex(x => x.key === key)
      if (i > -1) this.form.meta.splice(i, 1)
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
    onSubmit() {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (!this.form.component) this.form.component = 'layout'
          if (this.item) {
            this.loading = true
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
              this.loading = false
            })
          } else {
            this.loading = true
            if (this.dependent) this.form.name = `${this.dependent.name}-${this.form.name}`
            api.insert(this.form).then((x) => {
              if (this.dependent) {
                this.expanded.push(x._id)
                if (!this.dependent.children) this.dependent.children = []
                this.dependent.children.push(x)
              } else this.items.push(x)
            }).finally(() => {
              this.loading = false
              this.reset()
            })
          }
        }
      })
    },
    getDependent() {
      if (this.dependent) return this.$t(`route.${this.dependent.label}`)
      else return 'Root'
    },
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        if (this.dependent) {
          this.form.dependent = this.dependent._id
          this.form.level = this.dependent.level + 1
        }
        this.attributes = {}
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
