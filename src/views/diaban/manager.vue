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
        <div class="col-sm-12 col-md-4">
          <q-select v-model="kycuoc" :options="kycuocs"
            :dense="$store.state.app.dense.input"
            :options-dense="$store.state.app.dense.input" label="Kỳ cước" />
        </div>
        <q-space />
        <div class="col-sm-12 col-md-5">
          <q-select v-model="donvi" :options="donvis" option-label="ten_dv"
            :dense="$store.state.app.dense.input"
            :options-dense="$store.state.app.dense.input" label="Đơn vị" />
          <!-- <q-btn label="test" @click="testDonVi"></q-btn> -->
        </div>
      </div>
    </q-card-actions>
    <q-list bordered separator :dense="false">
      <q-item>
        <q-item-section avatar>
          <q-btn color="indigo" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.createPNVKC" @click="onCreatePhoNVKC" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Tạo dữ liệu phố nhân viên theo kỳ cước</q-item-label>
          <q-item-label caption class="text-red">
            Lựa chọn kỳ cước trước khi thực hiện
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="deep-purple" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.donvi" @click="onUpdateDonvi" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập nhật đơn vị</q-item-label>
          <q-item-label caption class="text-indigo">
            Cập nhật lại đơn vị của bảng TTKD_.PHO_NV theo trường ghichu trong bảng
            CSS_.QUAN
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="deep-purple" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.donviNV" @click="onUpdateDonviNV" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập nhật đơn vị Nhân viên, Tên nhân viên</q-item-label>
          <q-item-label caption class="text-indigo">
            Cập nhật lại đơn vị nhân viên, tên nhân viên của bảng TTKD_.PHO_NV theo bảng
            ADMIN_.NHANVIEN
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="orange" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.phoCuoc" @click="onUpdatePhoCuoc" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập nhật PHO_ID của TINHCUOC_BKN.DBTB_[Kỳ cước]</q-item-label>
          <q-item-label caption class="text-indigo">
            Cập nhật PHO_ID của TINHCUOC_BKN.DBTB_[Kỳ cước] từ PHO_ID của DB_THUEBAO
          </q-item-label>
          <q-item-label caption class="text-red">
            Lưu ý chọn kỳ cước trước khi thực hiện
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="orange" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.doituongCuoc" @click="onUpdateDoiTuongCuoc" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập nhật DOITUONG_ID của TINHCUOC_BKN.DBTB_[Kỳ cước]
          </q-item-label>
          <q-item-label caption class="text-indigo">
            Cập nhật DOITUONG_ID của TINHCUOC_BKN.DBTB_[Kỳ cước] từ DOITUONG_ID của
            DB_THUEBAO
          </q-item-label>
          <q-item-label caption class="text-red">
            Lưu ý chọn kỳ cước trước khi thực hiện
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-btn color="primary" icon="touch_app" label="Thực hiện" size="sm"
            :loading="loading.phoLike" @click="onUpdateDBPhoLike" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cập PHO_ID Like địa chỉ</q-item-label>
          <q-item-label caption class="text-indigo">
            Cập nhật lại trường PHO_ID của bảng CSS_.DIACHI dựa theo địa chỉ phố like tên
            phố
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
          <q-item-label caption class="text-indigo">
            Cập nhật QUAN_ID dựa vào đơn vị và địa chỉ thuê bao
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
          <q-item-label caption class="text-indigo">
            Cập nhật PHUONG_ID dựa vào TTKD_.DB_DONVI và QUAN_ID của thuê bao
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
          <q-item-label caption class="text-indigo">
            Cập nhật PHO_ID dựa vào TTKD_.DB_DONVI và PHUONG_ID của thuê bao
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
import * as apiBilling from '@/api/billing'
import * as apiDonvi from '@/api/donvi'
import * as api from '@/api/diaban'
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
        pho: false,
        phoCuoc: false,
        doituongCuoc: false
      },
      kycuocs: [],
      kycuoc: null,
      donvis: [],
      donvi: null
    }
  },
  created() {
    this.onSelectKyCuoc()
    this.onSelectDonvi()
  },
  methods: {
    testDonVi() {
      // console.log(this.donvi)
      // console.log(this.donvi && this.donvi.donvi_id ? 'true' : 'false')
    },
    onSelectKyCuoc() {
      apiBilling.getKyCuoc().then(x => {
        this.kycuocs = x
      })
    },
    onSelectDonvi() {
      apiDonvi.getDonviTTKD().then(x => {
        const all = [{ donvi_id: 0, donvi_ql_id: 0, ten_dv: '-- Không chọn --' }]
        this.donvis = [...all, ...x]
        this.donvi = this.donvis[0]
      })
    },
    onCreatePhoNVKC() {
      if (!this.onCheckKyCuoc()) return null
      this.loading.createPNVKC = true
      api.createPhoNVKC({ kycuoc: this.kycuoc.value }).finally(() => {
        setTimeout(() => { this.loading.createPNVKC = false }, 1000)
      })
    },
    onUpdateDonvi() {
      this.loading.donvi = true
      api.updateDonvi().finally(() => {
        this.loading.donvi = false
      })
    },
    onUpdateDonviNV() {
      this.loading.donviNV = true
      api.updateDonviNV().finally(() => {
        this.loading.donviNV = false
      })
    },
    onUpdateDBPhoLike() {
      this.loading.phoLike = true
      api.updateDBPhoLike().finally(() => {
        this.loading.phoLike = false
      })
    },
    onUpdateDBQuan() {
      this.loading.quan = true
      api.updateDBQuan().finally(() => {
        this.loading.quan = false
      })
    },
    onUpdateDBPhuong() {
      this.loading.phuong = true
      api.updateDBPhuong().finally(() => {
        this.loading.phuong = false
      })
    },
    onUpdateDBPho() {
      this.loading.pho = true
      api.updateDBPho().finally(() => {
        this.loading.pho = false
      })
    },
    onUpdatePhoCuoc() {
      if (!this.onCheckKyCuoc()) return null
      this.loading.phoCuoc = true
      api.updatePhoCuoc({
        kycuoc: this.kycuoc.value,
        donvi_id: this.donvi && this.donvi.donvi_id ? [this.donvi.donvi_id, this.donvi.donvi_ql_id] : []
      }).finally(() => {
        this.loading.phoCuoc = false
      })
    },
    onUpdateDoiTuongCuoc() {
      if (!this.onCheckKyCuoc()) return null
      this.loading.doituongCuoc = true
      api.updateDoiTuongCuoc({
        kycuoc: this.kycuoc.value,
        donvi_id: this.donvi && this.donvi.donvi_id ? [this.donvi.donvi_id, this.donvi.donvi_ql_id] : []
      }).finally(() => {
        this.loading.doituongCuoc = false
      })
    },
    // Kiểm tra kỳ cước
    onCheckKyCuoc() {
      if (!this.kycuoc || !this.kycuoc.value) {
        this.$q.notify({
          color: 'warning',
          timeout: 3000,
          message: 'Vui lòng chọn kỳ cước trước khi thực hiện!'
        })
        return false
      }
      return true
    }
  }
}
</script>

<style>
</style>
