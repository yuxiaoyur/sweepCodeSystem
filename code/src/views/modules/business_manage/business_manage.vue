<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.project" placeholder="板块名称" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.firstModule" placeholder="一级模块" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.dataApiUrl" placeholder="数据接口" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.gisApiUrl" placeholder="地图接口" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.javaMethod" placeholder="后台方法" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.dbTable" placeholder="库表" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle(dataForm.id,'add')">新增
          </el-button>
        </el-form-item>
      </el-row>
      <el-collapse v-model="dataForm.activeCollapse">
        <el-collapse-item  name="1">
          <template slot="title">
            更多筛选条件<i class="header-icon el-icon-search"></i>
          </template>

          <el-row>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="dataForm.secondModule" placeholder="二级模块" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-form-item>
                <el-input v-model="dataForm.thirdModule" placeholder="三级模块" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-form-item>
                <el-input v-model="dataForm.fourthModule" placeholder="四级模块" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-form-item>
                <el-input v-model="dataForm.fifthModule" placeholder="五级模块" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="dataForm.sixthModule" placeholder="六级模块" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="dataForm.frontStaff" placeholder="前端人员" clearable></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="13">
              <el-form-item label="前端更新时间">
                <el-date-picker
                  style="width: 100%"
                  v-model="dataForm.frontUpdateTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  class="fixElDatePicker"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="dataForm.backStaff" placeholder="后端人员" clearable></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="13">
              <el-form-item label="后端更新时间">
                <el-date-picker
                  style="width: 100%"
                  v-model="dataForm.backUpdateTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="dataForm.designStaff" placeholder="设计人员" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-form-item label="设计更新时间">
              <el-date-picker
                style="width: 100%"
                v-model="dataForm.designUpdateTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>


            <!--      <el-row>-->
            <!--        <el-form-item>-->
            <!--          <el-input v-model="dataForm.createBy" placeholder="记录创建者" clearable></el-input>-->
            <!--        </el-form-item>-->
            <!--        <el-form-item label="创建更新时间">-->
            <!--          <el-date-picker-->
            <!--            v-model="dataForm.createDate"-->
            <!--            type="daterange"-->
            <!--            range-separator="至"-->
            <!--            start-placeholder="开始日期"-->
            <!--            end-placeholder="结束日期"-->
            <!--            :default-time="['00:00:00', '23:59:59']">-->
            <!--          </el-date-picker>-->
            <!--        </el-form-item>-->
            <!--      </el-row>-->


          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <br/><br/>
    <el-table
      :data="dataList"
      border
      stripe
      highlight-current-row
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      height="500"
      max-height="500"
      style="width: 100%;"
    >

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="前端信息">
            </el-form-item>
            <hr style=" height:2px;border:none;border-top:1px solid lightgrey;"/>
            <el-form-item label="前端人员">
              <span>{{ props.row.frontStaff }}</span>
            </el-form-item>
            <el-form-item label="前端更新时间">
              <span>{{ props.row.frontUpdateTime }}</span>
            </el-form-item>
            <el-form-item label="数据接口">
              <span>{{ props.row.dataApiUrl }}</span>
            </el-form-item>
            <el-form-item label="数据接口类型">
              <span v-if="props.row.dataApiUrlType === '1'">数据接口</span>
              <span v-else-if="props.row.dataApiUrlType === '2'">Http接口</span>
              <span v-else>数据未录入</span>
            </el-form-item>
            <el-form-item label="地图接口">
              <span>{{ props.row.gisApiUrl }}</span>
            </el-form-item>
            <el-form-item label="前端备注">
              <span>{{props.row.frontComment}}</span>
            </el-form-item>
            <el-form-item style="width: 100%; margin-bottom: -20px">
              &nbsp;
            </el-form-item>

            <el-form-item label="后端信息">
            </el-form-item>
            <hr style=" height:2px;border:none;border-top:1px solid lightgrey;"/>

            <el-form-item label="后端人员">
              <span>{{ props.row.backStaff }}</span>
            </el-form-item>
            <el-form-item label="后端更新时间">
              <span>{{ props.row.backUpdateTime }}</span>
            </el-form-item>
            <el-form-item label="后台方法">
              <span>{{ props.row.javaMethod }}</span>
            </el-form-item>
            <el-form-item label="数据库表">
              <span>{{ props.row.dbTable }}</span>
            </el-form-item>
            <el-form-item label="后端备注">
              <span>{{ props.row.backComment }}</span>
            </el-form-item>
            <el-form-item style="width: 100%;margin-bottom: -20px">
              &nbsp;
            </el-form-item>

            <el-form-item label="设计信息">
            </el-form-item>
            <hr style=" height:2px;border:none;border-top:1px solid lightgrey;"/>

            <el-form-item label="设计人员">
              <span>{{ props.row.designStaff }}</span>
            </el-form-item>
            <el-form-item label="设计更新时间">
              <span>{{ props.row.designUpdateTime }}</span>
            </el-form-item>
            <el-form-item label="行业">
              <span>{{ props.row.industryName }}</span>
            </el-form-item>
            <el-form-item label="所属部门">
              <span>{{ props.row.officeName }}</span>
            </el-form-item>
            <el-form-item label="业务描述">
              <span>{{ props.row.businessDescription }}</span>
            </el-form-item>
            <el-form-item label="设计备注">
              <span>{{ props.row.designComment }}</span>
            </el-form-item>
            <el-form-item style="width: 100%;margin-bottom: -20px">
              &nbsp;
            </el-form-item>

            <el-form-item label="元数据">
            </el-form-item>
            <hr style=" height:2px;border:none;border-top:1px solid lightgrey;"/>
            <el-form-item label="记录创建时间">
              <span>{{ props.row.createDate }}</span>
            </el-form-item>
            <el-form-item label="记录创建者">
              <span>{{ props.row.createBy }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>


      <el-table-column
        prop="project"
        header-align="center"
        align="center"
        label="项目"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="firstModule"
        header-align="center"
        align="center"
        sortable
        label="一级模块">
      </el-table-column>
      <el-table-column
        prop="secondModule"
        header-align="center"
        align="center"
        sortable
        label="二级模块">
      </el-table-column>
      <el-table-column
        prop="thirdModule"
        header-align="center"
        align="center"
        sortable
        label="三级模块">
      </el-table-column>
      <el-table-column
        prop="fourthModule"
        header-align="center"
        align="center"
        sortable
        label="四级模块">
      </el-table-column>
      <el-table-column
        prop="fifthModule"
        header-align="center"
        align="center"
        sortable
        label="五级模块">
      </el-table-column>
      <el-table-column
        prop="sixthModule"
        header-align="center"
        align="center"
        sortable
        label="六级模块">
      </el-table-column>

      <!--      如果不需要全部显示在一行列表中，恢复以下代码, 代码在在最下方-->
      <!--      here-->
      <!--      <el-table-column-->
      <!--        prop="dataApiUrl"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="数据接口">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="dataApiType"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="数据接口类型">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="gisApiUrl"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="地图接口">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="javaMethod"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="后台方法">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="dbTable"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="数据库表">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="office"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="归管部门">-->
      <!--      </el-table-column>-->

      <!--      <el-table-column-->
      <!--        prop="industry"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="行业">-->
      <!--      </el-table-column>-->

      <!--      <el-table-column-->
      <!--        prop="businessComment"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="业务描述">-->
      <!--      </el-table-column>-->


      <!--      <el-table-column-->
      <!--        prop="frontStaff"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="前端人员">-->
      <!--      </el-table-column>-->

      <!--      <el-table-column-->
      <!--        prop="frontComment"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="前端备注">-->
      <!--      </el-table-column>-->

      <!--      <el-table-column-->
      <!--        prop="frontUpdateTime"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="前端更新时间">-->
      <!--      </el-table-column>-->

      <!--      <el-table-column-->
      <!--        prop="backStaff"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="后端人员">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="backStaffComment"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="后端备注">-->
      <!--      </el-table-column>-->


      <!--      <el-table-column-->
      <!--        prop="backStaffUpdate"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="后端更新时间">-->
      <!--      </el-table-column>-->


      <!--      <el-table-column-->
      <!--        prop="designStaff"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="设计人员">-->
      <!--      </el-table-column>-->

      <!--      <el-table-column-->
      <!--        prop="designComment"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="设计备注">-->
      <!--      </el-table-column>-->


      <!--      <el-table-column-->
      <!--        prop="designUpdateTime"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="设计更新时间">-->
      <!--      </el-table-column>-->


      <!--      <el-table-column-->
      <!--        prop="createDate"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="记录创建时间">-->
      <!--      </el-table-column>-->


      <!--      <el-table-column-->
      <!--        prop="createBy"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="150"-->
      <!--        sortable-->
      <!--        label="记录创建者">-->
      <!--      </el-table-column>-->

      <el-table-column
        header-align="center"
        align="center"
        width="120"
        label="操作"
        fixed="right">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id,'update')">修改
          </el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除
          </el-button>
        </template>
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

    <!-- 弹窗, 新增 / 修改-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<style>
  .fixElDatePicker {
    align-content: center;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
  import AddOrUpdateBusiness from './business_add_or_update.vue'

  export default {
    data () {
      return {
        dataForm: {
          id: '',
          userName: '',
          project: '',
          firstModule: '',
          secondModule: '',
          thirdModule: '',
          fourthModule: '',
          fifthModule: '',
          sixthModule: '',
          dataApiUrl: '',
          dataApiUrlType: '',
          gisApiUrl: '',
          javaMethod: '',
          dbTable: '',
          dbTableComment: '',
          office: '',
          industry: '',
          industryName: '',
          businessDescription: '',
          frontStaff: '',
          frontComment: '',
          frontUpdateTime: '',
          backStaff: '',
          backComment: '',
          backUpdateTime: '',
          designStaff: '',
          designComment: '',
          designUpdateTime: '',
          createDate: '',
          createBy: '',
          activeCollapse: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        permission: [],
        permissionVisible: {
          add: false,
          update: false,
          delete: false
        },
        addOrUpdateVisible: false
      }
    },
    computed: {
      beginFrontUpdateTime: function () {
        return this.checkOrReturnDefault(this.dataForm.frontUpdateTime, 0, '1999-01-01')
      },
      endFrontUpdateTime: function () {
        return this.checkOrReturnDefault(this.dataForm.frontUpdateTime, 1, '2022-01-01')
      },
      beginBackUpdateTime: function () {
        return this.checkOrReturnDefault(this.dataForm.backUpdateTime, 0, '1999-01-01')
      },
      endBackUpdateTime: function () {
        return this.checkOrReturnDefault(this.dataForm.backUpdateTime, 1, '2022-01-01')
      },
      beginDesignUpdateTime: function () {
        return this.checkOrReturnDefault(this.dataForm.designUpdateTime, 0, '1999-01-01')
      },
      endDesignUpdateTime: function () {
        return this.checkOrReturnDefault(this.dataForm.designUpdateTime, 1, '2022-01-01')
      },
      beginCreateDate: function () {
        return this.checkOrReturnDefault(this.dataForm.createDate, 0, '1999-01-01')
      },
      endCreateDate: function () {
        return this.checkOrReturnDefault(this.dataForm.createDate, 1, '2022-01-01')
      }
    },
    components: {
      addOrUpdate: AddOrUpdateBusiness
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
    },
    methods: {
      // 取得权限
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
      // 判断权限
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/business_manage/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'doneUser': this.dataForm.doneUser,
            // 在此处添加查询所需参数
            'project': this.dataForm.project,
            'firstModule': this.dataForm.firstModule,
            'secondModule': this.dataForm.secondModule,
            'thirdModule': this.dataForm.thirdModule,
            'fourthModule': this.dataForm.fourthModule,
            'fifthModule': this.dataForm.fifthModule,
            'sixthModule': this.dataForm.sixthModule,
            'dataApiUrl': this.dataForm.dataApiUrl,
            'dataApiUrlType': this.dataForm.dataApiUrlType,
            'gisApiUrl': this.dataForm.gisApiUrl,
            'javaMethod': this.dataForm.javaMethod,
            'dbTable': this.dataForm.dbTable,
            'office': this.dataForm.office,
            'industry': this.dataForm.industry,
            'frontStaff': this.dataForm.frontStaff,
            'beginFrontUpdateTime': this.beginFrontUpdateTime,
            'endFrontUpdateTime': this.endFrontUpdateTime,
            'beginBackUpdateTime': this.beginBackUpdateTime,
            'endBackUpdateTime': this.endBackUpdateTime,
            'beginDesignUpdateTime': this.beginDesignUpdateTime,
            'endDesignUpdateTime': this.endDesignUpdateTime,
            'beginCreateDate': this.beginCreateDate,
            'endCreateDate': this.endCreateDate,
            'backStaff': this.dataForm.backStaff,
            'designStaff': this.dataForm.designStaff,
            'createBy': this.dataForm.createBy
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

      // 添加或修改
      addOrUpdateHandle (id, subType) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initializing(id, subType)
          this.$refs.addOrUpdate.initIndustryTreeSelect()
          this.$refs.addOrUpdate.initOfficeTreeSelect()
          this.$refs.addOrUpdate.getDetailWritePermission()
        })
      },
      // 删除
      deleteHandle (id) {
        var Ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if (Ids == null || Ids === '') {
          this.$message.error('请选择要删除的数据')
          return
        }
        this.$confirm(`确定进行[${Ids ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business_manage/deleteRecord'),
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
        }).catch(() => {
        })
      },
      // 检查是否为时间字符串数组，如果是开始时间或结束时间，0是开始，1是结束
      checkOrReturnDefault (oriDate, index, defaultDateStr) {
        if (!(oriDate === null) && oriDate instanceof Array && oriDate.length > 1) {
          return this.formatDate(oriDate[index], 'yyyy-MM-dd HH:mm:ss')
        } else {
          return this.formatDate(defaultDateStr, 'yyyy-MM-dd HH:mm:ss')
        }
      },
      // 修改日期格式
      formatDate (time, format) {
        var t = new Date(time)
        var tf = function (i) {
          return (i < 10 ? '0' : '') + i
        }
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
          switch (a) {
            case 'yyyy':
              return tf(t.getFullYear())
              break
            case 'MM':
              return tf(t.getMonth() + 1)
              break
            case 'mm':
              return tf(t.getMinutes())
              break
            case 'dd':
              return tf(t.getDate())
              break
            case 'HH':
              return tf(t.getHours())
              break
            case 'ss':
              return tf(t.getSeconds())
              break
          }
        })
      }
    }
  }
</script>
