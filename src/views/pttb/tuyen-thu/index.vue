<template>
  <div>
    <div class="row">
      <div v-if="notify" class="bg-deep-orange text-white q-pa-sm q-mb-md row">
        <div class="col">
          <span class="text-bold">
            Từ ngày 01-10 hàng tháng (trong thời gian tính cước),
          </span>
          <span>
            Anh/Chị không được cập nhật lại nhân viên quản lý tuyến thu để tránh
            lỗi khi sinh công nợ trên hệ thống tính cước tập trung!
          </span>
        </div>
        <div style="padding:5px;display:flex;" @click="notify=false">
          <i class="material-icons cursor-pointer">close</i>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="row"></div>
      <div class="col">
        <q-card>
          <q-card-section class="bg-indigo text-white">
            <div class="text-h6">Danh sách tuyến thu</div>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-table :data="tuyenThus" :columns="columns" row-key="tuyenthu_id"
              :loading="$store.state.loading.get || $store.state.loading.patch" selection="multiple"
              :selected.sync="selected" :pagination.sync="pagination"
              :dense="$store.getters.dense.table" :virtual-scroll-sticky-size-start="48"
              virtual-scroll :virtual-scroll-item-size="48" hide-bottom
              :no-data-label="$t('table.no_data')" :dark="$store.state.app.darkMode"
              class="my-sticky-virtscroll-table">
              <template v-slot:top="props">
                <div class="col-12 row">
                  <div class="col-8">
                    <q-select v-model="donvi" :options="donvis" label="Đơn vị"
                      :dense="$store.getters.dense.input"
                      :options-dense="$store.getters.dense.input" input-debounce="300"
                      :rules="[v=>(v && Object.keys(v).length)||$t('error.required')]"
                      @input="onGetUsers" />
                  </div>
                  <q-space />
                  <div class="col-4 col-sm-auto self-center text-right">
                    <q-btn flat round dense :color="$store.state.app.darkMode ? '' : 'grey-7'"
                      :icon="
                        props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                      " @click="props.toggleFullscreen">
                      <q-tooltip v-if="!$q.platform.is.mobile">
                        {{
                          props.inFullscreen
                            ? $t('table.normal_screen')
                            : $t('table.full_screen')
                        }}
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="col-8">
                    <q-select v-model="user" :options="users" label="Nhân viên đang quản lý"
                      :dense="$store.getters.dense.input"
                      :options-dense="$store.getters.dense.input" input-debounce="300"
                      :rules="[v=>(v && Object.keys(v).length)||$t('error.required')]"
                      @input="onGetTuyenThu" />
                  </div>
                  <q-space />
                  <div class="col-8 col-md-8"></div>
                </div>
              </template>
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width>
                    <q-checkbox v-if="props.multipleSelect" v-model="props.selected"
                      :dense="$store.getters.dense.table" indeterminate-value="some" />
                  </q-th>
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="$store.state.app.darkMode" class="text-bold">{{
                      col.label
                    }}</span>
                    <span v-else class="text-bold text-blue-grey-10">{{
                      col.label
                    }}</span>
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-checkbox v-model="props.selected" color="primary"
                      :dense="$store.getters.dense.table" />
                  </q-td>
                  <q-td key="ma_tuyen" :props="props">
                    {{ props.row.ma_tuyen }}
                  </q-td>
                  <q-td key="tentuyen" :props="props">
                    {{ props.row.tentuyen }}
                  </q-td>
                  <q-td key="kieuthu" :props="props">
                    {{ props.row.kieuthu }}
                  </q-td>
                  <q-td key="hinhthuc_tt" :props="props">
                    {{ props.row.hinhthuc_tt }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-1" v-if="isRoutes.edit"></div>
      <q-space />
      <div class="col-12 col-md-4" v-if="isRoutes.edit">
        <q-card>
          <q-card-section class="bg-teal text-white">
            <div class="text-h6">Cập nhật</div>
            <div class="text-subtitle2">
              Cập nhật nhân viên quản lý tuyến thu
            </div>
          </q-card-section>
          <q-separator />
          <q-form ref="form">
            <q-card-actions>
              <div class="col-12">
                <q-select v-model="nhanvien" :options="nhanviens" label="Nhân viên quản lý mới"
                  hint="Tích chọn tuyến cần thay đổi, chọn nhân viên quản lý mới"
                  :dense="$store.getters.dense.input" :options-dense="$store.getters.dense.input"
                  input-debounce="300"
                  :rules="[v=>(v && Object.keys(v).length)||$t('error.required')]" />
              </div>
            </q-card-actions>
            <q-card-actions align="right">
              <q-btn v-if="allowUpdate" type="submit" dense color="blue"
                :disable="$store.state.loading.post" @click.prevent="onUpdateTuyenThu">
                <q-icon left size="16px" name="rate_review" />
                {{ $t('global.update') }}
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
import * as apiDonvi from '@/api/donvi';
import * as apiUsers from '@/api/users';
import * as apiPTTB from '@/api/pttb';
export default {
  // components: { updateNv },
  data() {
    return {
      dialogUpdateNV: false,
      allowUpdate: false,
      notify: true,
      donvis: [],
      donvi: null,
      tuyenThus: [],
      selected: [],
      users: [],
      user: null,
      nhanviens: [],
      nhanvien: null,
      columns: [
        {
          name: 'ma_tuyen',
          field: 'ma_tuyen',
          label: 'Mã tuyến',
          align: 'left',
          sortable: true
        },
        {
          name: 'tentuyen',
          field: 'tentuyen',
          label: 'Tên tuyến',
          align: 'left',
          sortable: true
        },
        {
          name: 'kieuthu',
          field: 'kieuthu',
          label: 'Kiểu thu',
          align: 'right',
          sortable: true
        },
        {
          name: 'hinhthuc_tt',
          field: 'hinhthuc_tt',
          label: 'Hình thức TT',
          align: 'right',
          sortable: true
        }
      ],
      pagination: {
        sortBy: 'ma_tuyen',
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      isRoutes: {
        view: this.$router.has(`pttb-tuyen-thu-view`),
        edit: this.$router.has(`pttb-tuyen-thu-edit`)
      }
    };
  },
  created() {
    // this.$q.notify({
    //   color: 'warning',
    //   timeout: 90000,
    //   html: true,
    //   message: `Từ ngày 01-10 hàng tháng (trong thời gian tính cước)<br/>
    //   Anh/Chị không được cập nhật lại nhân viên quản lý tuyến thu
    //   để tránh lỗi khi sinh công nợ trên hệ thống tính cước tập trung!`
    // });
    apiPTTB.getAllowUpdateTuyenThu().then(x => {
      this.allowUpdate = x;
    });
  },
  mounted() {
    this.onGetDonvi();
  },
  methods: {
    onGetDonvi() {
      apiDonvi.select().then(x => {
        this.donvis = x.map(x => ({ label: x.ten_dv, value: x.donvi_id }));
      });
    },
    onGetUsers() {
      this.users = [];
      this.nhanviens = [];
      apiUsers.find({ donvi_id: this.donvi.value }).then(x => {
        this.users = x.map(x => ({ label: x.ten_nv, value: x.nhanvien_id }));
        this.nhanviens = [...this.users];
        if (this.users.length) {
          this.user = this.users[0];
          this.ma_nd = this.user.value;
        }
      });
    },
    onGetTuyenThu() {
      apiPTTB
        .getTuyenThu({
          donvi_id: this.donvi.value,
          nhanvien_id: this.user.value
        })
        .then(x => {
          this.tuyenThus = x;
        });
    },
    onUpdateTuyenThu() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (!this.selected.length) {
            this.$q.notify({
              color: 'warning',
              timeout: 3000,
              message: 'Vui lòng chọn tuyến thu cần cập nhật!'
            });
            return null;
          }
          apiPTTB
            .updateTuyenThu({
              nhanvien_id: this.nhanvien.value,
              tuyenthu_id: this.selected.map(x => x.tuyenthu_id)
            })
            .then(x => {
              this.onGetTuyenThu();
            })
            .finally(() => {
              this.selected = [];
            });
        }
      });
    }
  }
};
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
