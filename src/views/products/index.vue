<template>
  <div>
    <q-table :data="items" :columns="columns" row-key="_id" :visible-columns="visibleColumns"
      :loading="$store.state.loading.get||$store.state.loading.patch" :selected.sync="selected" :dense="denseTable"
      selection="multiple" :no-data-label="$t('table.no_data')" :rows-per-page-label="$t('table.row_per_page')"
      :selected-rows-label="getSelectedString" :rows-per-page-options="[10, 20, 50 ,100, 200, 0]"
      :pagination.sync="pagination" @request="onSelect" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t('product.title')}}</div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <div class="col-auto self-center">
              <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue" @click="dialogAdd=true">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&pagination.enable" flat round dense color="negative"
                icon="delete" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.enable" flat round dense color="warning"
                icon="restore_page" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
              </q-btn>
              <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.display_columns')}}</q-tooltip>
                <q-menu fit>
                  <q-list dense style="min-width:100px">
                    <template v-for="(item,index) in columns">
                      <q-item clickable :key="index" v-if="!item.required" @click="onColumns(item.name)"
                        :active="visibleColumns.indexOf(item.name)>-1||false">
                        <q-item-section>{{$t(item.label)}}</q-item-section>
                      </q-item>
                    </template>
                  </q-list>
                </q-menu>
              </q-btn>
              <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen">
                <q-tooltip v-if="!$q.platform.is.mobile">
                  {{props.inFullscreen?$t('table.normal_screen'):$t('table.full_screen')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                icon="more_vert">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.action')}}</q-tooltip>
                <q-menu auto-close>
                  <q-list dense bordered>
                    <q-item clickable>
                      <q-item-section no-wrap @click="onChangeEnable(true)">{{$t('global.working')}}</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section no-wrap @click="onChangeEnable(false)">{{$t('global.locked')}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 row">
          <q-space />
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="pagination.filter" :dense="denseInput" debounce="500" :placeholder="$t('global.search')">
              <template v-slot:append>
                <q-icon v-if="pagination.filter===''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
              </template>
            </q-input>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected" indeterminate-value="some" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="$store.state.app.darkMode" class="text-bold">{{ $t(col.label) }}</span>
            <span v-else class="text-bold text-blue-grey-10">{{ $t(col.label) }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" color="primary" />
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="full_name" :props="props">
            {{ props.row.full_name }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone }}
          </q-td>
          <!-- <q-td key="roles" :props="props" class="q-gutter-xs">
            <template v-if="props.row.roles&&props.row.roles.length>0">
              <q-badge v-for="(item,index) in onFilterRoles(props.row.roles)" :key="index"
                :style="{backgroundColor:item.color}">
                {{item.label}}
              </q-badge>
            </template>
            <q-badge v-else color="blue-grey-10">{{$t('global.undefined')}}</q-badge>
          </q-td> -->
          <q-td key="actions" :props="props" auto-width class="text-center">
            <q-btn v-if="isRoutes.edit" flat round dense icon="edit" @click="onUpdate(props.row)" color="light-green">
              <q-tooltip v-if="!$q.platform.is.mobile">
                {{$t('global.update')}}</q-tooltip>
            </q-btn>
            <template v-if="isRoutes.trash">
              <q-btn v-if="pagination.enable" flat round dense color="negative" icon="clear"
                @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.lock')}}</q-tooltip>
              </q-btn>
              <q-btn v-else flat round dense @click="onTrash(props.row)" color="amber" icon="restore">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.unlock')}}</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Add dialog -->
    <q-dialog v-model="dialogAdd" persistent>
      <template-add :dialog.sync="dialogAdd" :item.sync="selected[0]" :items.sync="items" :categories="categories"
        :category="category" :units="units" :unitsPrice="unitsPrice" :pin="pin" />
    </q-dialog>
  </div>
</template>

<script>
import templateAdd from './add'
import * as api from '@/api/products'
import * as apiCategory from '@/api/categories'
import * as treeRouters from '@/utils/tree'
import * as apiTypes from '@/api/types'
export default {
  components: { templateAdd },
  data() {
    return {
      dialogFilter: false,
      dialogAdd: false,
      items: [],
      selected: [],
      categories: [],
      category: [],
      units: [],
      unitsPrice: [],
      pin: [],
      isRoutes: {
        add: this.$router.has('manager-users-add'),
        edit: this.$router.has('manager-users-edit'),
        trash: this.$router.has('manager-users-trash')
      },
      pagination: {
        filter: '',
        sortBy: 'level',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 1,
        enable: true
      },
      visibleColumns: ['email', 'full_name', 'phone', 'roles', 'email_verified'],
      columns: [
        { name: 'email', field: 'email', label: 'users.email', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
        { name: 'full_name', field: 'full_name', label: 'users.full_name', align: 'left', sortable: true, required: true },
        { name: 'phone', field: 'phone', label: 'users.phone', align: 'right', sortable: true },
        { name: 'roles', field: 'roles', label: 'roles.title', align: 'left', sortable: true },
        { name: 'verified', field: 'verified', label: 'users.verified', align: 'left', sortable: true },
        { name: 'actions', field: 'actions', label: 'table.actions', align: 'center', required: true }
      ]
    }
  },
  mounted() {
    this.onGetCategory()
    this.onSelect({ pagination: this.pagination })
    this.onGetUnits({ key: 'unit' })
    this.onGetUnitsPrice({ key: 'unit_price' })
    this.onGetPin({ key: 'pin' })
  },
  computed: {
    denseTable() {
      return this.$store.state.app.dense.table
    },
    denseInput() {
      return this.$store.state.app.dense.input
    }
  },
  watch: {
    dialogAdd(val) {
      if (!val) this.selected = []
    }
  },
  methods: {
    onGetCategory() {
      apiCategory.select().then((x) => {
        this.categories = treeRouters.generateCategory(x.data)
        // console.log(this.items)
      })
    },
    onGetUnits(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) this.units = x.data
      })
    },
    onGetUnitsPrice(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) this.unitsPrice = x.data
      })
    },
    onGetPin(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) this.pin = x.data.map(x => ({ value: x.code, label: x.name }))
      })
    },
    onSelect(props) {
      api.select(props.pagination).then((x) => {
        this.items = x.data
        this.pagination = props.pagination
        this.pagination.rowsNumber = x.rowsNumber
      })
    },
    onChangeEnable(enable) {
      if (enable === this.pagination.enable) return
      this.selected = []
      this.pagination.enable = enable
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
    onUpdate(item) {
      this.dialogAdd = true
      this.selected = [item]
      this.category = treeRouters.findNode(this.categories, item.categories, '_id')
    },
    onTrash(item) {
      this.$q.dialog({
        title: this.$t('message_box.warning'),
        message: this.pagination.enable ? this.$t('message_box.lock') : this.$t('message_box.unlock'),
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
    }
  }
}
</script>

<style>
</style>
