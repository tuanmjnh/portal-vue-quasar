<template>
  <div>
    <div class="row">
      <div class="col">
        <q-card>
          <q-card-section class="bg-indigo text-white">
            <div class="text-h6">Danh sách địa bàn</div>
            <div class="text-subtitle2">Nhân viên quản lý phố (cá nhân - doanh nghiệp)
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-table :data="phos" :columns="columns" row-key="id"
              :loading="$store.state.loading.get||$store.state.loading.patch"
              selection="multiple" :selected.sync="selected" :pagination.sync="pagination"
              :dense="$store.getters.dense.table" :virtual-scroll-sticky-size-start="48"
              virtual-scroll :virtual-scroll-item-size="48" hide-bottom
              :no-data-label="$t('table.no_data')" :dark="$store.state.app.darkMode"
              class="my-sticky-virtscroll-table">
              <template v-slot:top="props">
                <div class="col-12 row">
                  <div class="col-8">
                    <q-select v-model="quan" :options="quans" label="Quận"
                      :dense="$store.getters.dense.input"
                      :options-dense="$store.getters.dense.input" input-debounce="300"
                      @input="onGetPhuong" />
                  </div>
                  <q-space />
                  <div class="col-4 col-sm-auto self-center text-right">
                    <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen">
                      <q-tooltip v-if="!$q.platform.is.mobile">
                        {{props.inFullscreen?$t('table.normal_screen'):$t('table.full_screen')}}
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="col-8 col-md-5">
                    <q-select v-model="phuong" :options="phuongs" label="Phường"
                      :dense="$store.getters.dense.input"
                      :options-dense="$store.getters.dense.input" input-debounce="300"
                      @input="onGetPho" />
                  </div>
                  <q-space />
                  <div class="col-8 col-md-5">
                    <!-- <q-select v-model="formLoaiNV" :options="loaiNV"
                      label="Loại nhân viên" :dense="$store.getters.dense.input"
                      :options-dense="$store.getters.dense.input"
                      input-debounce="300" @input="onGetPho" /> -->
                    <q-select v-model="formLoaiNV" :options="loaiNV" option-value="id"
                      option-label="loai_nv" :dense="$store.getters.dense.input"
                      :options-dense="$store.getters.dense.input" @input="onGetPho" />
                  </div>
                </div>
              </template>
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width>
                    <q-checkbox v-if="props.multipleSelect" v-model="props.selected"
                      :dense="$store.getters.dense.table" indeterminate-value="some" />
                  </q-th>
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="$store.state.app.darkMode"
                      class="text-bold">{{ col.label }}</span>
                    <span v-else
                      class="text-bold text-blue-grey-10">{{ col.label }}</span>
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-checkbox v-model="props.selected" color="primary"
                      :dense="$store.getters.dense.table" />
                  </q-td>
                  <q-td key="ten_pho" :props="props">
                    {{ props.row.ten_pho }}
                  </q-td>
                  <q-td key="ten_lnv" :props="props">
                    <q-badge :style="JSON.parse(props.row.color)">
                      {{props.row.ten_lnv}}
                    </q-badge>
                    <!-- {{ props.row.loai_nv&&props.row.loai_nv===2?'Doanh Nghiệp':'Cá nhân' }} -->
                  </q-td>
                  <q-td key="ten_nv" :props="props">
                    {{ props.row.ten_nv }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <!-- <q-list dense bordered padding class="rounded-borders">
              <q-item clickable v-ripple v-for="(e,i) in pho" :key="i">
                <q-item-section avatar>
                  <q-checkbox dense v-model="phoSelected" :label="e.ten_pho"
                    color="teal" />
                </q-item-section>
                <q-item-section>
                  {{e.ten_nv}}
                </q-item-section>
                <q-item-section side>{{e.loai_nv}}</q-item-section>
              </q-item>
            </q-list> -->
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-1" v-if="isRoutes.edit"></div>
      <q-space />
      <div class="col-12 col-md-4" v-if="isRoutes.edit">
        <q-card>
          <q-card-section class="bg-teal text-white">
            <div class="text-h6">Cập nhật địa bàn</div>
            <div class="text-subtitle2">Đơn vị, Nhân viên</div>
          </q-card-section>
          <q-separator />
          <q-form ref="form">
            <q-card-actions>
              <div class="col-12">
                <q-select v-model="donvi" :options="donvis" label="Đơn vị"
                  :dense="$store.getters.dense.input"
                  :options-dense="$store.getters.dense.input" input-debounce="300"
                  @input="onGetUsers"
                  :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]" />
              </div>
              <div class="col-12">
                <q-select v-model="user" :options="users" label="Nhân viên"
                  :dense="$store.getters.dense.input"
                  :options-dense="$store.getters.dense.input" input-debounce="300"
                  :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]" />
              </div>
            </q-card-actions>
            <q-card-actions align="right">
              <q-btn type="submit" dense color="blue" :disable="$store.state.loading.post"
                @click.prevent="onUpdate">
                <q-icon left size="16px" name="rate_review" />
                {{$t('global.update')}}
                <!-- <q-tooltip v-if="!$q.platform.is.mobile">
                      {{$t('global.update')}}
                    </q-tooltip> -->
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
    <!-- Add dialog -->
    <q-dialog v-model="dialogUpdateNV" persistent>
      <update-nv :dialog.sync="dialogUpdateNV" />
    </q-dialog>
  </div>
