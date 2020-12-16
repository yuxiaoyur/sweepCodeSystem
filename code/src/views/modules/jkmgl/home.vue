<template>
  <div class="jkmgl-home-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame total-frameA">
            <div>
                <img class="total-icon">
                <div class="total-title">红码总数</div>
                <div class="total-value">200</div>
            </div>
            <p>以按钮组的方式出现</p>
            <p>常用于多项类似操作</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame total-frameB">
            <div>
                <img class="total-icon">
                <div class="total-title">红码总数</div>
                <div class="total-value">200</div>
            </div>
            <p>以按钮组的方式出现</p>
            <p>常用于多项类似操作</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame total-frameC">
            <div>
                <img class="total-icon">
                <div class="total-title">红码总数</div>
                <div class="total-value">200</div>
            </div>
            <p>以按钮组的方式出现</p>
            <p>常用于多项类似操作</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 20px">
                <div style="width:365px;height:230px;margin: 0 auto;" id="jkgltjEchart"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border" style="margin-bottom: 15px">
            <div class="layout-title">用户总览</div>
            <div style="padding: 25px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">200</el-col>
                <el-col :span="6" class="color-danger overview-item-value">1000</el-col>
                <el-col :span="6" class="color-danger overview-item-value">5000</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 25px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">200</el-col>
                <el-col :span="6" class="color-danger overview-item-value">1000</el-col>
                <el-col :span="6" class="color-danger overview-item-value">5000</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
        <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待确认收货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">新缺货登记</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退款申请</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已发货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">广告位即将到期</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'home',
    data() {
      return {
       echartsdata:[{"date": "02-05","sw": 0,"qz": 5,"pcr": 0,"zy": 7},
                    {"date": "02-06","sw": 0,"qz": 5,"pcr": 0, "zy": 0},
                    {"date": "02-07","sw": 0,"qz": 5,"pcr": 0,"zy": 9},
                    {"date": "02-08","sw": 0,"qz": 7,"pcr": 0,"zy": 8},
                    {"date": "02-09","sw": 0,"qz": 11,"pcr": 0,"zy": 2},
                    {"date": "02-10","sw": 0,"qz": 3,"pcr": 0,"zy": 4},
                    {"date": "02-11","sw": 0,"qz": 1,"pcr": 0,"zy": 2}
                ]
      }
    },
    mounted () {
        this.drawSorter();
        this.getDataList()
      
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
        drawSorter () {
            let SorterEcharts = echarts.init(document.getElementById('jkgltjEchart'))
            SorterEcharts.clear()
            var date = [];
            var value1 = [];
            for (var i = 0; i < this.echartsdata.length; i++) {
                date.push(this.echartsdata[i].date);
                value1.push(this.echartsdata[i].qz);
            }
             var option = {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter:'{b}<br/>{a0} : {c0}例',
                    padding:2,
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    textStyle:{
                        color:"#fff",
                        fontSize:14
                    }
                },
                legend: {
                    show: true,
                    icon: 'rect',
                    itemWidth:5,
                    selectedMode:false,//取消图例上的点击事件
                    itemHeight:5,
                    itemGap:5,
                    textStyle: {
                        fontSize: 14,
                        color: '#a6b5d2'
                    },
                    name: ["确诊"]
                },
                grid: {
                    left: '1%',
                    right: '5%',
                    bottom: '1%',
                    top:'15%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:{
                        margin:10,
                        rotate:0,
                        formatter:function(value) {
                            return value;
                        } ,
                        textStyle: {
                            fontSize:14
                        },
                        color:'#a6b5d2'
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show:true,
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: '#a6b5d2',
                            width: 1
                        }
                    },
                    data: date
                }],
                yAxis: [{
                    type: 'value',
                    name:'(例)',
                    splitNumber:1,
                    nameTextStyle:{
                        fontSize:14,
                        color:'#a6b5d2',
                        margin:[0,0,0,5]
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show:true,
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: '#a6b5d2',
                            width: 1
                        }
                    },
                    axisLabel: {//Y轴
                        margin: 5,
                        textStyle: {
                            fontSize: 14
                        },
                        color:'#a6b5d2'
                    },
                    splitLine: {
                        show: true,//横向网格线
                        lineStyle: {
                            color: 'rgba(166,181,210,0.3)',
                            width: 1
                        }
                    }
                }],
                series : [
                    {
                        name:'确诊',
                        type:'line',
                        smooth:true,
                        symbolSize: 5,
                        areaStyle: {},
                        data:value1,
                        color:"#e84832",
                        itemStyle: {
                            normal: {
                                color: '#ffff00',
                                lineStyle: {
                                    color: "#aecb56",
                                    width:1
                                },
                                areaStyle: {
                                    //color: '#94C9EC'
                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(255,255,255,0.1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(249, 249, 4,0.8)'
                                    }]),
                                }
                            }
                        },
                    }
                ]
            };
            SorterEcharts.setOption(option)
        }

    }
  }
</script>

<style lang="scss" scoped>
  .jkmgl-home-container {

    .total-frame {
        padding: 20px;
        height: auto;
        color: #fff;
    }

    .total-frameA{
        background-color: #f35555;
        border: 1px solid #f35555;
    }

    .total-frameB{
        background-color: #f5eb35;
        border: 1px solid #f5eb35;
    }

    .total-frameC{
        background-color: #75f138;
        border: 1px solid #75f138;
    }

    .total-icon {
        color: #409EFF;
        width: 60px;
        height: 60px;
    }

    .total-frame>div{
        position: relative;
    }

    .total-frame>p{
        padding: 10px 0 0 0;
    }

    .total-title {
        position: absolute;
        font-size: 16px;
        color: #fff;
        left: 70px;
        top: 5px;
    }

    .total-value {
        position: absolute;
        font-size: 18px;
        color: #fff;
        left: 70px;
        top: 40px;
    }

    .un-handle-layout {
        margin-top: 20px;
        border: 1px solid #DCDFE6;
    }

    .layout-title {
        color: #606266;
        padding: 15px 20px;
        background: #F2F6FC;
        font-weight: bold;
    }

    .un-handle-content {
        padding: 20px 40px;
    }

    .un-handle-item {
        border-bottom: 1px solid #EBEEF5;
        padding: 10px;
    }

    .overview-layout {
        margin-top: 20px;
    }

    .overview-item-value {
        font-size: 24px;
        text-align: center;
    }

    .overview-item-title {
        margin-top: 10px;
        text-align: center;
    }

    .out-border {
        border: 1px solid #DCDFE6;
    }

    .statistics-layout {
        margin-top: 20px;
        border: 1px solid #DCDFE6;
    }
    .mine-layout {
        position: absolute;
        right: 140px;
        top: 107px;
        width: 250px;
        height: 235px;
    }
    .address-content{
        padding: 20px;
        font-size: 18px
    }
  }

</style>
