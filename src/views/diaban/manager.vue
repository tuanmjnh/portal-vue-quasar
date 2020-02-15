<template>
  <q-card>
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        Quản trị - Cập nhật dữ liệu địa bàn
      </q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-card-actions>
      <div class="col-12 row">
        <div class="col-xs-12 col-sm-5 col-md-4">
          <q-select v-model="kycuoc" :options="kycuocs"
            :dense="$store.state.app.dense.input"
            :options-dense="$store.state.app.dense.input" label="Kỳ cước" />
        </div>
      </div>
    </q-card-actions>
    <q-list bordered separator :dense="false">
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.createPNVKC" @click="onCreatePhoNVKC" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Tạo dữ liệu phố nhân viên theo kỳ cước</q-item-label>
          <q-item-label caption class="text-indigo">Lựa chọn kỳ cước trước khi thực hiện
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.donvi" @click="onUpdateDonvi" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập nhật đơn vị</q-item-label>
          <q-item-label caption class="text-indigo">Cập nhật lại đơn vị của bảng
            TTKD_.PHO_NV theo trường ghichu trong bảng CSS_.QUAN
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.donviNV" @click="onUpdateDonviNV" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập nhật đơn vị Nhân viên, Tên nhân viên</q-item-label>
          <q-item-label caption class="text-indigo">Cập nhật lại đơn vị nhân viên, tên
            nhân viên của bảng TTKD_.PHO_NV theo bảng ADMIN_.NHANVIEN
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.phoLike" @click="onUpdateDBPhoLike" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập PHO_ID Like địa</q-item-label>
          <q-item-label caption class="text-indigo">Cập nhật lại trường PHO_ID của bảng
            CSS_.DIACHI dựa theo địa chỉ phố like tên phố
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.quan" @click="onUpdateDBQuan" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập QUAN_ID</q-item-label>
          <q-item-label caption class="text-indigo">Cập nhật QUAN_ID dựa vào đơn vị và
            địa chỉ thuê bao
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.phuong" @click="onUpdateDBPhuong" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập PHUONG_ID</q-item-label>
          <q-item-label caption class="text-indigo">Cập nhật PHUONG_ID dựa vào
            TTKD_.DB_DONVI và QUAN_ID của thuê bao
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.pho" @click="onUpdateDBPho" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập PHO_ID</q-item-label>
          <q-item-label caption class="text-indigo">Cập nhật PHO_ID dựa vào
            TTKD_.DB_DONVI và PHUONG_ID của thuê bao
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
import * as api from '@/api/diaban'
import * as apiBilling from '@/api/billing'
export default {
  name: 'diaban-manager',
  data() {
    return {
      loading: {
        createPNVKC: false,
        donvi: false,
        donviNV: false,
        phoLike: false,
        quan: false,
        phuong: false,
        pho: false
      },
      kycuocs: [],
      kycuoc: {}
    }
  },
  created() {
    this.onSelectKyCuoc()
  },
  methods: {
    onSelectKyCuoc() {
      apiBilling.getKyCuoc().then(x => {
        this.kycuocs = x
      })
    },
    onCreatePhoNVKC() {
      if (!this.kycuoc || !this.kycuoc.value) {
        this.$q.notify({
          color: 'warning',
          timeout: 3000,
          message: 'Vui lòng chọn kỳ cước trước khi thực hiện!'
        })
        return null
      }
      this.loading.createPNVKC = true
      api.createPhoNVKC({ kycuoc: this.kycuoc.value }).then(x => {
        setTimeout(() => { this.loading.createPNVKC = false }, 1000)
      })
    },
    onUpdateDonvi() {
      this.loading.donvi = true
      api.updateDonvi().then(x => {
        this.loading.donvi = false
      })
    },
    onUpdateDonviNV() {
      this.loading.donviNV = true
      api.updateDonviNV().then(x => {
        this.loading.donviNV = false
      })
    },
    onUpdateDBPhoLike() {
      this.loading.phoLike = true
      api.updateDBPhoLike().then(x => {
        this.loading.phoLike = false
      })
    },
    onUpdateDBQuan() {
      this.loading.quan = true
      api.updateDBQuan().then(x => {
        this.loading.quan = false
      })
    },
    onUpdateDBPhuong() {
      this.loading.phuong = true
      api.updateDBPhuong().then(x => {
        this.loading.phuong = false
      })
    },
    onUpdateDBPho() {
      this.loading.pho = true
      api.updateDBPho().then(x => {
        this.loading.pho = false
      })
    }
  }
}
</script>

<style>
</style>
