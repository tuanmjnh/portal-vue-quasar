<template>
  <q-card>
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        Lấy mật khẩu
      </q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions>
        <!-- <div class="row q-gutter-xs"> -->
        <div class="col-12 col-md-5">
          <q-select v-model="donvi" :options="donvis" label="Đơn vị"
            :dense="denseInput" input-debounce="300" @input="onGetUsers" />
        </div>
        <q-space />
        <div class="col-12 col-md-5">
          <q-select v-model="user" :options="users" label="Người dùng"
            :dense="denseInput" @input="onGetMaND" />
        </div>
        <div class="col-12">
          <p />
        </div>
        <div class="col-12 col-md-5">
          <q-input v-model="ma_nd" label="Mã người dùng" :dense="denseInput"
            :rules="[v=>v&&v.length>0||$t('error.required')]">
            <template v-slot:prepend>
              <q-icon name="account_circle" />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="col-12 col-md-5">
          <q-input v-model="password" label="Mật khẩu" :dense="denseInput" readonly>
            <template v-slot:prepend>
              <q-icon :name="$route.meta.icon" /></template>
          </q-input>
        </div>
        <!-- </div> -->
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn type="submit" :dense="denseButton" color="amber" icon="offline_pin"
          label="Thực hiện" :loading="loading" @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import * as api from '@/api/users'
import * as apiDonvi from '@/api/donvi'
export default {
  data() {
    return {
      loading: false,
      donvis: [],
      donvi: null,
      users: [],
      user: null,
      ma_nd: '',
      password: ''
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
    this.onGetDonvi()
    // this.getUsers(this.form)
  },
  methods: {
    onGetDonvi(params) {
      apiDonvi.select(params).then(x => {
        this.donvis = x.map(x => ({ label: x.ten_dv, value: x.donvi_id }))
        if (this.donvis.length) {
          this.donvi = this.donvis[0]
          this.onGetUsers()
        }
      })
    },
    onGetUsers() {
      api.find({ donvi_id: this.donvi.value }).then(x => {
        this.users = x.map(x => ({ label: x.ten_nd, value: x.ma_nd }))
        if (this.users.length) {
          this.user = this.users[0]
          this.ma_nd = this.user.value
        }
      })
    },
    onGetMaND() {
      this.ma_nd = this.user.value
    },
    onSubmit() {
      this.loadingAdd = true
      this.$refs.form.validate().then(valid => {
        if (valid) {
          api.getPasword({ ma_nd: this.ma_nd }).then((x) => {
            if (x) {
              this.password = x.matkhau
            }
          }).finally(() => {
            this.loadingAdd = false
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
