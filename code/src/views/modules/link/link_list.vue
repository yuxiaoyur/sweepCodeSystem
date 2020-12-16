<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.linkcode" placeholder="标识码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.yjpage" placeholder="一级页面名称关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.ejpage" placeholder="二级页面名称关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.sjpage" placeholder="三级页面名称关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.sysname" placeholder="所属系统名称关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.managername" placeholder="所属部门名称关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle(dataForm.id,'add')">新增
        </el-button>
        <el-button v-if="hasPermission('delete')" type="primary" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="40">
      </el-table-column>
      <el-table-column
        prop="createtime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="linkcode"
        header-align="center"
        align="center"
        label="标识码">
      </el-table-column>
      <el-table-column
        prop="linkurl"
        header-align="center"
        align="center"
        label="链接地址">
      </el-table-column>
      <el-table-column
        prop="usepage"
        header-align="center"
        align="center"
        label="链接使用处">
      </el-table-column>
      <el-table-column
        prop="sysname"
        header-align="center"
        align="center"
        label="系统名称">
      </el-table-column>
      <el-table-column
        prop="managername"
        header-align="center"
        align="center"
        label="部门名称">
      </el-table-column>
      <!--<el-table-column
        prop="width"
        header-align="center"
        align="center"
        label="窗口宽(px)">
      </el-table-column>
      <el-table-column
        prop="height"
        header-align="center"
        align="center"
        label="窗口高(px)">
      </el-table-column>-->
      <el-table-column
        prop="paramtype"
        header-align="center"
        align="center"
        width="100"
        label="参数静动态类型">
      </el-table-column>
      <el-table-column
        prop="isvalidate"
        header-align="center"
        align="center"
        width="100"
        label="是否验证">
      </el-table-column>
      <el-table-column
        prop="waytype"
        header-align="center"
        align="center"
        width="100"
        label="验证方式">
      </el-table-column>
      <el-table-column
        prop="linkstatus"
        header-align="center"
        align="center"
        width="80"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.linkstatus == '0'" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatetime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="120"
        label="操作">
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

<script>
  import AddOrUpdateLink from './link_addOrUpdate.vue'

  export default {
    data () {
      return {
        dataForm: {
          id: '',
          linkurl: '',
          linkcode: '',
          usepage: '',
          sysname: '',
          managername: '',
          width: '',
          height: '',
          createtime: '',
          updatetime: '',
          paramtype: '',
          linkstatus: ''
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
      addOrUpdate: AddOrUpdateLink
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
    },
    methods: {
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/link/findlinkdetails'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'linkcode': this.dataForm.linkcode,
            'yjpage': this.dataForm.yjpage,
            'ejpage': this.dataForm.ejpage,
            'sjpage': this.dataForm.sjpage,
            'managername': this.dataForm.managername,
            'sysname': this.dataForm.sysname
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
      addOrUpdateHandle (id, data, subType) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, data, subType)
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
