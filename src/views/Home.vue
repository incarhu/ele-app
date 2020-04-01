<template>
	<div class="home">
		<div class="header">
			<div class="address_map" @click="handleAddress">
				<i class="fa fa-map-marker"></i>
				<span>{{address}}</span>
				<!-- <i class="fa fa-sort-desc"></i> -->
			</div>
		</div>
		<div class="search_wrap" :class="{'fixed-view': showFilter}" @click="search">
			<div class="shop_search">
				<i class="fa fa-search"></i>
				搜索商家 商家名称
			</div>
		</div>
		<div class="container">
			<!-- 轮播 -->
			<mt-swipe :auto="4000" class="swiper">
				<mt-swipe-item v-for="(item, index) in swiperImgs" :key="index">
					<img :src="item" />
				</mt-swipe-item>
			</mt-swipe>
			<!-- 分类 -->
			<mt-swipe :auto="0" class="entries">
				<mt-swipe-item v-for="(entry,i) in entries" :key="i" class="entry_wrap">
				<div class="foodentry" v-for="(item,index) in entry" :key="index">
					<div class="img_wrap">
						<img :src="item.image" alt>
					</div>
					<span>{{item.name}}</span>
				</div>
				</mt-swipe-item>
			</mt-swipe>
		</div>
		<!-- 推荐商家 -->
    	<div class="shoplist-title">推荐商家</div>

		<!-- 导航 -->
		<FilterView :filterData="filterData" @searchFixed="showFilterView" @update="update" />

		<!-- 商家信息 -->
		<mt-loadmore :top-method="loadData" :bottom-method="loadMore" :bottom-all-loaded="allLoaded" :auto-fill="false" :bottomPullText="bottomPullText" ref="loadmore">
			<div class="showlist">
				<IndexShop v-for="(item, index) in restaurants" :key="index" :restaurant="item.restaurant" />
			</div>
		</mt-loadmore>
	</div>
</template>

<script>
import { Swipe, SwipeItem, Loadmore } from 'mint-ui';
import FilterView from '@/components/FilterView.vue'
import IndexShop from '@/components/IndexShop.vue'
export default {
	name: "home",
	data() {
		return {
			swiperImgs: [],
			entries: [],
			filterData: null,
			showFilter: false,
			page: 1,
			size: 5,
			restaurants: [],	// 商家信息数据
			allLoaded: false,
			bottomPullText: '上拉加载更多',
			data: null
		}
	},
	computed: {
		address() {
			return this.$store.getters.address
		},
		city() {
			return (
				this.$store.getters.location.addressComponent.district ||
				this.$store.getters.location.addressComponent.province
			)
		}
	},
	created() {
		this.getData()
	},
	methods: {
		// 点击地址
		handleAddress() {
			this.$router.push({name: 'address',params: {city: this.city}})
		},

		// 轮播
		getData() {
			this.$axios.get('/api/profile/shopping').then(res=> {
				this.swiperImgs = res.data.swipeImgs
				this.entries = res.data.entries
			})

			this.$axios.get('/api/profile/filter').then(res=> {
				this.filterData = res.data
			})

			this.loadData()
		},		

		loadData() {
			this.page = 1
			this.allLoaded = false
			this.bottomPullText = '上拉加载更多'
			// 获取商家信息
			this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`, this.data).then(res=> {
				this.$refs.loadmore.onTopLoaded()
				this.restaurants = res.data
			})
		},

		loadMore() {
			if(!this.allLoaded) {
				this.page++
				this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`).then(res=> {
					this.$refs.loadmore.onBottomLoaded()
					if(res.data.length) {
						res.data.forEach(item=> {
							this.restaurants.push(item)
						})
						if(res.data < this.size) {
							this.allLoaded = true
							this.bottomPullText = '没有更多数据了'
						}
					} else {
						this.allLoaded = true
						this.bottomPullText = '没有更多数据了'
					}
				})
			}
		},

		// 搜索框是否置顶
		showFilterView(isShow) {
			this.showFilter = isShow
		},

		// 更新数据
		update(condition) {
			// console.log(condition)
			this.data = condition
			this.loadData()
		},

		// 搜索
		search() {
			this.$router.push({path: '/search'})
		}
	},
	components: {
		Swipe, SwipeItem, Loadmore,
		FilterView,
		IndexShop
	}
}
</script>

<style scoped>
.home {
	width: 100%;
	height: 100%;
	overflow: auto;
	box-sizing: border-box;
}
.header, .search_wrap {
	background-color: #009eef;
	padding: 10px 16px;
}
.header .address_map {
	color: #fff;
	font-weight: bold;
}
.address_map i {
	margin: 0 3px;
	font-size: 18px;
}
.address_map span {
	display: inline-block;
	width: 80%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.search_wrap .shop_search {
	background-color: #fff;
	padding: 10px 0;
	border-radius: 4px;
	text-align: center;
	color: #aaa;
}
.search_wrap {
	position: sticky;
	top: 0;
	z-index: 999;
	box-sizing: border-box;
}
.container .swiper {
	height: 100px;
}
.swiper img {
	width: 100%;
	height: 100px;
}

.entries {
	background: #fff;
	height: 47.2vw;
	text-align: center;
	overflow: hidden;
}
.foodentry {
	width: 20%;
	float: left;
	position: relative;
	margin-top: 2.933333vw;
}
.foodentry .img_wrap {
	position: relative;
	display: inline-block;
	width: 12vw;
	height: 12vw;
}
.img_wrap img {
	width: 100%;
	height: 100%;
}
.foodentry span {
	display: block;
	color: #666;
	font-size: 0.32rem;
}
/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.shoplist-title:after,
.shoplist-title:before {
  display: block;
  content: "一";
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title:before {
  margin-right: 3.466667vw;
}
.shoplist-title:after {
  margin-left: 3.466667vw;
}

.fixed-view {
	position: fixed;
	top: 0;
	z-index: 999;
	width: 100%;
}

.mint-loadmore {
	height: calc(100% - 95px);
	overflow: auto;
}
</style>
