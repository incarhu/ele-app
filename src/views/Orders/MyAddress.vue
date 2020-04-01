<template>
	<div class="myAddress">
		<Header title="我的地址" :isLeft="true" @back="back" />

		<div class="address-view">
			<div class="address-card" v-for="(item, index) in allAddress" :key="index">
				<div class="address-card-select">
					<i class="fa fa-check-circle" v-if="selectIndex==index"></i>
				</div>
				<div class="address-card-body" @click="setAddressInfo(item, index)">
					<p class="address-card-title">
						<span class="username">{{item.name}}</span>
						<span class="gender" v-if="item.sex">{{item.sex}}</span>
						<span class="phone">{{item.address}}</span>
					</p>
					<p class="address-card-address">
						<span class="tag" v-if="item.tag">{{item.tag}}</span>
						<span class="address-text">{{item.address}}</span>
					</p>
				</div>
				<div class="address-card-edit">
					<i class="fa fa-edit" @click="handleEdit(item)"></i>
					<i class="fa fa-close" @click="handleDelete(item, index)"></i>
				</div>
			</div>
		</div>

		<!-- 新增收货地址 -->
		<div class="address-view-bottom" @click="handleAddAddress">
			<i class="fa fa-plus-circle"></i>
			<span>新增收货地址</span>
		</div>
	</div>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
	data() {
		return {
			allAddress: [],
			selectIndex: 0
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => vm.getData())
	},
	methods: {
		getData() {
			const id = JSON.parse(localStorage.getItem('ele_login')).userId
			this.$axios.post(`/api/user/add_address/${id}`, this.addressInfo)
			.then(res => {
				res.data.myAddress.filter(item=> {
					if(item.name) {
						this.allAddress.push(item)
					}
				})
			})
		},

		handleEdit(item) {
			this.$router.push({
				name: 'addAddress',
				params: {
					title: '编辑地址',
					addressInfo: item
				}
			})
		},

		handleDelete(item, index) {
			const id = JSON.parse(localStorage.getItem('ele_login')).userId
			this.$axios.delete(`/api/user/address/${id}/${item._id}`).then(res=> {
				this.allAddress.splice(index, 1)
			})
		},

		// 点击新增收货地址
		handleAddAddress() {
			this.$router.push({
				name: 'addAddress',
				params: {
					title: '添加地址',
					addressInfo: {
						name: '',
						sex: '',
						phone: '',
						address: '',
						bottom: '',
						tag: ''
					}
				}
			})
		},

		setAddressInfo(address, index) {
			this.selectIndex = index
			// 将address对象存储到vuex
			this.$store.dispatch("setUserInfo", address)
			this.$router.push("/settlement")
		},

		back() {
			this.$router.go(-1)
		}
	},
	components: {
		Header
	}
}
</script>

<style scoped>
.myAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}

.address-view-bottom {
  position: fixed;
  height: 13.866667vw;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 0.266667vw solid #ddd;
  color: #3190e8;
  font-size: 1rem;
}
.address-view-bottom > i {
  font-size: 1.3rem;
  margin-right: 8px;
}

.address-view {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 13.866667vw;
}
.address-card {
  background-color: #fff;
  padding: 4vw;
  border-bottom: 1px solid #ddd;
  display: flex;
  min-height: 18.133333vw;
}
.address-card-body {
  flex: 1;
  overflow: hidden;
}
.address-card-title {
  font-size: 1rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 1.066667vw;
}
.address-card-title .username {
  color: #333;
  font-weight: 700;
}
.address-card-title .gender {
  padding: 0 1.6vw 0 0.8vw;
}
.address-card-address {
  color: #666;
  font-size: 0.84rem;
  display: flex;
  align-items: center;
}
.address-card-address .tag {
  display: inline-block;
  position: relative;
  margin-right: 0.8vw;
  padding: 0.533333vw;
  color: #ff5722;
  white-space: nowrap;
  border: 1px solid #ff5722;
  border-radius: 0.133333vw;
  font-size: 0.6rem !important;
  line-height: 2.666667vw;
}
.address-text {
  line-height: 4.533333vw;
}

/* 编辑和删除 */
.address-card-edit {
  flex-basis: 13.066667vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.address-card-edit > i {
  color: #aaa;
  font-size: 1.2rem;
}

.address-card-select {
  flex-basis: 7.333333vw;
  min-width: 7.333333vw;
  display: flex;
  align-items: center;
}
.address-card-select > i {
  font-size: 1.5rem;
  color: #4cd964;
}
</style>