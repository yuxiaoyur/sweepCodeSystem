<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-select v-model="dataForm.modulName" @change="selectModulChange" placeholder="请选择板块" style="width:140px">
        <el-option v-for="item in selectModul" :key="item.modulId" :lable="item.modulId"
                   :value="item.modulName"></el-option>
      </el-select>
      <el-form-item>
        <el-input v-model="dataForm.childModule" placeholder="请输入模块名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.url" placeholder="请输入URL地址" clearable></el-input>
      </el-form-item>
      <el-form-item label=" 记录时间" prop="starttime">
        <date-picker id="starttime" v-model="dataForm.starttime" :picker-options="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></date-picker>
      </el-form-item>
      <el-form-item label="至" prop="endtime">
        <date-picker id="endtime" v-model="dataForm.endtime" :picker-options="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="errlogToExcel()">导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--复选框-->
      <!--<el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="40">
      </el-table-column>-->
      <el-table-column label="序号" type="index" show-overflow-tooltip width="50">
      </el-table-column>
      <el-table-column
        prop="modules"
        header-align="center"
        align="center"
        width="120"
        label="板块">
      </el-table-column>
      <el-table-column
        prop="childModule"
        header-align="center"
        align="center"
        label="模块">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="responseCode"
        header-align="center"
        align="center"
        width="60"
        label="状态">
      </el-table-column>
      <!--<el-table-column
        prop="errRespMessage"
        header-align="center"
        align="center"
        width="140"
        label="异常信息">
      </el-table-column>-->
      <el-table-column
        prop="responseTime"
        header-align="center"
        align="center"
        width="80"
        label="响应时长">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="140"
        label="记录时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="60"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="viewDetails(scope.row.id)">详细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100, 300]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 查看详细列表-->
    <view-details v-if="viewDetailsVisible" ref="viewDetails" @refreshDataList="getDataList"></view-details>
  </div>
</template>

<script>
  import ViewDetails from './port_err_log_detail.vue'
  import ElTag from '../../../../node_modules/element-ui/packages/tag/src/tag.vue'
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input.vue'
  import DatePickerPanel from '../../../../node_modules/iview/src/components/date-picker/panel/Date/date.vue'
  import moment from 'moment'

  export default {
    data () {
      return {
        dataForm: {
          modulId: '',
          modulName: '全部(板块)',
          modules: '',
          childModule: '',
          url: '',
          id: '',
          starttime: '',
          endtime: ''
        },
        /* start 开始时间小于今天,结束时间不能大于开始时间 */
        startTime: {
          disabledDate: time => {
            alert(this.endtime)
            let endDateVal = this.endtime
            if (endDateVal) {
              return (
                time.getTime() > new Date(endDateVal).getTime()
              )
            } else {
              return time.getTime() > Date.now()
            }
          }
        },
        endTime: {
          disabledDate: time => {
            let beginDateVal = this.dataForm.starttime
            if (beginDateVal) {
              return (
                time.getTime() > Date.now() ||
                time.getTime() < new Date(beginDateVal).getTime()
              )
            } else {
              return time.getTime() > Date.now()
            }
          }
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 300,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        permission: [],
        permissionVisible: {
          add: false,
          update: false,
          delete: false
        },
        viewDetailsVisible: false
      }
    },
    components: {
      DatePickerPanel,
      ElInput,
      ElTag,
      viewDetails: ViewDetails
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
    },
    computed: {
      selectModul () {
        let obj = [
          {modulId: '', modulName: '全部(板块)'}, {modulId: '首页', modulName: '首页'},
          {modulId: '经济调节', modulName: '经济调节'}, {modulId: '市场监管', modulName: '市场监管'},
          {modulId: '社会管理', modulName: '社会管理'}, {modulId: '公共服务', modulName: '公共服务'},
          {modulId: '环境保护', modulName: '环境保护'}, {modulId: '民生诉求', modulName: '民生诉求'}
        ]
        return obj
      },
      selectCron () {
        let obj = []
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/queryAllCron'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          for (var i = 0; i < data.length; i++) {
            obj.push({
              id: data[i].id,
              remark: data[i].remark
            })
          }
        })
        return obj
      }
    },
    methods: {
      selectModulChange (val) {
        var obj = {}
        obj = this.selectModul.find(function (item) {
          return item.modulName == val
        })
        this.dataForm.modules = obj.modulId
        this.dataForm.modulName = obj.modulName
      },
      selectCronChange (val) {
        var obj = {}
        obj = this.selectCron.find(function (item) {
          return item.remark == val
        })
        this.dataForm.id = obj.id
        this.dataForm.remark = obj.remark
      },
      getPermission () {
        this.$http({
          url: this.$http.adornUrl('/sys/menuPermission'),
          method: 'get',
          params: this.$http.adornParams({menuId: this.$route.meta.menuId})
        }).then(({data}) => {
          this.permission = data
          for (var i = 0; i < data.length; i++) {
            switch (data[i].split(':')[1]) {
              case 'add':
                this.permissionVisible.add = true
                break
              case 'update':
                this.permissionVisible.update = true
                break
              case 'delete':
                this.permissionVisible.delete = true
                break
              default:
                break
            }
          }
        })
      },
      hasPermission (param) {
        switch (param) {
          case 'add':
            return this.permissionVisible.add
          case 'update':
            return this.permissionVisible.update
          case 'delete':
            return this.permissionVisible.delete
          default:
            return false
        }
      },
      // 获取数据列表
      getDataList () {
        let sTime = ''
        let eTime = ''
        if (this.dataForm.starttime !== '') {
          sTime = moment(this.dataForm.starttime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (this.dataForm.endtime !== '') {
          eTime = moment(this.dataForm.endtime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (sTime !== '' && eTime !== '') {
          let oDate1 = new Date(sTime)
          let oDate2 = new Date(eTime)
          if (oDate1.getTime() > oDate2.getTime()) {
            this.$message.error('开始时间不可大于结束时间！')
            return
          }
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/queryErrLogList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'modules': this.dataForm.modules,
            'childModule': this.dataForm.childModule,
            'url': this.dataForm.url,
            'sTime': sTime,
            'eTime': eTime
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.dataList = data.data.list
            this.totalPage = data.data.total
            this.dataListLoading = false
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
          }
        })
      },
      viewDetails (id) {
        this.viewDetailsVisible = true
        this.$nextTick(() => {
          this.$refs.viewDetails.init(id)
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
      },
      errlogToExcel () {
        let sTime = ''
        let eTime = ''
        if (this.dataForm.starttime !== '') {
          sTime = moment(this.dataForm.starttime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (this.dataForm.endtime !== '') {
          eTime = moment(this.dataForm.endtime).format('YYYY-MM-DD HH:mm:ss')
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/errlogToExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'modules': this.dataForm.modules,
            'childModule': this.dataForm.childModule,
            'url': this.dataForm.url,
            'sTime': sTime,
            'eTime': eTime
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.dataListLoading = false
            window.location.href = data.data
            this.$message({
              message: data.message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            console.log('ERROR', data)
            this.$message.error(data.message)
          }
        })
      },
      // 删除
      deleteHandle (id) {
        var Ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if (Ids == null || Ids == '') {
          this.$message.error('请选择要删除的数据')
          return
        }
        this.$confirm(`确定进行[${Ids ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/link/removeLink'),
            method: 'post',
            params: this.$http.adornParams({id: Ids.join(',')}, false)
          }).then(({data}) => {
            if (data && data.successful) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
