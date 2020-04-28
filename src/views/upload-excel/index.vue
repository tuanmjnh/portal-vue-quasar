<template>
  <q-card flat bordered :style="$q.platform.is.mobile ? { width: '100%' } : { minWidth: '800px' }">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>
        {{ $t("route.uploadExcel") }}
      </q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="loading"
          @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-section>
        <tm-load-files ref="tmLoadFiles" :button="true" :label="$t('files.open_file')"
          :placeholder="$t('files.choose_file')" accept=".xls,.xlsx,.csv,.tsv,.txt,.json,.xml"
          @on-start="loading=true" @on-finish="onLoadedFile" :options="{header:'A',raw:true}" />
        <q-table v-if="loadedData&&loadedData.length" :data="loadedData" :columns="loadedColumns"
          row-key="id" dense :pagination.sync="loadedPagination">
          <template v-slot:top="props">
            <div class="col-12 row">
              <div class="col col-sm-auto q-table__title text-h6">
                {{ $t("files.dataFile") }}
              </div>
              <q-space />
              <div class="self-center text-right">
                <q-btn flat round dense :color="$store.getters.darkMode ? '' : 'grey-7'"
                  :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen">
                  <q-tooltip v-if="!$q.platform.is.mobile">
                    {{props.inFullscreen? $t("table.normal_screen"): $t("table.full_screen")}}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import tmLoadFiles from '@/components/tm-load-files'
import http from '@/utils/http-client'
export default {
  components: { tmLoadFiles },
  data() {
    return {
      collection: 'upload-excel',
      loading: false,
      loadedData: [],
      loadedItems: [],
      loadedColumns: [],
      loadedReport: { wrong: [], right: [] },
      loadedPagination: {
        filter: '',
        sortBy: 'order',
        descending: false,
        page: 1,
        rowsPerPage: 15,
        categories: null,
        flag: 1
      }
    }
  },
  methods: {
    onLoadedFile(data) {
      this.loading = false
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (!data) {
            this.$q.notify({
              message: this.$t('error.exist'),
              color: 'warning'
            })
            return null
          }
          if (data.length < 2) return
          this.loadedColumns = []
          Object.keys(data[0]).forEach(e => {
            this.loadedColumns.push({
              name: e,
              field: e,
              label: data[0][e],
              align: 'left',
              sortable: true
            })
          })
          for (let i = 1; i < data.length; i++) {
            const e = data[i]
            // Check Colum A
            if (e.A) {
              e.A = e.A.trim()
            } else {
              this.loadedReport.wrong.push(i)
              continue
            }
            // Check Colum B
            if (e.B) {
              e.B = parseInt(e.B)
            } else {
              this.loadedReport.wrong.push(i)
              continue
            }
            const item = {
              name: e.A,
              orders: e.B
            }
            this.loadedItems.push(item)
            this.loadedData.push(e)
          }
        }
      })
    },
    onSubmit() {
      this.loading = true
      http.post(`${this.collection}`, this.loadedItems).then((x) => {
        console.log(x)
      }).finally(() => {
        this.reset()
      })
    },
    reset() {
      new Promise((resolve, reject) => {
        this.loadedData = []
        this.loadedItems = []
        this.$refs.tmLoadFiles.reset()
        this.loading = false
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
