<template>
  <div>
    <q-table :data="items" :columns="columns" row-key="nguoidung_id"
      :visible-columns="visibleColumns"
      :loading="$store.state.loading.get||$store.state.loading.patch"
      :selected.sync="selected" :dense="$store.state.app.dense.table" selection="multiple"
      :no-data-label="$t('table.no_data')" :rows-per-page-label="$t('table.row_per_page')"
      :selected-rows-label="getSelectedString"
      :rows-per-page-options="[10, 20, 50 ,100, 200, 0]" :pagination.sync="pagination"
      @request="onSelect" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t('users.title')}}
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <div class="col-auto self-center">
              <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue"
                @click="dialogAdd=true">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&pagination.trangthai" flat
                round dense color="negative" icon="delete" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}
                </q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.trangthai" flat
                round dense color="warning" icon="restore_page" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}
                </q-tooltip>
              </q-btn>
              <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                icon="menu_open">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.display_columns')}}
                </q-tooltip>
                <q-menu fit>
                  <q-list dense style="min-width:100px">
                    <template v-for="(item,index) in columns">
                      <q-item clickable :key="index" v-if="!item.required"
                        @click="onColumns(item.name)"
                        :active="visibleColumns.indexOf(item.name)>-1||false">
                        <q-item-section>{{item.label}}</q-item-section>
                      </q-item>
                    </template>
                  </q-list>
                </q-menu>
              </q-btn>
              <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen">
                <q-tooltip v-if="!$q.platform.is.mobile">
                  {{props.inFullscreen?$t('table.normal_screen'):$t('table.full_screen')}}
                </q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash" flat round dense
                :color="$store.state.app.darkMode?'':'grey-7'" icon="more_vert">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.action')}}
                </q-tooltip>
                <q-menu auto-close>
                  <q-list dense bordered>
                    <q-item clickable>
                      <q-item-section no-wrap @click="onChangeEnable(1)">
                        {{$t('global.working')}}</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section no-wrap @click="onChangeEnable(0)">
                        {{$t('global.locked')}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5">
            <q-select v-model="donvi" :options="donvis" label="Đơn vị"
              :dense="$store.getters.dense.input"
              :options-dense="$store.getters.dense.input" input-debounce="300"
              @input="onSelect({pagination:pagination})"
              :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]" />
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-5">
            <q-input v-model="pagination.filter" :dense="$store.state.app.dense.input"
              debounce="500" :placeholder="$t('global.search')">
              <template v-slot:append>
                <q-icon v-if="pagination.filter===''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer"
                  @click="pagination.filter=''" />
              </template>
            </q-input>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected"
              :dense="$store.state.app.dense.table" indeterminate-value="some" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="$store.state.app.darkMode"
              class="text-bold">{{ col.label }}</span>
            <span v-else class="text-bold text-blue-grey-10">{{ col.label }}</span>
          </q-th>
          <q-th auto-width v-if="isRoutes.edit||isRoutes.trash">#</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" color="primary"
              :dense="$store.state.app.dense.table" />
          </q-td>
          <q-td key="ten_dv" :props="props">
            {{ props.row.ten_dv }}
          </q-td>
          <q-td key="ma_nd" :props="props">
            {{ props.row.ma_nd }}
          </q-td>
          <q-td key="ma_nv" :props="props">
            {{ props.row.ma_nv }}
          </q-td>
          <q-td key="ten_nd" :props="props">
            {{ props.row.ten_nd }}
          </q-td>
          <q-td key="so_dt" :props="props">
            {{ props.row.so_dt }}
          </q-td>
          <q-td key="roles" :props="props" class="q-gutter-xs">
            <!-- <q-badge :style="{backgroundColor:props.row.color}">{{ props.row.name }}</q-badge> -->
            <template v-if="props.row.roles&&props.row.roles.length>0">
              <!-- <q-badge class="bri" v-for="(item,index) in onFilterRoles(props.row.roles)"
                :key="index" :style="{backgroundColor:item.color}">
                {{item.label}}
              </q-badge> -->
              <q-badge class="bri"
                :style="props.row.roles_color?JSON.parse(props.row.roles_color):''">
                {{props.row.roles}}
              </q-badge>
            </template>
            <q-badge class="bri" v-else color="blue-grey-10">{{$t('global.undefined')}}
            </q-badge>
            <!-- {{ props.row.roles.length>0?props.row.roles.length:$t('global.undefined') }} -->
          </q-td>
          <q-td v-if="isRoutes.edit||isRoutes.trash" key="actions" auto-width
            class="text-center">
            <q-btn v-if="isRoutes.edit" flat round dense icon="verified_user"
              @click="onSetRoles(props.row)" color="indigo">
              <q-tooltip v-if="!$q.platform.is.mobile">Cập nhật quyền</q-tooltip>
            </q-btn>
            <!-- <q-btn v-if="pagination.trangthai" flat round dense color="green"
              icon="vpn_key" :loading="loadingResetPassword"
              @click="onResetPassword(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('users.reset_password')}}
              </q-tooltip>
            </q-btn> -->
            <!-- <q-btn v-if="isRoutes.edit" flat round dense icon="edit"
              @click="onUpdate(props.row)" color="light-green">
              <q-tooltip v-if="!$q.platform.is.mobile">
                {{$t('global.update')}}</q-tooltip>
            </q-btn> -->
            <!-- <template v-if="isRoutes.trash">
              <q-btn v-if="pagination.trangthai" flat round dense color="negative"
                icon="clear" @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.lock')}}</q-tooltip>
              </q-btn>
              <q-btn v-else flat round dense @click="onTrash(props.row)" color="amber"
                icon="restore">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.unlock')}}
                </q-tooltip>
              </q-btn>
            </template> -->
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Add dialog -->
    <q-dialog v-model="dialogAdd" persistent>
      <template-add :dialog.sync="dialogAdd" :item.sync="selected[0]" :items.sync="items"
        :roles="roles" />
    </q-dialog>
    <q-dialog v-model="dialogSetRole" persistent>
      <template-roles :dialog.sync="dialogAdd" :item.sync="selected[0]"
        :items.sync="items" :roles="roles" />
    </q-dialog>
  </div>
