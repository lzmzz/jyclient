<template>
    <div class="body">
        <van-nav-bar
        title="订单中心"
        />
        <div ref="scroll">
            <div v-if="orderList.length>0" class="scrollContent listPanel">
                <div v-for="(item,index) in orderList" :key="index" class="orderItem van-hairline--bottom" @click="goOrderItem(item.order_no)">
                    <div>{{item.order_name}}<span>订单号：{{item.order_no}}</span></div>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div v-else class="noData">
                <img src="@/assets/images/tableNoData.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import BScroll from 'better-scroll'
    export default {
        data() {
            return {
                userInfo: JSON.parse(localStorage.getItem('userInfo')),
                orderList: []
            }
        },
        created(){
            this.$nextTick(() => {
                this._initScroll()
            })
        },
        mounted() {
            this.getUserInfo()
        },
        methods: {
            _initScroll: function(){
                var option = {
                    tap: true,
                    click: true,
                }
                this.scroll = new BScroll(this.$refs.scroll, option)
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
                this.$http.post('/jyclient/api/user/getUserInfo', {token: this.userInfo.token}).then(res=>{
                    if(res.status==-1){
                        this.$toast(res.data)
                        setTimeout(() => {
                            this.$router.push({
                                path: '/login'
                            })
                        }, 2000)
                        return
                    }else{
                        this.getOrderList(true)
                    }
                })
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
            onItemClick: function(index){
                if(index==0){
                    this.getOrderList(true)
                }else{
                    this.getOrderList(false)
                }
            }
        },
    }
</script>

<style scoped>
/* .body{background: #fafdfc;height: 100vh;}
.listPanel{background: white;} */
.orderItem{display: flex;align-items: center;justify-content: space-between;padding: .2rem;font-size: 0.4133rem}
.orderItem div span{font-size: 0.28rem;color: #999;display: block;margin-top: .1rem;}
.arrowRight{fill: #999}
.noData{display: flex;justify-content: center;align-items: center;height: 5rem;}
</style>