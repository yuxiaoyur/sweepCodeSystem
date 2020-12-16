<template>
  <div class="mod-mssq-rcjl">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.rc" placeholder="热词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.rgsj" placeholder="人工事件" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.tjrq" placeholder="统计日期(yyyy-MM-dd)" clearable></el-input>
      </el-form-item>
      <el-form-item>
    		<el-select v-model="dataForm.fl" placeholder="不限分类" style="width:100%">
	      	 <el-option label="不限分类" value=""></el-option>
	      	 <el-option label="综合" value="0"></el-option>
	      	 <el-option label="企业诉求" value="1"></el-option>
    		</el-select>
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
      <!--<el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="150"
        label="ID">
      </el-table-column>-->
      <el-table-column
        prop="rc"
        header-align="center"
        align="center"
        width="80"
        label="热词">
      </el-table-column>
      <el-table-column
        prop="sj"
        header-align="center"
        align="center"
        width="450"
        label="事件">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="人工事件">
        <template slot-scope="scope">
          <el-button type="text" @click="rcjlRgsjHandle(scope.row.id)">{{scope.row.rgsj}}</el-button>       
        </template>      
      </el-table-column>
      <el-table-column
        prop="tsl"
        header-align="center"
        align="center"
        width="80"
        label="投诉量">
      </el-table-column>
      <el-table-column
        prop="tjrq"
        header-align="center"
        align="center"
        width="100"
        label="统计日期">
      </el-table-column>
      <el-table-column
        prop="flmc"
        header-align="center"
        align="center"
        width="80"
        label="分类">
      </el-table-column>
      <el-table-column
        prop="sjdj"
        header-align="center"
        align="center"
        width="90"
        label="事件等级">
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
    <!-- 弹窗, 人工事件 refreshDataList回调函数-->
    <rcjl-rgsj v-if="rcjlRgsjVisible" ref="rcjlRgsj" @refreshDataList="getDataList"></rcjl-rgsj>
  </div>
</template>

<script>
  import AddOrUpdate from './mssq-rcjl-add-or-update'
  import RcjlRgsj from './mssq-rcjl-rgsj'
  export default {
    data () {
      return {
        dataForm: {
          rc: '',
          rgsj: '',
          tjrq: '',
          fl: ''
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
        addOrUpdateVisible: false,
        rcjlRgsjVisible: false
      }
    },
    components: {
      addOrUpdate: AddOrUpdate,
      rcjlRgsj: RcjlRgsj
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
          url: this.$http.adornUrl('/mssq/rcjl'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'rc': this.dataForm.rc,
            'tjrq': this.dataForm.tjrq,
            'rgsj': this.dataForm.rgsj,
            'fl': this.dataForm.fl
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //人工事件
      rcjlRgsjHandle (id) {
        this.rcjlRgsjVisible = true
        this.$nextTick(() => {
          this.$refs.rcjlRgsj.init(id)
        })
      },
  
    }
  }
</script>
