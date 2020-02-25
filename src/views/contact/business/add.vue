<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" />
      <q-toolbar-title>
        {{this.item?'Chi tiết hợp đồng':'Thêm mới hợp đồng'}}
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup
        :disable="loading_add||loading_drafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions v-if="item&&isEdit" align="right">
        <q-btn flat type="submit" :dense="$store.state.app.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="loading_add"
          @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-if="!item&&isAdd" align="right">
        <q-btn flat type="submit" :dense="$store.state.app.dense.button" color="blue"
          icon="check_circle" :label="$t('global.add')" :loading="loading_add"
          :disable="loading_drafts" @click.prevent="onSubmit(1)">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" :dense="$store.state.app.dense.button" color="amber"
          icon="receipt" :label="$t('global.drafts')" :loading="loading_drafts"
          :disable="loading_add" @click.prevent="onSubmit(0)">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.state.app.dense.form"
        class="bg-blue-grey text-white" align="justify">
        <q-tab name="khachHang" label="Khách hàng" />
        <q-tab name="hopdong" label="Hợp đồng" />
        <q-tab name="ghiChu" label="Ghi chú" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="khachHang">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.ten_kh" :dense="$store.state.app.dense.input"
                label="Tên khách hàng/cơ quan"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.nguoi_dd" :dense="$store.state.app.dense.input"
                label="Người đại diện"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col">
              <q-input v-model.trim="form.diachi_kh" :dense="$store.state.app.dense.input"
                label="Địa chỉ khách hàng/cơ quan"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-sm-5 col-md-3">
              <q-input v-model.trim="form.sdt" type="number"
                :dense="$store.state.app.dense.input" label="Số điện thoại"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-sm-5 col-md-3">
              <q-input v-model.trim="form.stk" :dense="$store.state.app.dense.input"
                label="Số tài khoản" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-sm-5 col-md-3">
              <q-input v-model.trim="form.mst" :dense="$store.state.app.dense.input"
                label="Mã số thuế" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-sm-5 col-md-3">
              <q-input v-model.trim="form.sgt" :dense="$store.state.app.dense.input"
                label="Số Giấy tờ" />
            </div>
            <q-space />
            <div class="col-sm-5 col-md-3">
              <q-input v-model.trim="form.ngay_cap" label="Ngày cấp"
                :dense="$store.state.app.dense.input" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="NgayCap" transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="form.ngay_cap" today-btn
                        @input="()=>$refs.NgayCap.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-sm-5 col-md-3">
              <q-input v-model.trim="form.noi_cap" :dense="$store.state.app.dense.input"
                label="Nơi cấp" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="hopdong">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-select v-model="group" :options="groups"
                :dense="$store.state.app.dense.input"
                :options-dense="$store.state.app.dense.input" label="Loại dịch vụ"
                :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.ma_hd" :dense="$store.state.app.dense.input"
                label="Mã hợp đồng" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.ngay_bd" label="Ngày bắt đầu"
                :dense="$store.state.app.dense.input" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="NgayBD" transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="form.ngay_bd" today-btn
                        @input="()=>$refs.NgayBD.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.ngay_kt" label="Ngày kết thúc"
                :dense="$store.state.app.dense.input" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="NgayKT" transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="form.ngay_kt" today-btn
                        @input="()=>$refs.NgayKT.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model="form.so_luong" type="number"
                :dense="$store.state.app.dense.input" label="Số lượng"
                :rules="[v=>v&&v>0||$t('error.required')]" @keyup="onCalPrice" />
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model="form.tien" type="number"
                :dense="$store.state.app.dense.input" label="Đơn giá"
                :rules="[v=>v&&v>0||$t('error.required')]" @keyup="onCalPrice" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-6 col-md-3">
              <q-input v-model="form.tong" type="number" readonly
                :dense="$store.state.app.dense.input" label="Tổng" />
            </div>
            <q-space />
            <div class="col-6 col-md-3">
              <q-input v-model="form.thue" type="number" readonly
                :dense="$store.state.app.dense.input" label="VAT" />
            </div>
            <q-space />
            <div class="col-6 col-md-3">
              <q-input v-model="form.tong_cong" type="number" readonly
                :dense="$store.state.app.dense.input" label="Tổng cộng" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="selectedNV.label" readonly
                :dense="$store.state.app.dense.input" label="Người giới thiệu"
                :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]">
                <template v-slot:append>
                  <q-icon name="pageview" color="primary" class="cursor-pointer"
                    @click="onSelectNguoiGT" />
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-12 col-md-5">
              <q-input v-model.trim="attach.fileName" readonly
                :dense="$store.state.app.dense.input" label="Hợp đồng"
                :rules="[v=>v&&v.length>0||$t('error.required')]">
                <template v-slot:append>
                  <q-icon v-if="attach.fileName&&attach.fullName" name="remove_red_eye"
                    color="primary" class="cursor-pointer"
                    @click="onOpenViewFile(attach.fileName,`${host}/${attach.fullName}`)" />
                  <q-icon v-else name="attach_file" color="primary" class="cursor-pointer"
                    @click="dialogUploadAttach=true" />
                </template>
              </q-input>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="ghiChu">
          <div class="row q-gutter-xs q-mb-md">
            <div class="col-12">
              <q-input v-model.trim="form.ghi_chu" autogrow
                :dense="$store.state.app.dense.input" label="Ghi chú" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12">
              <q-editor v-model="form.noi_dung" min-height="5rem" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
    <!-- Người giới thiệu dialog -->
    <q-dialog v-model="dialogNGT" persistent>
      <q-card style="width:500px">
        <q-toolbar>
          <q-avatar icon="pageview" />
          <q-toolbar-title>Chọn người giới thiệu</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-select v-model="donvi" :options="donvis"
                :dense="$store.state.app.dense.input"
                :options-dense="$store.state.app.dense.input" label="Đơn vị"
                @input="onGetNhanvien" />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-select v-model="nhanvien" :options="nhanviens"
                :dense="$store.state.app.dense.input"
                :options-dense="$store.state.app.dense.input" label="Nhân viên" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="primary" @click="onSubmitNguoiGT">Chấp nhận</q-btn>
          <q-btn flat v-close-popup>Quay lại</q-btn>
        </q-card-actions>
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
          <q-uploader ref="uploadAttach" square flat :url="uploadUrl"
            :headers="uploadHeaders" @uploaded="onUploadedAttach" @finish="onUploadFinish"
            :max-file-size="1024*1024*50" accept=".pdf" style="width:100%">
            <!-- <template v-slot:list="scope"></template> -->
          </q-uploader>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- View file dialog-->
    <q-dialog v-model="dialogView" :maximized="maximizedView" persistent>
      <view-file :dialog.sync="dialogView" :maximized.sync="maximizedView"
        :item="viewItem" />
    </q-dialog>
  </q-card>
