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
        <div class="col-sm-12 col-md-7 q-mb-md">
          <div class="text-subtitle2 text-teal">Thông tin dữ liệu</div>
          <!-- <q-input v-model.trim="dsMaTT" :dense="$store.state.app.dense.input" autogrow
            label="Mã thanh toán cần tạo nếu có" /> -->
          <q-input v-model.trim="table" :dense="$store.state.app.dense.input" v-uppercase
            label="Bảng dữ liệu HĐĐT" hint="ví dụ: BCSS_BKN.HDDT_20200101"
            :rules="[v=>!!v||$t('error.required')]" />
          <q-input v-model.trim="dsMaTT" type="textarea" label="Mã thanh toán cần tạo nếu có"
            rows="3" />
        </div>
        <q-space />
        <div class="col-sm-12 col-md-4">
          <div class="row">
            <div class="col-5">
              <!-- <q-btn type="submit" color="blue" icon="sync" :loading="loading" dense
              :disable="loading" @click.prevent="onSubmit()">
              <q-tooltip v-if="!$q.platform.is.mobile">Lấy dữ liệu</q-tooltip>
            </q-btn> -->
              <q-chip clickable @click.prevent="onSubmit" color="primary" text-color="white"
                :loading="loading" icon="event">
                Lấy dữ liệu
              </q-chip>
            </div>
            <div v-if="exportData.data.length" class="col-7 q-mb-lg">
              <div class="text-right">
                <q-btn type="submit" color="orange" icon="layers" dense :loading="loading" flat
                  :disable="loading" @click.prevent="onGetXML('create')">
                  <q-tooltip v-if="!$q.platform.is.mobile">Tạo hóa đơn</q-tooltip>
                </q-btn>
                <q-btn type="submit" color="red" icon="layers_clear" dense :loading="loading" flat
                  :disable="loading" @click.prevent="onGetXML('remove')">
                  <q-tooltip v-if="!$q.platform.is.mobile">Tạo hủy hóa đơn</q-tooltip>
                </q-btn>
                <q-btn type="submit" color="indigo" icon="view_array" dense :loading="loading" flat
                  :disable="loading" @click.prevent="onGetXML('adjust')">
                  <q-tooltip v-if="!$q.platform.is.mobile">Tạo hóa đơn điều chỉnh</q-tooltip>
                </q-btn>
                <q-btn type="submit" color="teal" icon="vertical_split" dense :loading="loading"
                  flat :disable="loading" @click.prevent="onGetXML('replace')">
                  <q-tooltip v-if="!$q.platform.is.mobile">Tạo hóa đơn thay thế</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
          <q-separator class="q-mb-sm q-mt-sm" />
          <div class="text-subtitle2 text-indigo">Kết xuất dữ liệu</div>
          <q-spinner-dots v-if="loadingXML" color="primary" size="2em" />
          <div v-if="exportData.xmlKhachHang && !loadingXML"
            class="el-col el-col-6 el-xs-24 el-sm-24">
            <label>Khách hàng: </label>
            <tm-export-data :data="exportData.xmlKhachHang" :items="[
                { title: 'Export .xml', type: 'xml' },
                { title: 'Export .zip', type: 'zip-xml' }
              ]" :filename="exportData.fileNameKhachHang" :zipname="exportData.zipNameKhachHang" />
          </div>
          <div v-if="exportData.xmlHoadon && !loadingXML" class="el-col el-col-6 el-xs-24 el-sm-24">
            <label>Hóa đơn: </label>
            <tm-export-data :data="exportData.xmlHoadon" :items="[
                { title: 'Export .xml', type: 'xml' },
                { title: 'Export .zip', type: 'zip-xml' }
              ]" :filename="exportData.fileNameHoadon" :zipname="exportData.zipNameHoadon" />
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
import * as api from '@/api/hddt';
import tmExportData from '@/components/tm-export-data';
export default {
  components: { tmExportData },
  data() {
    return {
      tables: [],
      loading: false,
      loadingXML: false,
      billTime: '',
      kindOfService: '',
      dsMaTT: '',
      table: 'BCSS_BKN.HDDT_20200101',
      province: process.env.PROVINCE, // 'BKN', // CBG
      exportData: {
        data: [],
        kyhoadon: {},
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
    };
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
    onSubmit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.reset();
          this.loading = true;
          api.getData({ table: this.table, ma_tt: this.dsMaTT ? this.dsMaTT.split('\n') : [] }).then(async rs => {
            this.exportData.data = rs.data
            this.exportData.khd = rs.khd
            this.exportData.zipNameHoadon = this.exportData.zipNameHoadon + rs.khd;
            this.exportData.zipNameKhachHang = this.exportData.zipNameKhachHang + rs.khd;
            this.exportData.kyhoadon = { year: rs.khd.toString().substr(0, 4), month: rs.khd.toString().substr(4, 2), day: rs.khd.toString().substr(6, 2) };
          }).finally(() => { this.loading = false; });
        }
      });
    },
    async onGetXML(type) {
      this.loadingXML = true
      if (type === 'create') {
        this.exportData.xmlHoadon = await this.createBill(this.exportData.data, this.exportData.kyhoadon);
        this.exportData.xmlKhachHang = await this.createCustomer(this.exportData.data, this.exportData.kyhoadon);
      } else if (type === 'remove') {
        this.exportData.xmlHoadon = await this.createRemove(this.exportData.data, this.exportData.kyhoadon);
        this.exportData.xmlKhachHang = await this.createCustomer(this.exportData.data, this.exportData.kyhoadon);
      } else if (type === 'adjust') {
        this.exportData.xmlHoadon = await this.createAdjust(this.exportData.data, this.exportData.kyhoadon);
        this.exportData.xmlKhachHang = await this.createCustomer(this.exportData.data, this.exportData.kyhoadon);
      } else if (type === 'replace') {
        this.exportData.xmlHoadon = await this.createReplace(this.exportData.data, this.exportData.kyhoadon);
        this.exportData.xmlKhachHang = await this.createCustomer(this.exportData.data, this.exportData.kyhoadon);
      }
      setTimeout(() => {
        this.loadingXML = false
      }, 300);
    },
    createBill(data, kyhoadon) {
      // const KindOfService =
      return new Promise((resolve, reject) => {
        let xml = `<Invoices><BillTime>${kyhoadon.year + kyhoadon.month + kyhoadon.day}</BillTime>\r\n`;
        for (const i of data) {
          xml += `<Inv>`;
          xml += `<key>${i.fkey}</key>`;
          xml += `<Invoice>`;
          xml += `<CusCode>${i.ma_tt || ''}</CusCode>`;
          xml += `<CusName><![CDATA[${i.ten_tt || ''}]]></CusName>`;
          xml += `<CusAddress><![CDATA[${i.diachi_tt || ''}]]></CusAddress>`;
          xml += `<CusPhone>${i.dienthoai_lh || ''}</CusPhone>`;
          xml += `<CusTaxCode>${i.ms_thue || ''}</CusTaxCode>`;
          xml += `<PaymentMethod>TM/CK</PaymentMethod>`;
          xml += `<KindOfService>${kyhoadon.month}/${kyhoadon.year}</KindOfService>`;
          // xml += `<ResourceCode>${i.manv_tc || ''}</ResourceCode>`;
          xml += this.getProducts(i)
          xml += `<Extra><![CDATA[${i.cantru};${i.tong_pt};${i.tuyenthu || ''}]]></Extra>`;
          xml += `<MaThanhToan>${i.qrcode ? i.qrcode : this.getMaThanhToanHD(kyhoadon.month + kyhoadon.year, i.ma_tt, 2)}</MaThanhToan>`;
          xml += `<Total>${i.tien}</Total>`;
          xml += `<DiscountAmount></DiscountAmount>`;
          xml += `<VATRate>10</VATRate>`;
          xml += `<VATAmount>${i.vat}</VATAmount>`;
          xml += `<Amount>${i.tong}</Amount>`;
          xml += `<AmountInWords>${i.tong_chu || ''}</AmountInWords>`;
          xml += `<PaymentStatus>0</PaymentStatus>`;
          xml += `</Invoice>`;
          xml += `</Inv>\r\n`;
        }
        xml += '</Invoices>';
        resolve(xml);
      });
    },
    createRemove(data, kyhoadon) {
      return new Promise((resolve, reject) => {
        let xml = `<Inv>\r\n`;
        for (const i of data) {
          xml += `<key>${i.fkey}</key>\r\n`;
        }
        xml += '</Inv>';
        resolve(xml);
      });
    },
    createAdjust(data, kyhoadon) {
      return new Promise((resolve, reject) => {
        let xml = `<AdjustInvs>\r\n`;
        for (const i of data) {
          xml += '<AdjustInv>'
          xml += `<oldkey>${i.fkey}</oldkey>`
          // xml += '<key></key>' // Khóa của hóa đơn mới (nếu không có bỏ cả thẻ <key></key> đi)
          xml += `<Type>${i.type || 2}</Type>` // Loại hóa đơn điều chỉnh (mặc định lấy là 2)  2-Điều chỉnh tăng, 3-Điều chỉnh giảm, 4- Hóa đơn điều chỉnh thông tin
          xml += `<CusCode>${i.ma_tt || ''}</CusCode>`
          xml += `<CusName><![CDATA[${i.ten_tt || ''}]]></CusName>`;
          xml += `<CusAddress><![CDATA[${i.diachi_tt || ''}]]></CusAddress>`;
          xml += `<CusPhone>${i.dienthoai_lh || ''}</CusPhone>`;
          xml += `<CusTaxCode>${i.ms_thue || ''}</CusTaxCode>`;
          xml += `<PaymentMethod>TM/CK</PaymentMethod>`;
          xml += `<KindOfService>${kyhoadon.month}/${kyhoadon.year}</KindOfService>`;
          xml += this.getProducts(i)
          xml += `<Total>${i.tien}</Total>`;
          xml += `<DiscountAmount></DiscountAmount>`;
          xml += `<VATRate>10</VATRate>`;
          xml += `<VATAmount>${i.vat}</VATAmount>`;
          xml += `<Amount>${i.tong}</Amount>`;
          xml += `<AmountInWords>${i.tong_chu || ''}</AmountInWords>`;
          xml += `<Teller>admin</Teller>` // Mã giao dịch viên
          xml += '</AdjustInv>\r\n';
        }
        xml += '</AdjustInvs>';
        resolve(xml);
      });
    },
    createReplace(data, kyhoadon) {
      return new Promise((resolve, reject) => {
        let xml = `<ReplaceInvs>\r\n`;
        for (const i of data) {
          xml += '<ReplaceInv>'
          xml += `<oldkey>${i.fkey}</oldkey>`
          // xml += '<key></key>' // Khóa của hóa đơn mới (nếu không có bỏ cả thẻ <key></key> đi)
          xml += `<CusCode>${i.ma_tt}</CusCode>`
          xml += `<CusName><![CDATA[${i.ten_tt}]]></CusName>`;
          xml += `<CusAddress><![CDATA[${i.diachi_tt || ''}]]></CusAddress>`;
          xml += `<CusPhone>${i.dienthoai_lh || ''}</CusPhone>`;
          xml += `<CusTaxCode>${i.ms_thue || ''}</CusTaxCode>`;
          xml += `<PaymentMethod>TM/CK</PaymentMethod>`;
          xml += `<KindOfService>${kyhoadon.month}/${kyhoadon.year}</KindOfService>`;
          xml += this.getProducts(i)
          xml += `<Total>${i.tien}</Total>`;
          xml += `<DiscountAmount></DiscountAmount>`;
          xml += `<VATRate>10</VATRate>`;
          xml += `<VATAmount>${i.vat}</VATAmount>`;
          xml += `<Amount>${i.tong}</Amount>`;
          xml += `<AmountInWords>${i.tong_chu || ''}</AmountInWords>`;
          xml += `<Teller>admin</Teller>` // Mã giao dịch viên
          xml += '</ReplaceInv>\r\n';
        }
        xml += '</ReplaceInvs>';
        resolve(xml);
      });
    },
    createCustomer(data, kyhoadon) {
      return new Promise((resolve, reject) => {
        let xml = '<Customers>\r\n';
        for (const i of data) {
          xml += `<Customer>`;
          xml += `<Name><![CDATA[${i.ten_tt || ''}]]></Name>`;
          xml += `<Code>${i.ma_tt || ''}</Code>`;
          xml += `<TaxCode><![CDATA[${i.ms_thue || ''}]]></TaxCode>`;
          xml += `<Address><![CDATA[${i.diachi_tt || ''}]]></Address>`;
          xml += `<BankAccountName><![CDATA[]]></BankAccountName>`;
          xml += `<BankName><![CDATA[]]></BankName>`;
          xml += `<BankNumber><![CDATA[]]></BankNumber>`;
          xml += `<Email><![CDATA[]]></Email>`;
          xml += `<Fax><![CDATA[]]></Fax>`;
          xml += `<Phone><![CDATA[${i.dienthoai_lh || ''}]]></Phone>`;
          xml += `<ContactPerson><![CDATA[]]></ContactPerson>`;
          xml += `<RepresentPerson><![CDATA[]]></RepresentPerson>`;
          xml += `<CusType>1</CusType>`;
          xml += `<MaThanhToan>${i.qrcode ? i.qrcode : this.getMaThanhToanHD(kyhoadon.month + kyhoadon.year, i.ma_tt, 2)}</MaThanhToan>`;
          xml += `</Customer>\r\n`;
        }
        xml += '</Customers>';
        resolve(xml);
      });
    },
    getProducts(i) {
      let xml = ''
      xml += `<Products>`;
      xml += `<Product>`;
      xml += `<ProdName><![CDATA[Cước dịch vụ viễn thông]]></ProdName>`; // : ${kyhoadon.month + '/' + kyhoadon.year}
      xml += `<ProdUnit></ProdUnit>`;
      xml += `<ProdQuantity></ProdQuantity>`;
      xml += `<ProdPrice></ProdPrice>`;
      xml += `<Amount>${i.cuoc_cthue}</Amount>`;
      xml += `</Product>`;
      xml += `<Product>`;
      xml += `<ProdName><![CDATA[Cước dịch vụ Viễn thông không thuế]]></ProdName>`;
      xml += `<ProdUnit></ProdUnit>`;
      xml += `<ProdQuantity></ProdQuantity>`;
      xml += `<ProdPrice></ProdPrice>`;
      xml += `<Amount>${i.cuoc_kthue}</Amount>`;
      xml += `</Product>`;
      xml += `<Product>`;
      xml += `<ProdName><![CDATA[Chiết khấu + đa dịch vụ]]></ProdName>`;
      xml += `<ProdUnit></ProdUnit>`;
      xml += `<ProdQuantity></ProdQuantity>`;
      xml += `<ProdPrice></ProdPrice>`;
      xml += `<Amount>0</Amount>`;
      xml += `</Product>`;
      xml += `<Product>`;
      xml += `<ProdName><![CDATA[Khuyến mại]]></ProdName>`;
      xml += `<ProdUnit></ProdUnit>`;
      xml += `<ProdQuantity></ProdQuantity>`;
      xml += `<ProdPrice></ProdPrice>`;
      xml += `<Amount>${i.tien_km}</Amount>`;
      xml += `</Product>`;
      xml += `<Product>`;
      xml += `<ProdName><![CDATA[Cước phí thu tại nhà]]></ProdName>`;
      xml += `<ProdUnit></ProdUnit>`;
      xml += `<ProdQuantity></ProdQuantity>`;
      xml += `<ProdPrice></ProdPrice>`;
      xml += `<Amount>${i.phuthu_hd}</Amount>`;
      xml += `</Product>`;
      xml += `</Products>`;
      return xml
    },
    getMaThanhToanHD(kyhoadon, matt, type) {
      // console.log(kyhoadon, ma_tt, type)
      // Ver 1
      // string first = "0002010102112620970415010686973800115204123453037045802VN5910VIETINBANK6005HANOI6106100000";
      // Ver 2
      const first =
        '0002020102112620994814010686973800115204000153037045802VN5914VNPT VINAPHONE6005HANOI6106100000';
      const time = '0106' + kyhoadon;
      const province = `0703${this.province}`;
      // Portal = 1,
      // HDDT = 2,
      // HDGiay = 3,
      // AnPhamThuCuoc = 4, //(thông báo cước, biên lai, phiếu thu
      // AnPhamQLTT = 5 //bản kê thu cước
      const QRType = '0818' + '2';
      const details = type === 2 ? 'CUOC MANG DI DONG' : 'CUOC MANG CO DINH';
      const last =
        time + this.fixMaThanhToan(matt) + province + QRType + details;
      const tagLength = `62${last.length}`;
      return first + tagLength + last;
      // "<MaThanhToan><![CDATA[0002010102112620970415010686973800115204123453037045802VN5909VIETINBANK6005HANOI6106100000626301060720170613  024357434690703BCN08172CUOC MANG CODINH]]></MaThanhToan>"
    },
    fixMaThanhToan(macq, preFixMain = '06', dfLenght = 13) {
      macq = macq.trim();
      const count = macq.length;
      let preFixMaCQ = '';
      if (count < dfLenght) {
        for (let i = 0; i < dfLenght - count; i++) {
          preFixMaCQ = ' ' + preFixMaCQ;
        }
      } else if (count > dfLenght) dfLenght = count;

      return preFixMain + dfLenght + macq + preFixMaCQ;
    },
    reset() {
      // const khd = this.params.kyhoadon.split('-')
      // this.billTime = khd[0] + khd[1] + khd[2]
      // this.kindOfService = khd[1] + '/' + khd[0]
      this.exportData = {
        data: [],
        kyhoadon: {},
        xmlHoadon: '',
        xmlKhachHang: '',
        fileNameHoadon: 'hoadon',
        fileNameKhachHang: 'cus',
        zipNameHoadon: `hoadon_`,
        zipNameKhachHang: `khachhang_`
      }
    }
  }
};
</script>

<style>
</style>
