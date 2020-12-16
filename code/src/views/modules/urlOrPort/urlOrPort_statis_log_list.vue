<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-select v-model="dataForm.typeName" @change="selectTypeChange" placeholder="请选择链接类型" style="width:140px">
        <el-option v-for="item in selectTypeList" :key="item.typeId" :lable="item.typeId"
                   :value="item.typeName"></el-option>
      </el-select>
      <el-select v-model="dataForm.modulName" @change="selectModulChange" placeholder="请选择板块" style="width:140px">
        <el-option v-for="item in selectModul" :key="item.modulId" :lable="item.modulId"
                   :value="item.modulName"></el-option>
      </el-select>
      <el-select v-model="dataForm.codeName" @change="selectResponseCodeChange" placeholder="请选择状态" style="width:140px">
        <el-option v-for="item in selectResponseCode" :key="item.codeVal" :lable="item.codeVal"
                   :value="item.codeName"></el-option>
      </el-select>
      <el-form-item>
        <el-input v-model="dataForm.childModule" placeholder="请输入模块名称" clearable style="width:300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.url" placeholder="请输入URL地址" clearable style="width:300px"></el-input>
      </el-form-item><br/>
      <el-form-item label="巡检开始时间" prop="starttime">
        <date-picker id="starttime" v-model="dataForm.starttime" :picker-options="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></date-picker>
      </el-form-item>
      <el-form-item label="至" prop="endtime">
        <date-picker id="endtime" v-model="dataForm.endtime" :picker-options="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item><br/>
      <el-form-item>
        <el-input v-model="dataForm.pollFreCron" clearable readonly style="width:180px"></el-input>
      </el-form-item>
      <el-select v-model="dataForm.remark" @change="selectCronChange" placeholder="巡检频率" style="width:140px">
        <el-option v-for="item in selectCron" :key="item.id" :lable="item.id" :value="item.remark"></el-option>
      </el-select>
      <el-form-item>
        <el-button type="primary" @click="executeUrl()">频率更改
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pollLogToExcel()">导出Excel
        </el-button>
      </el-form-item>
      <el-form-item label="融合接口数：" style="padding-left: 35%;">
        <el-row  v-text="dataForm.portNum"></el-row>
      </el-form-item>
      <el-form-item label="web链接数：">
        <el-row  v-text="dataForm.webNum"></el-row>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :default-sort = "{prop: 'aveTime', order: 'descending'}"
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
        sortable
        width="120"
        label="板块">
      </el-table-column>
      <el-table-column
        prop="childModule"
        header-align="center"
        align="center"
        sortable
        label="模块">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="urlType"
        header-align="center"
        align="center"
        sortable
        width="80"
        label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.urlType == '1'">接口</span>
          <span v-if="scope.row.urlType == '3'">web链接</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="executeNum"
        header-align="center"
        align="center"
        width="80"
        label="执行次数">
      </el-table-column>
      <el-table-column
        prop="responseCode"
        header-align="center"
        align="center"
        sortable
        width="80"
        label="最近状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.responseCode == '200'" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pollTime"
        header-align="center"
        align="center"
        width="80"
        label="最近巡检时间">
      </el-table-column>
      <el-table-column
        prop="countTime"
        header-align="center"
        align="center"
        sortable
        width="80"
        label="总时长">
      </el-table-column>
      <el-table-column
        prop="aveTime"
        header-align="center"
        align="center"
        sortable
        width="80"
        label="平均时长">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="viewDetailsList(scope.row.modules,scope.row.childModule,
                     scope.row.url,scope.row.urlType)">详细日志
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
    <view-details-list v-if="viewDetailsListVisible" ref="viewDetailsList" @refreshDataList="getDataList"></view-details-list>
  </div>
</template>

