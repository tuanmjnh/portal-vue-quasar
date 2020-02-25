<template>
  <q-card class="q-mb-md">
    <q-toolbar>
      <q-toolbar-title>
        Quản lý - kết xuất hóa đơn điện tử
      </q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-form ref="form" class="q-pa-md q-gutter-xs">
      <div class="row">
        <div class="col-7">
          <div class="text-subtitle2 text-teal">Thông tin dữ liệu</div>
          <!-- <q-input v-model.trim="dsMaTT" :dense="$store.state.app.dense.input" autogrow
            label="Mã thanh toán cần tạo nếu có" /> -->
          <q-input v-model.trim="table" :dense="$store.state.app.dense.input" v-uppercase
            label="Bảng dữ liệu HĐĐT" hint="ví dụ: BCSS_BKN.HDDT_20200101"
            :rules="[v=>v&&Object.keys(v).length>0||$t('error.required')]" />
          <q-input v-model.trim="dsMaTT" type="textarea"
            label="Mã thanh toán cần tạo nếu có" />
        </div>
        <q-space />
        <div class="col-4">
          <div class="col text-right">
            <q-btn type="submit" color="blue" icon="layers" dense :loading="loading" flat
              :disable="loading" @click.prevent="onSubmit('create')">
              <q-tooltip v-if="!$q.platform.is.mobile">Tạo hóa đơn</q-tooltip>
            </q-btn>
            <q-btn type="submit" color="red" icon="layers_clear" dense :loading="loading"
              flat :disable="loading" @click.prevent="onSubmit('remove')">
              <q-tooltip v-if="!$q.platform.is.mobile">Tạo hủy hóa đơn</q-tooltip>
            </q-btn>
          </div>
          <q-separator class="q-mb-sm q-mt-sm" />
          <div class="text-subtitle2 text-indigo">Kết xuất dữ liệu</div>
          <div v-if="exportData.xmlKhachHang" class="el-col el-col-6 el-xs-24 el-sm-24">
            <label>Khách hàng: </label>
            <tm-export-data :data="exportData.xmlKhachHang" :items="[
              { title: 'Export .xml' , type: 'xml' },
              { title: 'Export .zip' , type: 'zip-xml' }
              ]" :filename="exportData.fileNameKhachHang"
              :zipname="exportData.zipNameKhachHang" />
          </div>
          <div v-if="exportData.xmlHoadon" class="el-col el-col-6 el-xs-24 el-sm-24">
            <label>Hóa đơn: </label>
            <tm-export-data :data="exportData.xmlHoadon" :items="[
              { title: 'Export .xml' , type: 'xml' },
              { title: 'Export .zip' , type: 'zip-xml' }
              ]" :filename="exportData.fileNameHoadon"
              :zipname="exportData.zipNameHoadon" />
          </div>
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col-12"></div>
      </div>
    </q-form>
  </q-card>
</template>

