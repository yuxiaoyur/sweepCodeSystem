<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.yqsjms" placeholder="舆情关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.tjrq" placeholder="统计日期" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('delete')" @click="deleteHandle()">批量删除</el-button>
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
        width="50">
      </el-table-column>
      <el-table-column
        prop="yqsjms"
        header-align="center"
        align="center"
        label="事件描述">
      </el-table-column>
      <el-table-column
        prop="sl"
        header-align="center"
        align="center"
        width="150"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="tjrq"
        header-align="center"
        align="center"
        width="200"
        label="统计日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="400"
        label="操作">
        <template slot-scope="scope">                
          <el-button type="text" @click="rdsjBindQgfx(scope.row.id)">情感分析</el-button>
          <el-button type="text" @click="deleteHandle(scope.row.id)">删除</el-button>                    
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
    <!-- 弹窗, 情感分析 refreshDataList回调函数-->
    <bind-qgfx v-if="bindQgfxVisible" ref="bindQgfx" @refreshDataList="getDataList"></bind-qgfx>
  </div>
</template>

<script>
	import BindQgfx from './mssq-qgfx'
  export default {
    data () {
      return {
        dataForm: {
          yqsjms: '',
          sl: '',
          tjrq: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        permission:[],
        permissionVisible:{
          add:false,
          update:false,
          delete:false
        },
        bindQgfxVisible: false
      }
    },
    components: {
    	bindQgfx: BindQgfx
    },
    activated () {
      this.getDataList()
    },
    mounted(){
      this.getPermission()
    },
    methods: {
      getPermission(){
        this.$http({
          url: this.$http.adornUrl('/sys/menuPermission'),
          method: 'get',
          params: this.$http.adornParams({menuId:this.$route.meta.menuId})
        }).then(({data}) => {
          this.permission = data
          for (var i = 0; i < data.length; i++) {
            switch (data[i].split(":")[1]){
              case "add":
                this.permissionVisible.add = true
                break;
              case "update":
                this.permissionVisible.update = true
                break;
              case "delete":
                this.permissionVisible.delete = true
                break;
              default:
                break;
            }
          }

        })
      },
      hasPermission(param){
        switch (param){
          case "add":
            return this.permissionVisible.add
          case "update":
            return this.permissionVisible.update
          case "delete":
            return this.permissionVisible.delete
          default:
            return false;
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mssq/rdsj'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'yqsjms': this.dataForm.yqsjms,
            'tjrq': this.dataForm.tjrq
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
      // 删除
      deleteHandle (id) {
        var rcIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if(rcIds == null || rcIds == ''){
          this.$message.error("请选择要删除的数据")
          return
        }
        this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/mssq/rdsj/remove'),
            method: 'post',
            params: this.$http.adornParams({id:rcIds.join(',')},false)
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
      },
      //查看列表
      rdsjBindQgfx (id) {
        this.bindQgfxVisible = true
        this.$nextTick(() => {
          this.$refs.bindQgfx.init(id)
        })
      }
    }
  }
</script>
