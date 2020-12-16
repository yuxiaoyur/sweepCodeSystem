<template>
  <el-dialog
    :title="'已授权链接列表'"
    :modal-append-to-body="false"
    :close-on-click-modal="true"
    :visible.sync="visible"
    width="75%">
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
        <!--<el-form-item>
          <el-input v-model="dataForm.managername" placeholder="所属部门名称关键词" clearable></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('add')" type="primary" @click="addHandle(dataForm.id)">添加绑定
          </el-button>
          <el-button v-if="hasPermission('delete')" type="primary" @click="deleteHandle()">批量解绑</el-button>
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
          label="授权时间">
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
        <!--<el-table-column
          prop="managername"
          header-align="center"
          align="center"
          label="部门名称">
        </el-table-column>-->
        <el-table-column
          header-align="center"
          align="center"
          width="250"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">解绑
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
      <add-or-update v-if="addVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-dialog>
</template>

<script>
  import AddOrUpdateLink from './role_add_list.vue'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          linkcode: '',
          yjpage: '',
          ejpage: '',
          sjpage: '',
          sysname: '',
          managername: '',
          createtime: ''
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
        addVisible: false
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
      init (userid) {
        this.visible = true
        if (userid != null && userid != '') {
          this.dataForm.id = userid
        }
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/linkRole/findUserRole'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userid': this.dataForm.id,
            'linkcode': this.dataForm.linkcode,
            'yjpage': this.dataForm.yjpage,
            'ejpage': this.dataForm.ejpage,
            'sjpage': this.dataForm.sjpage,
//            'managername': this.dataForm.managername,
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
      addHandle (id) {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除权限
      deleteHandle (roleid) {
        var Ids = roleid ? [roleid] : this.dataListSelections.map(item => {
          return item.id
        })
        if (Ids == null || Ids == '') {
          this.$message.error('请选择要解绑的数据')
          return
        }
        this.$confirm(`确定进行[${Ids ? '解绑' : '批量解绑'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/linkRole/removeLinkRole'),
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
