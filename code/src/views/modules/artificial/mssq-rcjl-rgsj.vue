<template>
  <el-dialog
    title="关联工单列表"
    :close-on-click-modal="true"
    :visible.sync="visible"
    width="75%">
    <div class="mod-mssq-rcfx">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.gdh" placeholder="工单号" clearable></el-input>
      </el-form-item>    
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="100">
      </el-table-column>-->
      <el-table-column
        prop="rgsj"
        header-align="center"
        align="center"
        width="240"
        label="人工事件">
      </el-table-column>
      <el-table-column
        prop="dsjb_pkid"
        header-align="center"
        align="center"
        width="100"
        label="工单号">
      </el-table-column>
      <el-table-column
        prop="jd"
        header-align="center"
        align="center"
        width="160"
        label="经度">
      </el-table-column>
      <el-table-column
        prop="wd"
        header-align="center"
        align="center"
        width="160"
        label="纬度">
      </el-table-column>
      <el-table-column
        prop="dz"
        header-align="center"
        align="center"
        label="地址">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('update')" type="text" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './mssq-rcjl-rgsj-add-or-update'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          gdh: ''
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
    components: {
      addOrUpdate: AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
    },
    methods: {
      init (id) {
        this.dataForm.id = id
        this.visible = true
        this.getDataList()
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
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mssq/rgsj'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'id': this.dataForm.id,
            'gdh': this.dataForm.gdh
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
      },
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      }
    }
  }
</script>
