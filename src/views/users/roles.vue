<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar icon="open_in_new" />
      <q-toolbar-title>
        Gán quyền người dùng
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup :disable="loadingAdd?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="denseButton" color="amber" icon="offline_pin"
          :label="$t('global.update')" :loading="loadingAdd" @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions>
        <div class="row q-gutter-xs">
          <q-option-group v-model="rolesId" :options="rolesData" color="primary" inline />
          <q-space />
          <!-- <div class="col-12 col-md-6">
            <q-input v-model.trim="form.full_name" :dense="denseInput"
              :label="$t('users.full_name')"
              :rules="[v=>!!v||$t('error.required')]" />
          </div> -->
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import * as api from '@/api/users'
export default {
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Array, default: () => { } },
    items: { type: Array, default: () => [] },
    roles: { type: Array, default: () => [] }
  },
  data() {
    return {
      loadingAdd: false,
      rolesData: [],
      rolesId: null,
      default: {
        roles_id: '253047ee57894ded98f5d687a61dbdb9'
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
        if (this.item && this.item.length) {
          this.rolesData = this.roles.map(x => ({ label: x.name, value: x.id }))
          if (this.item.length < 2) {
            const findRole = this.rolesData.find(x => x.value === this.item[0].roles_id)
            this.rolesId = findRole ? findRole.value : null
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onSubmit() {
      this.loadingAdd = true
      this.$refs.form.validate().then(valid => {
        if (valid) {
          api.setRoles({ nguoidung_id: this.item.map(x => x.nguoidung_id), roles_id: this.rolesId }).then((x) => {
            if (x) {
              const _roles = this.roles.find(x => x.id === this.rolesId)
              if (_roles) {
                this.item.forEach(e => {
                  e.roles_id = _roles.id
                  e.roles = _roles.name
                  e.roles_color = _roles.color
                })
              }
            }
          }).finally(() => {
            this.loadingAdd = false
          })
        }
      })
    },
    reset() {
      new Promise((resolve, reject) => {
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