</template>

<script>
import templateAdd from './add'
import templateRoles from './roles'
import * as api from '@/api/users'
import * as apiRoles from '@/api/roles'
import * as apiDonvi from '@/api/donvi'
export default {
  components: { templateAdd, templateRoles },
  data() {
    return {
      dialogFilter: false,
      dialogAdd: false,
      dialogSetRole: false,
      items: [],
      selected: [],
      roles: [],
      loadingResetPassword: false,
      donvis: [],
      donvi: null,
      isRoutes: {
        add: this.$router.has('manager-users-add'),
        edit: this.$router.has('manager-users-edit'),
        trash: this.$router.has('manager-users-trash')
      },
      pagination: {
        filter: '',
        sortBy: 'ma_nd',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 1,
        trangthai: 1
      },
      visibleColumns: ['so_dt', 'roles'],
      columns: [
        { name: 'ten_dv', field: 'ten_dv', label: 'Đơn vị', align: 'left', sortable: true, required: true },
        { name: 'ma_nd', field: 'ma_nd', label: 'Mã người dùng', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
        { name: 'ma_nv', field: 'ma_nv', label: 'Mã nhân viên', align: 'left', sortable: true, required: true },
        { name: 'ten_nd', field: 'ten_nd', label: 'Tên người dùng', align: 'left', sortable: true, required: true },
        { name: 'so_dt', field: 'so_dt', label: 'SĐT', align: 'right', sortable: true },
        { name: 'roles', field: 'roles', label: 'Quyền', align: 'left', sortable: true }
        // { name: 'actions', field: 'actions', label: '#', align: 'center', required: true }
      ]
    }
  },
  mounted() {
    this.onSelect({ pagination: this.pagination })
    this.onGetRoles()
    this.onGetDonvi()
  },
  watch: {
    dialogAdd(val) {
      if (!val) this.selected = []
    }
  },
  methods: {
    onSelect(props) {
      if (this.donvi) props.pagination.donvi_id = this.donvi.value
      api.select(props.pagination).then((x) => {
        this.items = x.data
        this.pagination = props.pagination
        this.pagination.rowsNumber = x.rowsNumber
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
    onGetRoles(props) {
      apiRoles.select().then((x) => {
        this.roles = x
      })
    },
    onFilterRoles(roles) {
      const rs = this.roles.filter(x => roles.includes(x.id))
      // return rs.map(x => (x.label)).join(', ')
      return rs
    },
    onChangeEnable(trangthai) {
      if (trangthai === this.pagination.trangthai) return
      this.selected = []
      this.pagination.trangthai = trangthai
      this.onSelect({ pagination: this.pagination })
    },
    onColumns(value) {
      var index = this.visibleColumns.indexOf(value)
      if (index < 0) this.visibleColumns.push(value)
      else this.visibleColumns.splice(index, 1)
    },
    getSelectedString(numberOfRows) {
      return `${this.selected.length} ${this.$t('table.row_selected')}.`
    },
    onSetRoles(item) {
      this.dialogSetRole = true
      this.selected = [item]
    },
    onUpdate(item) {
      this.dialogAdd = true
      this.selected = [item]
    },
    onTrash(item) {
      this.$q.dialog({
        title: this.$t('message_box.warning'),
        message: this.pagination.trangthai ? this.$t('message_box.lock') : this.$t('message_box.unlock'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (item) this.selected = [item]
        api.lock({ _id: this.selected.map(x => x._id) }).then((x) => {
          x.success.forEach(e => {
            const index = this.items.findIndex(x => x._id === e)
            this.items.splice(index, 1)
          })
        }).finally(() => {
          this.selected = []
        })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        this.selected = []
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    onResetPassword(item) {
      this.$q.dialog({
        title: this.$t('message_box.warning'),
        message: this.$t('message_box.reset_password', { username: item.email }),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (item) this.selected = [item]
        this.loadingResetPassword = true
        api.resetPassword({ _id: item._id }).then((x) => {
          this.$q.notify({
            color: 'teal',
            timeout: 5000 * 60,
            message: this.$t('users.msg_reset_password', { username: item.email, password: x.password })
          })
        }).finally(() => {
          this.selected = []
          this.loadingResetPassword = false
        })
      }).onCancel(() => {
        this.selected = []
      })
    }
  }
}
</script>

<style>
</style>