<script>
import * as api from '@/api/hddt'
import tmExportData from '@/components/tm-export-data'
export default {
  components: { tmExportData },
  data() {
    return {
      tables: [],
      loading: false,
      billTime: '',
      kindOfService: '',
      dsMaTT: '',
      table: 'BCSS_BKN.HDDT_20200101',
      province: process.env.PROVINCE, // 'BKN', // CBG
      exportData: {
        xmlHoadon: '',
        xmlKhachHang: '',
        fileNameHoadon: 'hoadon',
        fileNameKhachHang: 'cus',
        zipNameHoadon: `hoadon_`,
        zipNameKhachHang: `khachhang_`
      },
      params: {
        table: '',
        ma_tt: ''
      }
    }
  },
  created() {
    // api.getTableHDDT({
    //   data: { table: 'HDDT_THAYTHE' }
    // }).then((rs) => {
    //   if (rs && rs.length > 0) {
    //     this.tables = rs
    //     this.params.table = rs[0].name
    //   }
    // })
  },
  methods: {
    onSubmit(type) {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.reset()
          this.loading = true
          api.getData({
            table: this.table,
            ma_tt: this.dsMaTT ? this.dsMaTT.split('\n') : []
          }).then(async (rs) => {
            this.exportData.zipNameHoadon = this.exportData.zipNameHoadon + rs.khd
            this.exportData.zipNameKhachHang = this.exportData.zipNameKhachHang + rs.khd
            const kyhoadon = {
              year: rs.khd.toString().substr(0, 4),
              month: rs.khd.toString().substr(4, 2),
              day: rs.khd.toString().substr(6, 2)
            }
            if (type === 'create') {
              this.exportData.xmlHoadon = await this.createHoaDon(rs.data, kyhoadon)
              this.exportData.xmlKhachHang = await this.createKhachHang(rs.data, kyhoadon)
            } else {
              this.exportData.xmlHoadon = await this.createHuyHoaDon(rs.data, kyhoadon)
              this.exportData.xmlKhachHang = await this.createKhachHang(rs.data, kyhoadon)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    createHoaDon(data, kyhoadon) {
      // const KindOfService =
      return new Promise((resolve, reject) => {
        let xmlHoadon = `<Invoices><BillTime>${kyhoadon.year + kyhoadon.month + kyhoadon.day}</BillTime>\r\n`
        for (const i of data) {
          xmlHoadon += `<Inv>`
          xmlHoadon += `<key>${i.fkey}</key>`
          xmlHoadon += `<Invoice>`
          xmlHoadon += `<CusCode><![CDATA[${i.ma_tt}]]></CusCode>`
          xmlHoadon += `<CusName><![CDATA[${i.ten_tt}]]></CusName>`
          xmlHoadon += `<CusAddress><![CDATA[${i.diachi_tt}]]></CusAddress>`
          xmlHoadon += `<CusPhone><![CDATA[${i.dienthoai_lh}]]></CusPhone>`
          xmlHoadon += `<CusTaxCode><![CDATA[]]></CusTaxCode>`
          xmlHoadon += `<PaymentMethod><![CDATA[TM/CK]]></PaymentMethod>`
          xmlHoadon += `<KindOfService><![CDATA[${kyhoadon[1] + '/' + kyhoadon[0]}]]></KindOfService>`
          xmlHoadon += `<ResourceCode><![CDATA[${i.manv_tc}]]></ResourceCode>`
          xmlHoadon += `<Products>`
          xmlHoadon += `<Product>`
          xmlHoadon += `<ProdName><![CDATA[Cước dịch vụ viễn thông: ${kyhoadon[1] + '/' + kyhoadon[0]}]]></ProdName>`
          xmlHoadon += `<ProdUnit></ProdUnit>`
          xmlHoadon += `<ProdQuantity></ProdQuantity>`
          xmlHoadon += `<ProdPrice></ProdPrice>`
          xmlHoadon += `<Amount>${i.cuoc_cthue}</Amount>`
          xmlHoadon += `</Product>`
          xmlHoadon += `<Product>`
          xmlHoadon += `<ProdName><![CDATA[Cước dịch vụ Viễn thông không thuế]]></ProdName>`
          xmlHoadon += `<ProdUnit></ProdUnit>`
          xmlHoadon += `<ProdQuantity></ProdQuantity>`
          xmlHoadon += `<ProdPrice></ProdPrice>`
          xmlHoadon += `<Amount>${i.cuoc_kthue}</Amount>`
          xmlHoadon += `</Product>`
          xmlHoadon += `<Product>`
          xmlHoadon += `<ProdName><![CDATA[Chiết khấu + đa dịch vụ]]></ProdName>`
          xmlHoadon += `<ProdUnit></ProdUnit>`
          xmlHoadon += `<ProdQuantity></ProdQuantity>`
          xmlHoadon += `<ProdPrice></ProdPrice>`
          xmlHoadon += `<Amount>0</Amount>`
          xmlHoadon += `</Product>`
          xmlHoadon += `<Product>`
          xmlHoadon += `<ProdName><![CDATA[Khuyến mại]]></ProdName>`
          xmlHoadon += `<ProdUnit></ProdUnit>`
          xmlHoadon += `<ProdQuantity></ProdQuantity>`
          xmlHoadon += `<ProdPrice></ProdPrice>`
          xmlHoadon += `<Amount>${i.tien_km}</Amount>`
          xmlHoadon += `</Product>`
          xmlHoadon += `</Products>`
          xmlHoadon += `<Extra><![CDATA[${i.tuyenthu};${i.cantru};${i.tong_pt}]]></Extra>`
          xmlHoadon += `<MaThanhToan>${i.qrcode ? i.qrcode : this.getMaThanhToanHD(kyhoadon.month + kyhoadon.year, i.ma_tt, 2)}</MaThanhToan>`
          xmlHoadon += `<Total>${i.tien}</Total>`
          xmlHoadon += `<DiscountAmount></DiscountAmount>`
          xmlHoadon += `<VATRate>10</VATRate>`
          xmlHoadon += `<VATAmount>${i.vat}</VATAmount>`
          xmlHoadon += `<Amount>${i.tong}</Amount>`
          xmlHoadon += `<AmountInWords>${i.tong_chu}</AmountInWords>`
          xmlHoadon += `<PaymentStatus>0</PaymentStatus>`
          xmlHoadon += `</Invoice>`
          xmlHoadon += `</Inv>\r\n`
        }
        xmlHoadon += '</Invoices>'
        resolve(xmlHoadon)
      })
    },
    createKhachHang(data, kyhoadon) {
      return new Promise((resolve, reject) => {
        let xml = '<Customers>\r\n'
        for (const i of data) {
          xml += `<Customer>`
          xml += `<Name><![CDATA[${i.ten_tt}]]></Name>`
          xml += `<Code>${i.ma_tt}</Code>`
          xml += `<TaxCode><![CDATA[${i.ms_thue}]]></TaxCode>`
          xml += `<Address><![CDATA[${i.diachi_tt}]]></Address>`
          xml += `<BankAccountName><![CDATA[]]></BankAccountName>`
          xml += `<BankName><![CDATA[]]></BankName>`
          xml += `<BankNumber><![CDATA[]]></BankNumber>`
          xml += `<Email><![CDATA[]]></Email>`
          xml += `<Fax><![CDATA[]]></Fax>`
          xml += `<Phone><![CDATA[${i.dienthoai_lh}]]></Phone>`
          xml += `<ContactPerson><![CDATA[]]></ContactPerson>`
          xml += `<RepresentPerson><![CDATA[]]></RepresentPerson>`
          xml += `<CusType>1</CusType>`
          xml += `<MaThanhToan>${i.qrcode ? i.qrcode : this.getMaThanhToanHD(kyhoadon.month + kyhoadon.year, i.ma_tt, 2)}</MaThanhToan>`
          xml += `</Customer>\r\n`
        }
        xml += '</Customers>'
        resolve(xml)
      })
    },
    createHuyHoaDon(data, kyhoadon) {
      return new Promise((resolve, reject) => {
        let xml = `<Inv>\r\n`
        for (const i of data) {
          xml += `<key>${i.fkey}</key>\r\n`
        }
        xml += '</Inv>'
        resolve(xml)
      })
    },
    getMaThanhToanHD(kyhoadon, matt, type) {
      // console.log(kyhoadon, ma_tt, type)
      // Ver 1
      // string first = "0002010102112620970415010686973800115204123453037045802VN5910VIETINBANK6005HANOI6106100000";
      // Ver 2
      const first = '0002020102112620994814010686973800115204000153037045802VN5914VNPT VINAPHONE6005HANOI6106100000'
      const time = '0106' + kyhoadon
      const province = `0703${this.province}`
      // Portal = 1,
      // HDDT = 2,
      // HDGiay = 3,
      // AnPhamThuCuoc = 4, //(thông báo cước, biên lai, phiếu thu
      // AnPhamQLTT = 5 //bản kê thu cước
      const QRType = '0818' + '2'
      const details = type === 2 ? 'CUOC MANG DI DONG' : 'CUOC MANG CO DINH'
      const last = time + this.fixMaThanhToan(matt) + province + QRType + details
      const tagLength = `62${last.length}`
      return first + tagLength + last
      // "<MaThanhToan><![CDATA[0002010102112620970415010686973800115204123453037045802VN5909VIETINBANK6005HANOI6106100000626301060720170613  024357434690703BCN08172CUOC MANG CODINH]]></MaThanhToan>"
    },
    fixMaThanhToan(macq, preFixMain = '06', dfLenght = 13) {
      macq = macq.trim()
      const count = macq.length
      let preFixMaCQ = ''
      if (count < dfLenght) {
        for (let i = 0; i < dfLenght - count; i++) {
          preFixMaCQ = ' ' + preFixMaCQ
        }
      } else if (count > dfLenght) dfLenght = count

      return preFixMain + dfLenght + macq + preFixMaCQ
    },
    reset() {
      // const khd = this.params.kyhoadon.split('-')
      // this.billTime = khd[0] + khd[1] + khd[2]
      // this.kindOfService = khd[1] + '/' + khd[0]
      this.exportData.xmlHoadon = ''
      this.exportData.xmlKhachHang = ''
      this.exportData.zipNameHoadon = `hoadon_`
      this.exportData.zipNameKhachHang = `khachhang_`
    }
  }
}
</script>

<style>
</style>
