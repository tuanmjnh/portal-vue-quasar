<template>
  <div>
    <div class="col-12 row">
      <div class="col-xs-12 col-sm-auto q-table__title text-h6">
        {{$t(`category.title`)}}</div>
    </div>
    <div class="col-12 row">
      <div class="col-xs-12 col-sm-5 col-md-4">
        <q-select v-model="key" :options="keys" :dense="$store.state.app.dense.input"
          :options-dense="$store.state.app.dense.input" :label="$t('global.types')"
          @input="onFilterKey()" />
      </div>
      <q-space />
      <div class="col-xs-12 col-sm-5 col-md-4">
        <q-input v-model="pagination.filter" :dense="$store.state.app.dense.input" debounce="500"
          :placeholder="$t('global.search')">
          <template v-slot:append>
            <q-icon v-if="pagination.filter===''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
          </template>
        </q-input>
      </div>
    </div>
    <!-- <q-tree ref="tree" class="col-12 col-sm-6" :nodes="items" :dense="denseInput" node-key="_id" :ticked.sync="ticked"
      :selected.sync="selected" :expanded.sync="expanded" tick-strategy="leaf" :filter="pagination.filter"
      :filter-method="onFilter" :no-nodes-label="$t('table.no_data')">
      <template v-slot:default-header="prop">
        <div class="row items-center" @mouseover="tooltipAction=prop.key" @mouseleave="tooltipAction=''">
          <q-icon :name="prop.node.icon" color="blue-grey" size="20px" class="q-mr-sm" />
          <div :class="['q-pr-md',prop.node.flag===1?'':'text-blue-grey-4']" :style="{color:prop.node.color}">
            {{ prop.node.meta && prop.node.meta.label ? $t(`category.${prop.node.meta.label}`) : prop.node.title }}
          </div>
          <template v-if="prop.key===tooltipAction">
            <q-icon v-if="isRoutes.add" name="add" color="blue" size="16px" class="q-pl-xs q-pr-xs"
              @click="onAdd(prop.node)" />
            <q-icon v-if="isRoutes.edit" name="edit" color="light-green" size="16px" class="q-pl-xs q-pr-xs"
              @click="onUpdate(prop.node)" />
            <template v-if="isRoutes.trash">
              <q-icon v-if="prop.node.flag===1" name="clear" color="negative" size="16px" class="q-pl-xs q-pr-xs"
                @click="onTrash(prop.node)" />
              <q-icon v-else name="restore" color="amber" size="16px" class="q-pl-xs q-pr-xs"
                @click="onTrash(prop.node)" />
            </template>
          </template>
        </div>
      </template>
    </q-tree>
    <q-separator></q-separator> -->
    <div class="row">
      <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue" @click="onAdd()">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
      </q-btn>
    </div>
    <tm-tree :nodes="items" node-key="id" label="label" icon-html
      :no-nodes-label="$t('table.no_data')" :selected.sync="selected" :ticked.sync="ticked"
      :expanded.sync="expanded" tick-strategy="leaf-child" :draggable="true"
      :filter-method="onFilter" :filter="pagination.filter" @on-drag-changed="onTreeDragChanged">
      <template v-slot:content-after="prop">
        <div class="row items-center" @mouseover="tooltipAction=prop.node.id"
          @mouseleave="tooltipAction=''">
          <!-- <q-icon :name="prop.node.icon" color="blue-grey" size="20px" class="q-mr-sm" /> -->
          <div v-html="prop.node.icon" />
          <div :class="['node-label q-pr-md',prop.node.flag===1?'':'text-blue-grey-4']"
            :style="{color:prop.node.color?prop.node.color:'#009688'}">
            {{ prop.node.label }}
          </div>
          <template v-if="prop.node.id===tooltipAction">
            <q-icon v-if="isRoutes.add" name="add" color="blue" size="16px" class="q-pl-xs q-pr-xs"
              @click="onAdd(prop.node)" />
            <q-icon v-if="isRoutes.edit" name="edit" color="light-green" size="16px"
              class="q-pl-xs q-pr-xs" @click="onUpdate(prop.node)" />
            <template v-if="isRoutes.trash">
              <q-icon v-if="prop.node.flag===1" name="clear" color="negative" size="16px"
                class="q-pl-xs q-pr-xs" @click="onTrash(prop.node)" />
              <q-icon v-else name="restore" color="amber" size="16px" class="q-pl-xs q-pr-xs"
                @click="onTrash(prop.node)" />
            </template>
          </template>
        </div>
      </template>
    </tm-tree>
    <!-- <div class="row">selected: {{selected}}</div>
    <div class="row">ticked: {{ticked}}</div>
    <div class="row">expanded: {{expanded}}</div> -->
    <!-- Add dialog -->
    <q-dialog v-model="dialogAdd" persistent>
      <template-add :dialog.sync="dialogAdd" :item.sync="item" :items.sync="items"
        :dependent="dependent" :expanded="expanded" :keys="keys" />
    </q-dialog>
  </div>
