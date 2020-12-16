<template>
  <div class="mod-kfkbtjjg-rcjl">
  <el-dialog
    :title="'详细信息'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">

      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="40">
      </el-table-column>

      <el-table-column label="序号" type="index" show-overflow-tooltip width="50">
      </el-table-column>

      <el-table-column
        prop="bjxx"
        header-align="center"
        align="center"
        label="表（接口）信息">
      </el-table-column>

    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-dialog>

  </div>
</template>

<script>
  import { formatDate } from '@/utils/validate'
  export default {
    data () {
      /*var validateDate = (rule, value, callback) => {
        if (!formatDate(value)) {
          callback(new Error('时间格式错误'))
        } else {
          callback()
        }
      }*/
      return {
        visible: false,
        dataForm: {
          id: 0,
          sj: '',
          yjxtgn: '',
          erjxtgn: '',
          sjxtgn: '',
          bjxx: '',
          lx: 1,
          url: ''
        },
        dataList: [],
        permission:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        permission:[]
      }
    },
    activated () {
      this.getDataList()
    },
    mounted(){
      this.getPermission()
    },
    methods: {
      init (id,yjxtgn,url,lx) {
        this.visible = true
        this.$nextTick(() => {
          /*alert(yjxtgn)*/
//          this.$refs['dataForm'].resetFields()
          /*this.dataForm.id = id
          this.dataForm.bjxx = bjxx*/
          this.dataForm.yjxtgn = yjxtgn
          this.dataForm.url = url
          this.dataForm.lx = lx
          this.getDataList()
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/kfkbtjjg/xtjrgljk/fenye'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'lx': this.dataForm.lx,
            'yjxtgn': this.dataForm.yjxtgn
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.dataList = data.data.list
            this.totalPage = data.data.total
            this.dataListLoading = false

          }else{
            console.log('ERROR',data)
            this.$message.error("操作失败")
          }
        })
      },

      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 页码变更
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      }


    }
  }
</script>
