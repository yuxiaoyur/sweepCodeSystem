<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <!--<h2 class="brand-info__text">成都智慧治理</h2> 
          <p class="brand-info__intro">基于vue、element-ui构建开发，实现成都智慧治理后台管理前端功能。</p> -->
        </div>
        <div class="login-main">
          <h3 class="login-title">用户登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
           <!-- <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item> -->
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  import Cookies from 'js-cookie'
  import crypto from 'crypto'
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha()
    },
    mounted () {
      this.loginIn()//直接登陆
    },
    methods: {
      loginIn(){
        let _that=this
        this.$ajax({
          method: 'get',
          url: this.$http.adornUrl('/unifiedLogin'),
          // data:params
        }).then(function (response) { 
          if(response.data.responsecode==200){
            // this.$router.replace({ name: 'jkmgl-home' })
            _that.$router.replace({name:'home'})
          }else{
            window.location.href = 'http://10.1.231.181/ucenter/?url=xxxx'
          }        
        }).catch(function (error) {
          console.log(error);
        })
      },
      // 提交表单
      dataFormSubmit () {
	      var params = new URLSearchParams();
        var md5 = crypto.createHash("md5");
        md5.update(this.dataForm.password);
        var password = md5.digest('hex');
        params.append('username', this.dataForm.userName);
        params.append('password', password);
        var _that = this;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
           this.$ajax({
              method: 'post',
              url: this.$http.adornUrl('/login'),
              data:params
            }).then(function (response) {
              
              if(response.data.successful == true){
                // _that.$router.replace({ name: 'jkmgl-home' })
                 _that.$router.replace({name:'home'})
              }else {
                _that.$message.error(response.data.message)
              }

            }).catch(function (error) {
              console.log(error);
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    // left: 0;
    // background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 0;
      width: calc(100% - 470px);
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bgc.jpg);
      // background-size: cover;
      background-size:100% 100%;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>
