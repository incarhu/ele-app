<template>
	<div class="addAddress">
		<Header :title="title" :isLeft="true" @back="back" />
		<!-- 添加地址 -->
		<div class="viewbody">
			<div class="content">
				<FormBlock label="联系人" placeholder="姓名" :sexs="sexs" @checkSex="checkSex" :sex="addressInfo.sex" v-model="addressInfo.name" />
				<FormBlock label="电话" placeholder="手机号码" v-model="addressInfo.phone" />
				<FormBlock label="地址" placeholder="小区/写字楼/公司" icon="angle-right" @click="showSearch = true" v-model="addressInfo.address" />
				<FormBlock label="门牌号" placeholder="10号楼5单元" icon="edit" textarea="textarea" v-model="addressInfo.bottom" />
				<div class="formblock">
					<div class="label-wrap">标签</div>
					<Tag :tags="tags" @handleSelect="handleSelect" :selectTag="addressInfo.tag" />
				</div>
			</div>
			<!-- 确定 -->
			<div class="form-button-wrap">
				<button class="form-button" @click="handleSave">确定</button>
			</div>
		</div>

		<!-- 搜索地址 -->
		<AddressSearch :showSearch="showSearch" @close="showSearch = false" :addressInfo="addressInfo" />
	</div>
</template>

<script>
import Header from '@/components/Header.vue'
import FormBlock from '@/components/Orders/FormBlock.vue'
import Tag from '@/components/Orders/Tag.vue'
import AddressSearch from '@/components/Orders/AddressSearch.vue'
import { Toast } from "mint-ui"
export default {
	data() {
		return {
			title: '',
			tags: ['家', '公司', '学校'],
			sexs: ['先生', '女士'],
			addressInfo: {},
			showSearch: false
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm=> {
			vm.addressInfo = to.params.addressInfo
			vm.title = to.params.title
		})
	},
	methods: {
		handleSelect(item) {
			this.addressInfo.tag = item
		},

		checkSex(item) {
			this.addressInfo.sex = item
		},
		back() {
			this.$router.go(-1)
		},

		handleSave() {
			if(!this.addressInfo.name) {
				this.showMsg("请输入联系人")
				return
			}

			if(!this.addressInfo.phone) {
				this.showMsg("请输入手机号")
				return
			}

			if(!this.addressInfo.address) {
				this.showMsg("请输入收货地址")
				return
			}

			if(this.addressInfo.title == '添加地址') {
				this.addAddress()
			} else {
				this.editAddress()
			}
		},

		showMsg(msg) {
			Toast({
				message: msg,
				position: "bottom",
				duration: 2000
			})
		},

		// 添加地址
		addAddress() {
			const id = JSON.parse(localStorage.getItem('ele_login')).userId
			this.$axios.post(`/api/user/add_address/${id}`, this.addressInfo)
			.then(res => {
				if(!this.$store.getters.userInfo) {
					this.$store.dispatch('setUserInfo', this.addressInfo)
				}
				this.$router.push({path: '/myAddress'})
			})
		},

		// 编辑地址
		editAddress() {
			const id = JSON.parse(localStorage.getItem('ele_login')).userId
			this.$axios.post(`/api/user/edit_address/${id}/${this.addressInfo._id}`, this.addressInfo)
			.then(res => {
				this.$router.push({path: '/myAddress'})
			})
		}
	},
	components: {
		Header,
		FormBlock,
		Tag,
		AddressSearch
	}
}
</script>

<style scoped>
.addAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.viewbody {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.content {
  padding-left: 4vw;
  background: #fff;
  font-size: 0.94rem;
}

.formblock {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
}
.formblock .label-wrap {
  flex-basis: 17.333333vw;
  padding: 3.733333vw 0;
  line-height: 4.8vw;
  color: #333;
  font-weight: 700;
}

.form-button-wrap {
  padding: 5.333333vw 4vw;
  display: flex;
}
.form-button-wrap .form-button {
  background: #00d762;
  text-align: center;
  border-radius: 0.533333vw;
  flex: 1;
  font-size: 1.1rem;
  line-height: 5.066667vw;
  color: #fff;
  padding: 3.333333vw 0;
  border: none;
  font-weight: 500;
}
</style>