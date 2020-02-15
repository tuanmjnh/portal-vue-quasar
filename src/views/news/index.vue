<template>
  <div>
    <q-table :data="items" :columns="columns" row-key="id"
      :visible-columns="visibleColumns"
      :loading="$store.state.loading.get||$store.state.loading.patch"
      :selected.sync="selected" :dense="$store.state.app.dense.table" selection="multiple"
      :no-data-label="$t('table.no_data')" :rows-per-page-label="$t('table.row_per_page')"
      :selected-rows-label="getSelectedString"
      :rows-per-page-options="[10, 20, 50 ,100, 200, 0]" :pagination.sync="pagination"
      @request="onSelect" :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">
            Danh sách tin tức - hướng dẫn - tài liệu
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <div class="col-auto self-center">
              <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue"
                @click="dialogAdd=true">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&pagination.flag" flat round
                dense color="negative" icon="delete" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}
                </q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.flag" flat round
                dense color="warning" icon="restore_page" @click="onTrash()">
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
                      <q-item-section no-wrap @click="onChangeFlag(1)">
                        {{$t('global.working')}}</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section no-wrap @click="onChangeFlag(0)">
                        {{$t('global.locked')}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <q-select v-model="type" :options="types"
              :dense="$store.state.app.dense.input"
              :options-dense="$store.state.app.dense.input" :label="$t('global.types')"
              @input="onGetCategories" />
          </div>
          <q-space />
          <div class="col-xs-12 col-sm-5 col-md-4">
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
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-5 col-md-4">
            <q-select v-model="category" :options="categories"
              :dense="$store.state.app.dense.input"
              :options-dense="$store.state.app.dense.input" label="Danh mục"
              @input="onSelect({pagination:pagination})" />
          </div>
          <q-space />
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
            <q-checkbox v-model="props.selected" :dense="$store.state.app.dense.table"
              color="primary" />
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td auto-width key="orders" :props="props">
            {{ props.row.orders }}
          </q-td>
          <q-td auto-width key="created_at" :props="props">
            {{ props.row.created_at|formatDate('DD/MM/YYYY') }}
          </q-td>
          <q-td auto-width key="attach" :props="props">
            <q-icon v-if="props.row.attach" color="primary" name="attach_file"
              @click="onOpenViewFile(props.row.title,`${host}/${props.row.attach}`)">
              <q-tooltip>
                Mở tệp đính kèm
              </q-tooltip>
            </q-icon>
          </q-td>
          <q-td auto-width key="url" :props="props">
            <q-icon v-if="props.row.url" color="primary" name="link"
              @click="onOpenViewFile(props.row.title,props.row.url)">
              <q-tooltip>
                Truy cập đến đường dẫn
              </q-tooltip>
            </q-icon>
          </q-td>
          <q-td auto-width class="text-center" v-if="isRoutes.edit||isRoutes.trash">
            <q-btn v-if="isRoutes.edit" flat round dense icon="edit"
              @click="onUpdate(props.row)" color="light-green">
              <q-tooltip v-if="!$q.platform.is.mobile">
                {{$t('global.update')}}</q-tooltip>
            </q-btn>
            <template v-if="isRoutes.trash">
              <q-btn v-if="pagination.flag" flat round dense color="negative" icon="clear"
                @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.lock')}}</q-tooltip>
              </q-btn>
              <q-btn v-else flat round dense @click="onTrash(props.row)" color="amber"
                icon="restore">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.unlock')}}
                </q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Add dialog -->
    <q-dialog v-model="dialogAdd" persistent>
      <template-add :dialog.sync="dialogAdd" :item.sync="selected[0]" :items.sync="items"
        :roles="roles" />
    </q-dialog>
    <!-- View file dialog-->
    <q-dialog v-model="dialogView" :maximized="maximizedView" persistent>
      <view-file :dialog.sync="dialogView" :maximized.sync="maximizedView"
        :item="viewItem" />
    </q-dialog>
  </div>
</template>

<script>
import templateAdd from './add'
import viewFile from '@/components/view-file'
import * as api from '@/api/news'
import * as apiTypes from '@/api/types'
import * as apiCategories from '@/api/categories'
export default {
  components: { templateAdd, viewFile },
  data() {
    return {
      dialogFilter: false,
      dialogAdd: false,
      dialogView: false,
      maximizedView: false,
      items: [],
      selected: [],
      roles: [],
      types: [],
      type: {},
      categories: [],
      category: {},
      host: process.env['HOST'],
      viewItem: {},
      isRoutes: {
        add: this.$router.has('data-news-add'),
        edit: this.$router.has('data-news-edit'),
        trash: this.$router.has('data-news-trash')
      },
      pagination: {
        filter: '',
        sortBy: 'orders',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 1,
        flag: 1
      },
      visibleColumns: [],
      columns: [
        { name: 'title', field: 'title', label: 'Tiêu đề', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
        { name: 'orders', field: 'orders', label: 'Vị trí', align: 'right', sortable: true },
        { name: 'created_at', field: 'created_at', label: 'Ngày tạo', align: 'left', sortable: true },
        { name: 'attach', field: 'attach', label: 'Đính kèm', align: 'left', sortable: true, required: true },
        { name: 'url', field: 'url', label: 'Địa chỉ', align: 'left', sortable: true, required: true }
      ]
    }
  },
  created() {
    // this.onSelect({ pagination: this.pagination })
    this.onGetTypes()
  },
  watch: {
    dialogAdd(val) {
      if (!val) {
        this.selected = []
      }
    }
  },
  methods: {
    onGetTypes(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.length > 0) {
          this.types = x.map(x => ({ label: x.title, value: x.code }))
          this.type = this.types[0]
        }
      })
    },
    onGetCategories(props) {
      this.category = {}
      apiCategories.select({ key: this.type.value }).then((x) => {
        this.categories = x.map(x => ({ label: x.title, value: x.id }))
      })
    },
    onSelect(props) {
      if (this.type && this.type.value) props.pagination.key = this.type.value
      if (this.category && this.category.value) props.pagination.group_id = this.category.value
      api.select(props.pagination).then((x) => {
        this.items = x.data
        this.pagination = props.pagination
        this.pagination.rowsNumber = x.rowsNumber
      })
    },
    onChangeFlag(flag) {
      if (flag === this.pagination.flag) return
      this.selected = []
      this.pagination.flag = flag
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
    },
    onTrash(item) {
      this.$q.dialog({
        title: this.$t('message_box.warning'),
        message: this.pagination.flag ? this.$t('message_box.lock') : this.$t('message_box.unlock'),
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
    onOpenViewFile(title, url) {
      // window.open(url, '_blank')
      this.maximizedView = false
      this.viewItem = { title: title, url: url }
      this.dialogView = true
    }
  }
}
</script>

<style>
</style>
