<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
		@close='closeDialog'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
			<el-form-item label="投诉问题" prop="tswt">
				<el-select v-model="dataForm.tswt" placeholder="" style="width:100%" v-bind:disabled="!dataForm.id ? false : true">
			  	 <el-option v-for="item in dataForm.tswtList" :label="item.dataName" :value="item.dataId"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="受理时间" prop="slsj">
        <el-input v-model="dataForm.slsj" placeholder="格式（yyyy-MM-dd HH:mm:ss）"></el-input>
      </el-form-item>
      <el-form-item label="诉求主题" prop="sqzt">
        <el-input v-model="dataForm.sqzt"></el-input>
      </el-form-item>
      <el-form-item label="诉求描述" prop="sqms">
        <el-input type="textarea" :rows="4" v-model="dataForm.sqms"></el-input>
      </el-form-item>
      <el-form-item label="转办单位" prop="zbdw">
        <el-input v-model="dataForm.zbdw"></el-input>
      </el-form-item>
      <el-form-item label="办理情况" prop="blqk">
        <el-input type="textarea" :rows="4" v-model="dataForm.blqk"></el-input>
      </el-form-item>
			<el-form-item label="办理流程" prop="bllc">
				<div v-for="(item, index) in dataForm.bllc">
					<el-row>
						<el-col :span="6">
							<el-form-item :prop="'bllc.'+index+'.lcmc'" :rules="bllcRules.lcmc">
								<el-input v-model="item.lcmc" size="small" style="width:150px;" placeholder="流程名称"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item>
								<el-input v-model="item.lcsj" size="small" style="width:150px;" placeholder="流程时间"></el-input>
							</el-form-item>	
						</el-col>
						<el-col :span="11">
							<el-form-item>
								<el-input v-model="item.lcms" size="small" style="width:280px;" placeholder="流程描述"></el-input>
							</el-form-item>	
						</el-col>
						<el-col :span="1">
							<el-form-item>
								<i class="el-icon-remove-outline" @click="deleteLc(item, index)" v-if="index>0"></i>
								<i class="el-icon-circle-plus-outline" @click="addLc" v-if="index==0"></i>
							</el-form-item>	
						</el-col>
					</el-row>
				</div> 
			</el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="dataForm.address"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
	import { formatDate } from '@/utils/validate'
	import Icon from '@/icons'
  export default {
    data () {
			var validateDate = (rule, value, callback) => {
			  if (!formatDate(value)) {
			    callback(new Error('时间格式错误'))
			  } else {
			    callback()
			  }
			}
      return {
        visible: false,
				isReadOnly: true,
        dataForm: {
          id: 0,
					tswt:'',
					tswtList:[],	//所有省份list
          slsj: '',
          sqzt: '',
          sqms: '',
          zbdw: '',
          blqk: '',
          address: '',
					bllc: [{
            lcmc: '',
            lcsj: '',
            lcms: ''
          }]
        },
        dataRule: {
					tswt: [
					  { required: true, message: '投诉问题不能为空', trigger: 'blur' }
					],
          slsj: [
            { required: true, message: '受理时间不能为空', trigger: 'blur' },
						{ validator: validateDate, trigger: 'blur' }
          ]
        },
				bllcRules: {
					lcmc: [
					  { required: true, message: '流程名称不能为空', trigger: 'blur' },
					  { max: 8, message: "长度不能超过8个字", trigger: "blur" }
					]
				}
      }
    },
		created () {
		   //this.getTswt()
		},
    methods: {
      init (id) {
        this.visible = true
				this.getTswt()
        this.$nextTick(() => {
					this.dataForm.bllc = [{lcmc:"",lcsj:"",lcms:""}]
	        this.$refs['dataForm'].resetFields()
	        this.dataForm.id = id
	        if (this.dataForm.id) { 
	          this.$http({
	            url: this.$http.adornUrl(`/mssq/cfts/detail?id=` + this.dataForm.id),
	            method: 'get'
	          }).then(({data}) => {     
						  if (data && data.successful) {
	              this.dataForm.slsj = data.data.slsj
	              this.dataForm.sqzt = data.data.sqzt
	              this.dataForm.sqms = data.data.sqms
	              this.dataForm.zbdw = data.data.zbdw
	              this.dataForm.blqk = data.data.blqk
	              this.dataForm.address = data.data.address
								this.dataForm.bllc = data.data.bllc
								this.dataForm.tswt = data.data.wtms
	            }else{
		        		console.log('ERROR',data)
		            this.$message.error("操作失败")
		          }
	          })
	        }       
        })
      },
			//获取服务器列表
			getTswt(){
				this.$http({
			        url: this.$http.adornUrl(`/mssq/queryCfts`),
			        method: 'get'
			      }).then(({data}) => {
							if(data.successful){
								/* var result = [];
								this.dataForm.region = data.data
								for (var i = 0; i < this.dataForm.region.length; i++) {
									if(this.dataForm.region[i].parentCode == '-1'){
										result.push(this.dataForm.region[i])
									}
								} */
								this.dataForm.tswtList = data.data
							}else{
								console.log('ERROR',data)
							}
							
			      })
			},
      // 表单提交
      dataFormSubmit () {
				let lcmc = new Array();
				let lcsj = new Array();
				let lcms = new Array();
				let lc = this.dataForm.bllc;
				//console.log(lc);
				for (let i=0;i<lc.length;i++) {
					lcmc.push(lc[i].lcmc.length>0 ? lc[i].lcmc : "--");
					lcsj.push(lc[i].lcsj.length>0 ? lc[i].lcsj : "--");
					lcms.push(lc[i].lcms.length>0 ? lc[i].lcms : "--");
				}
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.$http({
							url: this.$http.adornUrl(`/mssq/cfts/${!this.dataForm.id ? 'save' : 'update'}`),
							method: 'post',
							params: this.$http.adornParams({
								'id': this.dataForm.id || undefined,
								'slsj': this.dataForm.slsj,
								'sqzt': this.dataForm.sqzt,
								'sqms': this.dataForm.sqms,
								'zbdw': this.dataForm.zbdw,
								'blqk': this.dataForm.blqk,
								'tswt': this.dataForm.tswt,
								'address': this.dataForm.address
							})
						}).then(({data}) => {
							if (data && data.successful) {
						this.$http({
							url: this.$http.adornUrl(`/mssq/cfts/bllc`),
							method: 'post',
							params: this.$http.adornParams({
								'id': data.data,
								'lcmc': lcmc.toString(),
								'lcsj': lcsj.toString(),
								'lcms': lcms.toString()
							})
						}).then(({data}) => {
							if (data && data.successful) {	  
								this.$message({
									message: '操作成功',
									type: 'success',
									duration: 1500,
									onClose: () => {
										this.visible = false
										this.$emit('refreshDataList')
									}
								})
							} else {
								this.$message.error(data.message)
							}
						})
							} else {
								this.$message.error(data.message)
							}
						})
          }
        })
      },
			//关闭弹框的事件
			closeDialog(){
				this.dataForm.bllc = [{lcmc:"",lcsj:"",lcms:""}];
			},
			//添加流程
			addLc(){
				this.dataForm.bllc.push({
					lcmc: '',
					lcsj: '',
					lcms: ''
				})
			},
			//删除流程
			deleteLc(item, index){
				this.index = this.dataForm.bllc.indexOf(item)
				if (index !== -1) {
					this.dataForm.bllc.splice(index, 1)
				}
			}
			
		}
  }
</script>