<template>
  <div>
    <van-nav-bar title="订单详情" left-text="返回" left-arrow @click-left="$router.go(-1)"/>
    <cell :title="'订单号'" :value="orderData.order_no"></cell>
    <cell :title="'订单类型'" :value="orderData.order_type==0?'出货生产单':'库存生产单'"></cell>
    <cell :title="'订单规格'" :value="orderData.order_format"></cell>
    <cell :title="'订单备注'" :value="orderData.order_remark"></cell>
    <cell :title="'客户要求'" :value="orderData.client_request"></cell>
    <cell :title="'订单状态'">
      <div>
        <span style="color: #09BB07">{{statusArr[orderData.order_status]}}</span>
      </div>
    </cell>
    <cell :title="'订单数量'" :value="orderData.order_many"></cell>
    <cell :title="'实际完成数量'">
      <input
        type="number"
        class="orderInput"
        placeholder="请输入"
        v-if="type==1"
        v-model="orderData.status_many"
      >
      <div class="orderInput" v-else>{{orderData.status_many}}</div>
    </cell>
    <Button
      round
      type="primary"
      @click.native="addStatusDtl"
      v-if="type==1"
      class="qdBtn"
    >确定</Button>
    <Button
      round
      type="danger"
      v-if="userInfo.is_master==1&&type==1"
      @click.native="setOrderStatus"
      class="qdBtn"
    >已完成</Button>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      orderData: {},
      type: this.$route.query.type,
      statusArr: [
        "开料中",
        "拉伸中",
        "油压中",
        "车床中",
        "巴位中",
        "米位/甲位中",
        "抛光中",
        "打字中",
        "清洗中",
        "包装中",
        "已完成"
      ]
    };
  },
  created() {},
  mounted() {
    this.getOrderItem();
  },
  methods: {
    setOrderStatus() {
      //确定完成
      var that = this;
      this.$dialog
        .confirm({
          title: "提示",
          message: "您确认已完成吗？"
        })
        .then(() => {
          var params = {
            token: that.userInfo.token,
            order_no: that.$route.query.orderNo,
            order_status: that.orderData.order_status
          };
          that.$http
            .post("/jyclient/api/order/setOrderStatus", params)
            .then(res => {
              if (res.status == 0) {
                this.$toast(res.data);
                setTimeout(() => {
                  that.$router.push({
                    path: "/"
                  });
                }, 500);
              }
            });
        });
    },
    getOrderItem() {
      var params = {
        token: this.userInfo.token,
        orderNo: this.$route.query.orderNo,
        user_id: this.userInfo.id
      };
      this.$http
        .post("/jyclient/api/order/getOrderItem", params)
        .then(res => {
          if (res.status == -1) {
            this.$toast(res.data);
          } else {
            this.orderData = res.data;
            // for(var i=0;i<this.statusArr.length;i++){
            //     if(this.orderData.order_status==i){
            //         this.orderData.order_status=this.statusArr[i]
            //     }
            // }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addStatusDtl: function() {
      if (_.isEmpty(this.orderData.status_many)) {
        this.$toast("请输入实际完成数量");
        return;
      }
      this.$dialog
        .confirm({
          title: "提示",
          message: "您确定要提交吗？"
        })
        .then(() => {
          // on confirm
          var params = {
            token: this.userInfo.token,
            order_no: this.orderData.order_no,
            work_type: this.userInfo.work_type,
            user_name: this.userInfo.name,
            user_id: this.userInfo.id,
            status_many: this.orderData.status_many,
            order_status: this.orderData.order_status
          };
          this.$http
            .post("/jyclient/api/order/addStatusDtl", params)
            .then(res => {
              this.$toast(res.data);
              this.getOrderItem();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style scoped>
.orderInput {
  display: block;
  height: 0.5rem;
  width: 100%;
  text-align: right;
  font-size: 0.56rem;
  color: #f5871f;
}
.qdBtn {
  width: 80%;
  margin: 1rem auto;
  display: block;
}
</style>