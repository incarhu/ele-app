<template>
	<div class="settlement">
		<Header title="确认订单" :isLeft="true" @back="back" />
		<div class="view-body" v-if="orderInfo">
			<div class="">
				<!-- 收货地址 -->
				<section class="cart-address">
					<p class="title">订单配送至
						<span class="address-tag" v-if="userInfo && userInfo.tag">{{userInfo.tag}}</span>
					</p>
					<p class="address-detail">
						<span v-if="userInfo" @click="handleMyAddress">{{userInfo.address}}{{userInfo.bottom}}</span>
						<span v-else>
							<span v-if="haveAddress" @click="selectAddress">选择收货地址</span>
							<span v-else @click="addAddress">新增收货地址</span>
						</span>
						<i class="fa fa-angle-right"></i>
					</p>
					<h2 v-if="userInfo" class="address-name">
						<span>{{userInfo.name}}</span>
						<span v-if="userInfo.sex">（{{userInfo.sex}}）</span>
						<span class="phone">{{userInfo.phone}}</span>
					</h2>
				</section>

				<!-- 送达时间 -->
				<Delivery :shopInfo="orderInfo.shopInfo" />

				<!-- 点餐内容 -->
				<CartGroup :orderInfo="orderInfo" :totalPrice="totalPrice" />

				<!-- 备注信息 -->
				<section class="checkout-section">
					<CartItem title="餐具份数" :subHead="remarkInfo.tableware || '未选择'" @click="showTableWare = true" />
					<CartItem title="订单备注" :subHead="remarkInfo.remark || '口味偏好'" @click="toRemark" />
					<CartItem title="发票信息" subHead="不需要开发票" :showArrow="false" />
				</section>

				<!-- 显示餐具tableware -->
				<Tableware :isShow="showTableWare" @close="showTableWare = false" />
			</div>
		</div>

		<!-- 底部 -->
		<footer class="action-bar">
			<span>￥{{totalPrice}}</span>
			<button @click="handlePay">去支付</button>
		</footer>
	</div>
</template>

<script>
import Header from '@/components/Header.vue'
import Delivery from '@/components/Orders/Delivery.vue'
import CartGroup from '@/components/Orders/CartGroup.vue'
import CartItem from '@/components/Orders/CartItem.vue'
import Tableware from '@/components/Orders/Tableware.vue'
import {Toast} from 'mint-ui'
export default {
	data() {
		return {
			haveAddress: false,
			showTableWare: false
		}
	},
	computed: {
		userInfo() {
			return this.$store.getters.userInfo
		},
		orderInfo() {
			return this.$store.getters.orderInfo
		},
		totalPrice() {
			return this.$store.getters.totalPrice
		},
		remarkInfo() {
			return this.$store.getters.remarkInfo
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if(!vm.userInfo) vm.getData()
		});
	},
	methods: {
		addAddress() {
			this.$router.push({
				name: "addAddress",
				params: {
					title: "添加地址",
					addressInfo: {
						name: "",
						sex: "",
						phone: "",
						address: "",
						bottom: "",
						tag: ""
					}
				}
			})
		},

		getData() {
			const id = JSON.parse(localStorage.getItem('ele_login')).userId
			this.$axios(`/api/user/user_info/${id}`).then(res => {
				if (res.data.myAddress.length) {
					this.haveAddress = true
				} else {
					this.haveAddress = false
				}
			});
		},

		// 跳转选择收货地址
		selectAddress() {
			this.$router.push({path: '/myAddress'})
		},

		handleMyAddress() {
			this.$router.push({path: '/myAddress'})
		},

		// 订单备注
		toRemark() {
			this.$router.push({path: '/remark'})
		},

		// 去支付
		handlePay() {
			if(!this.userInfo) {
				Toast({
					message: '请选择收货地址',
					position: 'bottom',
					duration: 2000
				})
				return
			}
			this.$router.push({path: '/pay'})
		},

		back() {
			this.$router.go(-1)
		}
	},
	components: {
		Header,
		Delivery,
		CartGroup,
		CartItem,
		Tableware
	}
}
</script>

<style scoped>
.settlement {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 44px;
}

.view-body {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  font-size: 0.9rem;
  color: #333;
  padding-bottom: 14.133333vw;
  padding-left: 1.6vw;
  padding-right: 1.6vw;
  background-image: linear-gradient(
      0deg,
      #f5f5f5,
      #f5f5f5 65%,
      hsla(0, 0%, 96%, 0.3) 75%,
      hsla(0, 0%, 96%, 0)
    ),
    linear-gradient(270deg, #009eef, #009eef);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.cart-address {
  background-color: transparent;
  padding: 4.266667vw 2.133333vw 2.933333vw 2.133333vw;
  min-height: 22.133333vw;
  color: #fff;
  overflow: hidden;
}
.cart-address .title {
  font-size: 0.9rem;
  line-height: 1.21;
  color: hsla(0, 0%, 100%, 0.8);
}
.cart-address .address-detail {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.88;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.address-detail > span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 4vw);
}
.address-detail > i {
  margin-left: 2.133333vw;
}

.address-name {
  font-size: 0.86rem;
  line-height: 1.21;
  margin-bottom: 1.333333vw;
}
.address-name .phone {
  margin-left: 2.133333vw;
}
.address-tag {
  border: 0.133334vw solid hsla(0, 0%, 100%, 0.8);
  margin-left: 1.6vw;
  display: inline-block;
  padding: 0.533333vw;
  white-space: nowrap;
  border-radius: 0.133333vw;
  font-size: 0.6rem !important;
  line-height: 2.666667vw;
}

.checkout-section {
  margin-bottom: 2.133333vw;
  padding: 0 5.333333vw;
  background: #fff;
  box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
}

/* 底部支付样式 */
.action-bar {
  height: 11.733333vw;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #3c3c3c;
  z-index: 2;
}
.action-bar > span {
  color: #fff;
  font-size: 1.2rem;
  line-height: 11.733333vw;
  padding-left: 2.666667vw;
  vertical-align: middle;
}
.action-bar > button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: #00e067;
  min-width: 28vw;
  padding: 0 1.333333vw;
  border: none;
  color: #fff;
  font-size: 1.2rem;
}

.checkout-section {
  margin-bottom: 2.133333vw;
  padding: 0 5.333333vw;
  background: #fff;
  box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
}

.action-bar {
  height: 11.733333vw;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #3c3c3c;
  z-index: 2;
}
.action-bar > span {
  color: #fff;
  font-size: 1.2rem;
  line-height: 11.733333vw;
  padding-left: 2.666667vw;
  vertical-align: middle;
}
.action-bar > button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: #00e067;
  min-width: 28vw;
  padding: 0 1.333333vw;
  border: none;
  color: #fff;
  font-size: 1.2rem;
}
</style>