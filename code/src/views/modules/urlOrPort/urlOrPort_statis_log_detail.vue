<template>
  <el-dialog
    :title="'日志详情信息'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native=""
             label-width="15%">
      <el-form-item label="链接类型" prop="urlType">
        <el-input v-model="dataForm.urlType" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="所属板块" prop="modules">
        <el-input v-model="dataForm.modules" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="所属模块" prop="childModule">
        <el-input v-model="dataForm.childModule" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
        <el-input type="textarea" v-model="dataForm.url" :autosize="{ minRows: 2, maxRows: 4}" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="responseCode">
        <el-input v-model="dataForm.responseCode" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="异常信息" prop="errRespMessage">
        <el-input v-model="dataForm.errRespMessage" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="巡检时间" prop="pollTime">
        <el-input v-model="dataForm.pollTime" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="响应时长" prop="responseTime">
        <el-input v-model="dataForm.responseTime" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="错误信息" prop="errStackMessage">
        <el-input type="textarea" v-model="dataForm.errStackMessage" :autosize="{ minRows: 2, maxRows: 8}" :readonly="true"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input.vue'

  export default {
    components: {ElInput},
    data () {
      return {
        visible: false,
        dataForm: {
          urlType: '',
          modules: '',
          childModule: '',
          url: '',
          responseCode: '',
          errRespMessage: '',
          errStackMessage: '',
          pollTime: '',
          responseTime: ''
        }
      }
    },
    created () {
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl('/urlOrPort/queryIdOfLog'),
            method: 'get',
            params: this.$http.adornParams({
              'id': id
            })
          }).then(({data}) => {
            this.dataForm = data
          })
        })
      }
    }
  }
</script>