</template>

<script>
// import updateNv from './update-nv'
import * as apiDonvi from '@/api/donvi'
import * as apiDiaban from '@/api/diaban'
import * as apiLoaiNV from '@/api/loai-nv'
import * as apiUsers from '@/api/users'
export default {
  // components: { updateNv },
  data() {
    return {
      dialogUpdateNV: false,
      donvis: [],
      donvi: null,
      quans: [],
      quan: null,
      phuongs: [],
      phuong: null,
      phos: [],
      pho: null,
      loaiNV: [],
      formLoaiNV: null,
      selected: [],
      users: [],
      user: null,
      columns: [
        { name: 'ten_pho', field: 'ten_pho', label: 'Tên phố', align: 'left', sortable: true },
        { name: 'ten_lnv', field: 'ten_lnv', label: 'Loại NV', align: 'left', sortable: true },
        { name: 'ten_nv', field: 'ten_nv', label: 'NV quản lý', align: 'right', sortable: true }
      ],
      pagination: {
        sortBy: 'loai_nv',
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      isRoutes: {
        list: this.$router.has(`diaban-list`),
        edit: this.$router.has(`diaban-edit`)
      }
    }
  },
  mounted() {
    this.onGetDonvi()
    this.onGetQuan()
    this.onGetLoaiNV()
  },
  methods: {
    onGetLoaiNV() {
      apiLoaiNV.select().then(x => {
        this.loaiNV = x
        this.loaiNV = [...[{ loai_nv: '-- Tất cả --', id: 0 }], ...this.loaiNV]
        this.formLoaiNV = this.loaiNV[0]
      })
    },
    onGetDonvi() {
      apiDonvi.select().then(x => {
        this.donvis = x.map(x => ({ label: x.ten_dv, value: x.donvi_id }))
        // if (this.donvi.length) {
        //   this.formDonvi = this.donvi[0]
        // }
      })
    },
    onGetQuan() {
      this.phuongs = []
      this.phuong = null
      this.phos = []
      apiDiaban.getQuan().then(x => {
        this.quans = x.map(x => ({ label: `${x.quan_id} - ${x.ten_quan}`, value: x.quan_id }))
      })
    },
    onGetPhuong() {
      this.phuongs = []
      this.phuong = null
      this.phos = []
      apiDiaban.getPhuong({ quan_id: this.quan.value }).then(x => {
        this.phuongs = x.map(x => ({ label: `${x.phuong_id} - ${x.ten_phuong}`, value: x.phuong_id }))
      })
    },
    onGetPho() {
      apiDiaban.getPho({ phuong_id: this.phuong.value, loai_nv: parseInt(this.formLoaiNV.id) }).then(x => {
        this.phos = x
        // if (x && x.length) {
        //   this.phuong = x.map(x => ({ label: `${x.phuong_id} - ${x.ten_phuong}`, value: x.phuong_id }))
        // }
      })
    },
    onGetUsers() {
      apiUsers.find({ donvi_id: this.donvi.value }).then(x => {
        this.users = x.map(x => ({ label: x.ten_nv, value: x.nhanvien_id }))
        if (this.users.length) {
          this.user = this.users[0]
          this.ma_nd = this.user.value
        }
      })
    },
    onUpdate() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (!this.selected.length) {
            this.$q.notify({
              color: 'warning',
              timeout: 3000,
              message: 'Vui lòng chọn địa bàn cần cập nhật!'
            })
            return null
          }
          apiDiaban.update({
            nhanvien_id: this.user.value,
            diaban: this.selected.map(x => ({ pho_id: x.pho_id, loai_nv: x.loai_nv }))
          }).then(x => {
            this.onGetPho()
          }).finally(() => {
            this.selected = []
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.my-sticky-virtscroll-table {
  width: 100%;
  /* max height is important */
  .q-table__middle {
    max-height: 400px;
  }
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #fff;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
  thead tr:first-child th {
    top: 0;
  }
  &.q-table--dark .q-table__top,
  &.q-table--dark .q-table__bottom,
  &.q-table--dark thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #121212 !important;
  }
}
</style>
