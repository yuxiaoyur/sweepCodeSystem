<template>
  <div class="qsxjkmtj-hsjkmlb-container">
      <p class="qsxjkmlb-title"><span>XXX</span>截止<span>XXXX</span>，现有健康码实际用户<span>XXXX</span>人</p>
      <div class="qsxjkmlb-search">
          <!-- @keyup.enter.native="" -->
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="120px">
                <el-form-item label="省/直辖市" prop="province">
                        <el-select v-model="dataForm.province" placeholder="" @change="proChange" style="width:50%">
                        <el-option v-for="item in dataForm.proList" :label="item.dataName" :value="item.dataCode"></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="市/直辖市区" prop="city">
                        <el-select v-model="dataForm.city" placeholder="" @change="cityChange" style="width:50%">
                        <el-option v-for="item in dataForm.cityList" :label="item.dataName" :value="item.dataCode"></el-option>
                        </el-select>
                    </el-form-item>
                    
                <el-form-item label="区/县" prop="area">
                        <el-select v-model="dataForm.area" placeholder="" style="width:50%">
                        <el-option v-for="item in dataForm.areaList" :label="item.dataName" :value="item.dataCode"></el-option>
                        </el-select>
                    </el-form-item>
               
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button >取消</el-button>
            <el-button type="primary" >确定</el-button>
            </span>
      </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'home',
    data() {
      return {
          dataForm: {
          proList:[],	//所有省份list
          cityList:[],
          areaList:[]
        },
        dataRule: {
        },
     

      }
    },
    mounted () {
        this.getDataList()
        this.getPro()
      
    },
    methods:{
        getDataList () {
          this.$http({
            url: window.location.origin+"/src/data/" +"jkmcs"+".json",
            method: 'get'
          }).then(({data}) => {
            console.log(data)
          })
        },
               
        //获取服务器列表
      getPro(){
      	this.$http({
              url: this.$http.adornUrl(`/meta/getMetaByTypeCode`),
              method: 'get',
              params: this.$http.adornParams({typeCode:'region'},false)
            }).then(({data}) => {
                console.log(data)
            	
							if(data.successful){
								var result = [];
								this.dataForm.region = data.data
								for (var i = 0; i < this.dataForm.region.length; i++) {
									if(this.dataForm.region[i].parentCode == '-1'){
										result.push(this.dataForm.region[i])
									}
								}
                                this.dataForm.proList = result
                                console.log(this.dataForm.proList )
							}else{
								console.log('ERROR',data)
							}
							
            })
      },

       proChange(selVal){
           console.log(selVal)
        //    510000000000
      	var result = []
      	var parentId = ''
      	//获取parentid
      	for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(selVal == this.dataForm.region[i].dataCode){
        		parentId = this.dataForm.region[i].id
        		break
        	}
        }
      	
        for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(parentId == this.dataForm.region[i].parentCode){
        		result.push(this.dataForm.region[i])
        	}
        }
        
        this.dataForm.cityList = result
      },
      
      cityChange(selVal){

      	var result = []
      	var parentId = ''
      	//获取parentid
      	for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(selVal == this.dataForm.region[i].dataCode){
        		parentId = this.dataForm.region[i].id
        		break
        	}
        }
      	console.log(parentId)
        for (var i = 0; i < this.dataForm.region.length; i++) {
        	if(parentId == this.dataForm.region[i].parentCode){
        		result.push(this.dataForm.region[i])
        	}
        }
        
        this.dataForm.areaList = result
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
      }
    
  }

</style>