</template>

<script>
import viewFile from '@/components/view-file'
import * as api from '@/api/business'
import * as apiDonvi from '@/api/donvi'
import * as apiNV from '@/api/nhanvien'
export default {
  components: { viewFile },
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    groups: { type: Array, default: () => [] },
    isAdd: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      loading_add: false,
      loading_drafts: false,
      dialogNGT: false,
      dialogUploadAttach: false,
      tabs: 'khachHang',
      form: {},
      group: null,
      donvis: [],
      donvi: null,
      nhanviens: [],
      nhanvien: null,
      selectedNV: {},
      dialogView: false,
      maximizedView: false,
      viewItem: {},
      attach: {},
      host: process.env['HOST'],
      uploadUrl: process.env.API_FILE_UPLOAD,
      uploadHeaders: [
        { name: 'Upload-Path', value: 'HopDong' },
        { name: 'Upload-Rename', value: true },
        { name: 'x-access-token', value: `Bearer ${this.$store.state.auth.token}` }
        // { name: 'Content-Type', value: 'multipart/form-data' }
      ],
      default: {
        donvi_id: null,
        group_id: null,
        kieuld_id: 0,
        ma_hd: null,
        ten_kh: null,
        diachi_kh: null,
        ngay_bd: null,
        ngay_kt: null,
        so_luong: 1,
        dinh_kem: null,
        noi_dung: '',
        ghi_chu: null,
        tien: null,
        thue: null,
        mst: null,
        sdt: null,
        stk: null,
        sgt: null,
        nguoi_dd: null,
        ngay_cap: null,
        noi_cap: null,
        nguoi_gt: null,
        trang_thai: 1
      }
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) {
          this.form = { ...this.item }
          if (!this.form.noi_dung) this.form.noi_dung = ''
          if (this.form.ngay_cap) this.form.ngay_cap = this.$moment(this.form.ngay_cap).format('YYYY-MM-DD')
          if (this.form.ngay_bd) this.form.ngay_bd = this.$moment(this.form.ngay_bd).format('YYYY-MM-DD')
          if (this.form.ngay_kt) this.form.ngay_kt = this.$moment(this.form.ngay_kt).format('YYYY-MM-DD')
          if (this.form.group_id) this.group = this.groups.find(x => x.value === this.form.group_id)
          if (this.form.nguoi_gt) this.selectedNV = { label: this.form.ten_nguoi_gt, value: this.form.nguoi_gt }
          if (this.form.dinh_kem) {
            this.attach = { fileName: this.form.dinh_kem.split('/'), fullName: this.form.dinh_kem }
            this.attach.fileName = this.attach.fileName[this.attach.fileName.length - 1]
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onGetDonvi(props) {
      apiDonvi.select().then((x) => {
        this.donvis = x.map(x => ({ label: x.ten_dv, value: x.donvi_id }))
      })
    },
    onGetNhanvien(props) {
      apiNV.select({ donvi_id: this.donvi.value }).then((x) => {
        this.nhanviens = x.map(x => ({ label: x.ten_nv, value: x.nhanvien_id }))
      })
    },
    onSelectNguoiGT() {
      this.dialogNGT = true
      this.onGetDonvi()
    },
    onSubmitNguoiGT() {
      this.selectedNV = this.nhanvien
      this.form.nguoi_gt = this.nhanvien.value
      this.dialogNGT = false
    },
    onUploadedAttach(info) {
      var res = JSON.parse(info.xhr.response)
      if (res.length > 0) {
        this.form.dinh_kem = res[0].fullName// `${process.env.API_UPLOAD}/${res[0].fullName}`
        this.attach = res[0]
      } else this.form.dinh_kem = null
    },
    onUploadFinish() {
      this.dialogUploadAttach = false
    },
    onOpenViewFile(title, url) {
      // window.open(url, '_blank')
      this.maximizedView = false
      this.viewItem = { title: title, url: url }
      this.dialogView = true
    },
    onCalPrice() {
      this.form.tong = this.form.so_luong * this.form.tien
      this.form.thue = Math.round(this.form.tong * 0.1)
      this.form.tong_cong = this.form.tong + this.form.thue
    },
    onSubmit(action) {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.group_id = this.group.value
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
            this.form.trang_thai = action
            if (action) this.loading_add = true
            else this.loading_drafts = true
            api.insert(this.form).then((x) => {
              this.items.push(x)
              this.reset()
            }).finally(() => {
              this.loading_add = false
              this.loading_drafts = false
            })
          }
        }
      })
    },
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        // this.form.routes = treeRouters.ticked
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