</template>

<script>
import templateAdd from './add'
import * as api from '@/api/categories'
import * as apiTypes from '@/api/types'
import * as treeRouters from '@/utils/tree'
import normalize from '@/utils/search'
import tmTree from '@/components/tm-tree'
export default {
  components: { templateAdd, tmTree },
  data() {
    return {
      dialogAdd: false,
      items: [],
      rootItems: [],
      item: null,
      dependent: null,
      selected: '',
      ticked: [],
      expanded: [],
      keys: [],
      key: null,
      filter: '',
      tooltipAction: '',
      pagination: {
        key: '',
        filter: '',
        sortBy: 'orders',
        descending: false,
        flag: 1
      },
      isRoutes: {
        add: this.$router.has(`data-category-add`),
        edit: this.$router.has(`data-category-edit`),
        trash: this.$router.has(`data-category-trash`)
      }
    }
  },
  created() {
    this.onSelect({ pagination: this.pagination })
    this.onGetKey()
    // this.onGetPosition({ key: 'position' })
  },
  watch: {
    dialogAdd(val) {
      if (!val) {
        this.item = null
        this.dependent = null
      }
    }
    // pagination: {
    //   handler(val) {
    //     this.onSelect({ pagination: this.pagination })
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    onGetPosition(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.data && x.data.length > 0) this.positions = x.data.map(x => ({ label: this.$t(`position.${x.code}`), value: x.code }))
      })
    },
    onGetKey(props) {
      apiTypes.select(props).then((x) => {
        if (x && x.length > 0) {
          this.keys = x.map(x => ({ label: x.title, value: x.code }))
          this.key = this.keys[0]
          this.pagination.key = this.key.value
        }
      })
    },
    onSelect(props) {
      api.select(props.pagination).then((x) => {
        this.rootItems = x
        this.items = treeRouters.generateCategory(x)
      })
    },
    onFilterKey() {
      this.pagination.key = this.key.value
      this.onSelect({ pagination: this.pagination })
    },
    onFilter(node, filter) {
      const filt = normalize(filter.toLowerCase())
      const title = normalize(node.title)
      return title && title.toLowerCase().indexOf(filt) > -1
    },
    onResetFilter() {
      this.filter = ''
      this.$refs.filter.focus()
    },
    onChangeFlag(flag) {
      if (flag === this.pagination.flag) return
      this.selected = []
      this.pagination.flag = flag
      this.onSelect({ pagination: this.pagination })
    },
    onAdd(item) {
      this.dialogAdd = true
      if (item) this.dependent = item
    },
    onUpdate(item) {
      this.dialogAdd = true
      this.dependent = this.rootItems.find(x => x._id === item.dependent)
      this.item = item
    },
    onTrash(item) {
      this.$q.dialog({
        // dark: this.dark,
        title: this.$t('message_box.warning'),
        message: item.flag ? this.$t('message_box.trash') : this.$t('message_box.recover'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (item) this.selected = [item]
        api.lock({ _id: this.selected.map(x => x._id) }).then(x => {
          item.flag = item.flag === 1 ? 0 : 1
          // x.success.forEach(e => {
          //   e.flag = e.flag === 1 ? 0 : 1
          //   // const index = this.items.findIndex(x => x._id === e)
          //   // this.items.splice(index, 1)
          // })
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
    onDragTree({ node, index }) {
      // this.$nextTick(() => {
      if (node.level.toString() === 'NaN') {
        this.onSelect({ pagination: this.pagination })
      } else {
        node.orders = index
        api.updateOrder(node).then((x) => {
          // console.log(index)
        })
      }
      // })
    },
    onTreeDragChanged(e) {
      if (e.added) return
      else if (e.removed) e = e.removed
      else if (e.moved) e = e.moved
      // console.log(e.element.dependent, e.element.level, e.element.orders)
      e.element.orders = e.newIndex
      api.updateOrder(e.element).then((x) => {
        // console.log(x)
      })
    }
  }
}
</script>

<style lang="scss" scope>
.node-item .material-icons {
  color: #607d8b;
  font-size: 20px;
  padding-right: 3px;
}
.selected .node-label {
  color: #2196f3 !important;
}
.tooltip-action {
  position: absolute;
  .q-btn__content {
    i {
      font-size: 16px !important;
    }
  }
  &.add {
    right: -23px;
  }
  &.edit {
    right: -43px;
  }
  &.delete {
    right: -63px;
  }
}
.q-tree__node--selected .q-tree__node-header-content {
  color: initial;
}
.delete {
  color: #9e9e9e;
}
</style>
