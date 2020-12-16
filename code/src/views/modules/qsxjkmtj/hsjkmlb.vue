<template>
    <div class="qsxjkmtj-hsjkmlb-container">
        <p class="qsxjkmlb-title"><span>XXX</span>截止<span>XXXX</span>，现有健康码实际用户<span>XXXX</span>人</p>
        <el-form class="qsxjkmlb-search" :inline="true" :model="searchForm" ref="searchForm" @keyup.enter.native="getSearch" size="small" label-width="95px" style="margin-top: 20px;">
            <el-form-item label="区/县：" prop="areaList">
                <el-select style="width: 150px;"  v-model="searchForm.areaList" placeholder="" >
                    <el-option v-for="(item,index) in areaList" :key="index" :label="item.dataName" :value="item.dataCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="街道：" prop="streetList">
                <el-select style="width: 150px;"  v-model="searchForm.streetList" placeholder="" >
                    <el-option v-for="(item,index) in streetList" :key="index" :label="item.dataName" :value="item.dataCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="截止时间：" prop="endTime">
                <el-date-picker style="width: 150px;"  v-model="searchForm.endTime" align="right" type="date" placeholder="选择日期">
                <!-- :picker-options="pickerOptions" -->
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" plain @click="getSearch"> 查 询</el-button>
                <el-button type="primary" size="small" plain @click="resetForm('searchForm')"> 重 置</el-button>
                <el-button type="primary" size="small" plain @click="getExcel"> 数据导出</el-button>
            </el-form-item>
        </el-form>
        <el-table border class="qsxjkmlb-table" ref="multipleTable" v-loading="tableListLoading" :data="qsxjkmTable" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="index" label="序号" width="55"  align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="120"  align="center">
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号码" min-width="120"  align="center">
            </el-table-column>
            <el-table-column prop="code" label="健康码" min-width="120"  align="center">
            </el-table-column>
            <el-table-column prop="message" label="健康信息" min-width="120"  align="center">
            </el-table-column>
            <el-table-column prop="time" label="健康状态更新时间" min-width="120" align="center">
                <!-- <template slot-scope='scope'>
                    <el-switch v-model='scope.row.tuomin' @change='onChangeSxqxTuomin(scope.row)'>
                    </el-switch>
                </template> -->
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        pickerOptions: {
            disabledDate(time) {
                return time.getTime() < Date.now();
            }
        },
        allRegion:[],//所有地址
        proList:[],	//所有省份list
        cityList:[],//所有城市
        areaList:[],//所有区县
        streetList:[],//所有街道
        searchForm: {
            areaList:[],//所有区县
            streetList:[],//所有街道
            endTime:""
        },
        dataRule: {
        },
        qsxjkmTable:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableListLoading:false
     

      }
    },
    mounted () {
        this.getSearch()
        this.getPro()
      
    },
    methods:{
        getSearch () {
          this.tableListLoading=true
          let page="/dataPermission/getUserData"
          let params={
            'page': this.pageIndex,
            'limit': this.pageSize,
            'areaList':this.searchForm.areaList,
            'streetList':this.searchForm.streetList,
            'endTime':this.searchForm.endTime
          }
          this.$http({
            url: window.location.origin+"/src/data/" +"jkmcs"+".json",
            method: 'get'
            // url:this.$http.adornUrl(page),
              // method: 'get',
              // params: this.$http.adornParams(params)
          }).then(({data}) => {
            console.log(data)
            // this.qsxjkmTable=data
            this.tableListLoading=false
            this.qsxjkmTable=[]
            // if(data.successful){
            //   this.tableList = data.data.list
            //   this.totalPage = data.data.total
            //   this.tableListLoading = false
                // this.searchForm={
                //     areaList:[],//所有区县
                //     streetList:[],//所有街道
                //     endTime:""
                // }
            // }else{
            //     this.$message.error("系统异常，请与管理人员联系")
            // }
          })
        },

        //重置查询信息
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },

        // 每页数
        sizeChangeHandle (val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getSearch()
        },
        // 页码变更
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getSearch()
        },

        getExcel(){
            //   window.open("https://codeload.github.com/douban/douban-client/legacy.zip/master");
        // this.$http.post('https://codeload.github.com/douban/douban-client/legacy.zip/master', entity ,{responseType: 'blob'}).then((response)=> {
        //  this.download(response.body,row)
        // });

        },
               
        //获取省市区列表
        getPro(){
            this.$http({
                url: this.$http.adornUrl(`/meta/getMetaByTypeCode`),
                method: 'get',
                params: this.$http.adornParams({typeCode:'region'},false)
                }).then(({data}) => {
                    if(data.successful){
                        var result = [];
                        this.allRegion = data.data
                        for (var i = 0; i < this.allRegion.length; i++) {
                            if(this.allRegion[i].parentCode == '-1'){
                                result.push(this.allRegion[i])
                            }
                        }
                        this.proList = result
                        this.proChange("510000000000")//四川
                        this.cityChange("510100000000")//四川
                        console.log(this.proList )
                    }else{
                        console.log('ERROR',data)
                    }              
                })
        },
        //获取城市
        proChange(selVal){
      	    var result = []
      	    var parentId = ''
            //获取parentid
            for (var i = 0; i < this.allRegion.length; i++) {
                if(selVal == this.allRegion[i].dataCode){
                    parentId = this.allRegion[i].id
                    break
                }
            }
      	
            for (var i = 0; i < this.allRegion.length; i++) {
                if(parentId == this.allRegion[i].parentCode){
                    result.push(this.allRegion[i])
                }
            }
            this.cityList = result
        },
        //获取区县
        cityChange(selVal){
            var result = []
            var parentId = ''
            //获取parentid
            for (var i = 0; i < this.allRegion.length; i++) {
                if(selVal == this.allRegion[i].dataCode){
                    parentId = this.allRegion[i].id
                    break
                }
            }
            console.log(parentId)
            for (var i = 0; i < this.allRegion.length; i++) {
                if(parentId == this.allRegion[i].parentCode){
                    result.push(this.allRegion[i])
                }
            }
            console.log(result)
            this.areaList = result
            
        }
    }
  }
</script>

<style lang="scss" scoped>
  .qsxjkmtj-hsjkmlb-container {
      .qsxjkmlb-title {
          color: #17B3A3;
          font-size: 16px;
          line-height: 30px;
          border-bottom: 1px solid #c1c1c1;
          margin-bottom: 30px;
      } 
  }

</style>
