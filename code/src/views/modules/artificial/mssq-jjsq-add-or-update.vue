<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close='closeDialog'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
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
              <el-form-item :prop="'bllc.'+index+'.lcsj'" :rules="bllcRules.lcsj">
                <el-input v-model="item.lcsj" size="small" style="width:150px;" placeholder="流程时间"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item :prop="'bllc.'+index+'.lcms'" :rules="bllcRules.lcms">
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
      <el-form-item label="内容分类" prop="nrfl">
        <el-input v-model="dataForm.nrfl"></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <el-input v-model="dataForm.area"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="dataForm.address"></el-input>
      </el-form-item>
      <el-form-item label="文件名称" prop="path">
        <el-input v-model="dataForm.path" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="录音播放" prop="path">
        <audio ref='audio' controls></audio>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-audio"
          ref="upload"
          :action=fileUrl
          :limit=1
          :before-upload="beforeAvatarUpload"
          :auto-upload = 'false'
          :on-success = 'handleSuccess'
          name="uploadAudio">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
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
  import { isSpecial } from '@/utils/validate'
  export default {
    data () {
      var validateDate = (rule, value, callback) => {
        if (!formatDate(value)) {
          callback(new Error('时间格式错误'))
        } else {
          callback()
        }
      }
      var validateSpecial = (rule, value, callback) => {
        if (isSpecial(value)) {
          callback(new Error('请不要输入英文逗号'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          slsj: '',
          sqzt: '',
          sqms: '',
          zbdw: '',
          blqk: '',
          nrfl: '',
          area: '',
          address: '',
          path: '',
          bllc: [{
            lcmc: '',
            lcsj: '',
            lcms: ''
          }]
        },
        dataRule: {
          slsj: [
            { required: true, message: '受理时间不能为空', trigger: 'blur' },
            { validator: validateDate, trigger: 'blur' }
          ]
        },
        bllcRules: {
          lcmc: [
            { required: true, message: '流程名称不能为空', trigger: 'blur' },
            { max: 8, message: "长度不能超过8个字", trigger: "blur" },
            { validator: validateSpecial, trigger: 'blur' }
          ],
          lcsj: [
            { validator: validateSpecial, trigger: 'blur' }
          ],
          lcms: [
            { validator: validateSpecial, trigger: 'blur' }
          ]
        },
        fileUrl:this.$http.adornUrl('/mssq/jjcl/upload')
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.dataForm.bllc = [{lcmc:"",lcsj:"",lcms:""}]
          this.$refs['dataForm'].resetFields()
          this.$refs.audio.src = ""
          this.dataForm.id = id
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/mssq/jjsq/detail?id=` + this.dataForm.id),
              method: 'get'
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm.slsj = data.data.slsj
                this.dataForm.sqzt = data.data.sqzt
                this.dataForm.sqms = data.data.sqms
                this.dataForm.zbdw = data.data.zbdw
                this.dataForm.blqk = data.data.blqk
                this.dataForm.nrfl = data.data.nrfl
                this.dataForm.area = data.data.area
                this.dataForm.address = data.data.address
                this.dataForm.path = data.data.path
                this.$refs.audio.src = data.data.play
                this.dataForm.bllc = data.data.bllc
              }else{
                console.log('ERROR',data)
                this.$message.error("操作失败")
              }
            })
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

        /* if (!this.dataForm.path) {
                this.$message.error('请上传录音文件!')
                return false
            } */

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/mssq/jjsq/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || undefined,
                'slsj': this.dataForm.slsj,
                'sqzt': this.dataForm.sqzt,
                'sqms': this.dataForm.sqms,
                'zbdw': this.dataForm.zbdw,
                'blqk': this.dataForm.blqk,
                'nrfl': this.dataForm.nrfl,
                'area': this.dataForm.area,
                'address': this.dataForm.address,
                'path': this.dataForm.path
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.$http({
                  url: this.$http.adornUrl(`/mssq/jjsq/bllc`),
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
      submitUpload() {
        this.$refs.upload.submit();
      },
      beforeAvatarUpload(file) {
        let rule = file.name.split('.');
        if (rule[1].toLowerCase() === 'wav' || rule[1].toLowerCase() === 'mp3') {
          if (file.size/1024/1024 > 20) {
            this.$message.error('上传文件大小不能超过20M!')
            return false
          } else {
            return file
          }
        } else {
          this.$message.error('上传文件只能是 wav/mp3 格式!')
          return false
        }
      },
      handleRemove(file) {
      },
      handlePreview(file) {
      },
      handleSuccess(res,file){
        if(res.flag){
          this.dataForm.path = res.path;
          this.$refs.upload.clearFiles();
          this.$refs.audio.src = res.play;
          this.$message({
            message: '上传成功！',
            type: 'success'
          });
        }else {
          this.$message({
            message: '上传失败！',
            type: 'error'
          });
        }
      },
      //关闭弹框的事件
      closeDialog(){
        this.$refs.audio.src = "";
        this.dataForm.bllc = [{lcmc:"",lcsj:"",lcms:""}];
        this.$refs.upload.clearFiles();
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