<script>
  import ViewDetailsList from './urlOrPort_statis_log_detail_list.vue'
  import ElTag from '../../../../node_modules/element-ui/packages/tag/src/tag.vue'
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input.vue'
  import DatePickerPanel from '../../../../node_modules/iview/src/components/date-picker/panel/Date/date.vue'
  import moment from 'moment'
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    data () {
      return {
        dataForm: {
          typeId: '',
          typeName: '全部(链接类型)',
          modulId: '',
          modulName: '全部(板块)',
          codeVal: '',
          codeName: '全部(状态)',
          modules: '',
          childModule: '',
          url: '',
          urlType: '',
          executeNum: '',
          countTime: '',
          aveTime: '',
          pollFreCron: '',
          id: '',
          remark: '',
          timerInterval: '',
          starttime: '',
          endtime: '',
          portNum: 0,
          webNum: 0
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
        viewDetailsListVisible: false
      }
    },
    components: {
      ElRow,
      DatePickerPanel,
      ElInput,
      ElTag,
      viewDetailsList: ViewDetailsList
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
    },
    computed: {
      selectTypeList () {
        let obj = [
          {typeId: '', typeName: '全部(链接类型)'},
          {typeId: '1', typeName: '融合平台接口'},
          {typeId: '3', typeName: 'web链接'}
        ]
        return obj
      },
      selectModul () {
        let obj = [
          {modulId: '', modulName: '全部(板块)'}, {modulId: '首页', modulName: '首页'},
          {modulId: '经济调节', modulName: '经济调节'}, {modulId: '市场监管', modulName: '市场监管'},
          {modulId: '社会管理', modulName: '社会管理'}, {modulId: '公共服务', modulName: '公共服务'},
          {modulId: '环境保护', modulName: '环境保护'}, {modulId: '民生诉求', modulName: '民生诉求'}
        ]
        return obj
      },
      selectResponseCode () {
        let obj = [
          {codeVal: '', codeName: '全部(状态)'},
          {codeVal: '1', codeName: '正常' },
          {codeVal: '0', codeName: '异常'}
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
      selectTypeChange (val) {
        var obj = {}
        obj = this.selectTypeList.find(function (item) {
          return item.typeName == val
        })
        this.dataForm.typeId = obj.typeId
        this.dataForm.typeName = obj.typeName
      },
      selectModulChange (val) {
        var obj = {}
        obj = this.selectModul.find(function (item) {
          return item.modulName == val
        })
        this.dataForm.modules = obj.modulId
        this.dataForm.modulName = obj.modulName
      },
      selectResponseCodeChange (val) {
        var obj = {}
        obj = this.selectResponseCode.find(function (item) {
          return item.codeName == val
        })
        this.dataForm.codeVal = obj.codeVal
        this.dataForm.codeName = obj.codeName
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
            this.$message.error('巡检开始时间不可大于结束时间！')
            return
          }
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/statisUrlOrPortLog'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'urlType': this.dataForm.typeId,
            'modules': this.dataForm.modules,
            'urlState': this.dataForm.codeVal,
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
        this.pollFre()
        this.countPortAndWeb()
      },
      pollFre () {
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/queryOnCron'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.dataForm.pollFreCron = '当前巡检频率:' + data.remark
        })
      },
      viewDetailsList (modules, childModule, url, urlType) {
        this.viewDetailsListVisible = true
        this.$nextTick(() => {
          let sTime = ''
          let eTime = ''
          if (this.dataForm.starttime !== '') {
            sTime = moment(this.dataForm.starttime).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.dataForm.endtime !== '') {
            eTime = moment(this.dataForm.endtime).format('YYYY-MM-DD HH:mm:ss')
          }
          this.$refs.viewDetailsList.init(modules, childModule, url, urlType, sTime, eTime)
        })
      },
      countPortAndWeb () {
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/countPortAndWeb'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.dataForm.portNum = data.portNum
          this.dataForm.webNum = data.webNum
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
      executeUrl () {
        if (this.dataForm.id == '') {
          this.$message.error('请选择巡检频率！')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/updateCronStatus'),
          method: 'get',
          params: this.$http.adornParams({
            'id': this.dataForm.id
          })
        }).then(({data}) => {
          if (data.cronStatus) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
            this.pollFre()
          } else {
            this.$message.error('操作失败！')
          }
        })
      },
      pollLogToExcel () {
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
          url: this.$http.adornUrl('/urlOrPort/pollLogToExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'urlType': this.dataForm.typeId,
            'modules': this.dataForm.modules,
            'childModule': this.dataForm.childModule,
            'urlState': this.dataForm.codeVal,
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
