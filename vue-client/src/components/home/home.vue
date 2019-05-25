<template>
    <div class="body">
        <van-nav-bar
        title="订单中心"
        />
        <van-tabs v-model="activeNav" sticky swipeable @change="changeNav">
            <van-tab title="未开始">
                <div v-if="orderList.length>0" class="listPanel">
                    <div v-for="(item,index) in orderList" :key="index" class="orderItem van-hairline--bottom" @click="goOrderItem(item.order_no)">
                        <div>规格：{{item.order_format}}<span>订单号：{{item.order_no}}</span></div>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div v-else class="noData">
                    <img src="@/assets/images/tableNoData.png" alt="">
                </div>
            </van-tab>
            <van-tab title="进行中">
                <div v-if="orderList.length>0" class="listPanel">
                    <div v-for="(item,index) in orderList" :key="index" class="orderItem van-hairline--bottom" @click="goOrderItem(item.order_no)">
                        <div>规格：{{item.order_format}}<span>订单号：{{item.order_no}}</span></div>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div v-else class="noData">
                    <img src="@/assets/images/tableNoData.png" alt="">
                </div>
            </van-tab>
            <van-tab title="已完成">
                <div v-if="orderList.length>0" class="listPanel">
                    <div v-for="(item,index) in orderList" :key="index" class="orderItem van-hairline--bottom" @click="goOrderItem(item.order_no)">
                        <div>规格：{{item.order_format}}<span>订单号：{{item.order_no}}</span></div>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div v-else class="noData">
                    <img src="@/assets/images/tableNoData.png" alt="">
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import _ from 'lodash'
    export default {
        data() {
            return {
                userInfo: JSON.parse(localStorage.getItem('userInfo')),
                orderList: [],
                activeNav: 1,
            }
        },
        created(){
          this.getUserInfo()
          this.getOrderList(1)
        },
        mounted() {
        },
        methods: {
            changeNav: function(index, title){
                this.getOrderList(index)
            },
            goOrderItem: function(orderNo){
                this.$router.push({
                    path: '/orderItem',
                    query: {orderNo}
                })
            },
            getUserInfo(){
                if(_.isEmpty(this.userInfo)){
                    this.$router.push({
                        path: '/login'
                    })
                    return
                }
            },
            getOrderList: function(status){
                var params = {
                    token: this.userInfo.token,
                    work_type: this.userInfo.work_type,
                    user_name: this.userInfo.name,
                    doing: status
                }
                this.$http.post('/jyclient/api/order/getOrderList', params).then(res=>{
                    console.log(res.data, 'res.data')
                    if(res.status==0){
                        this.orderList = res.data
                    }
                })
            },
        },
    }
</script>

<style scoped>
/* .body{background: #fafdfc;height: 100vh;}
.listPanel{background: white;} */
.orderItem{display: flex;align-items: center;justify-content: space-between;padding: .2rem;font-size: 0.4233rem}
.orderItem div span{font-size: 0.28rem;color: #999;display: block;margin-top: .1rem;}
.arrowRight{fill: #999}
.noData{display: flex;justify-content: center;align-items: center;height: 5rem;}
</style>