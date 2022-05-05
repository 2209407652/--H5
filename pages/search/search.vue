<template>
	<view class="search">
		<!-- 导航条 -->
		<MusicHead title="搜索" :icon="true" :icon-color-black="true"></MusicHead>
		<!-- 滚动容器 -->
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="search-search">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" v-model="searchKeyWord" placeholder="搜索歌曲"
						@confirm="handleToSearch(searchKeyWord)" @input="handleToSuggest" />
					<text v-show="searchKeyWord" class="iconfont icon-guanbi" @tap="handleToClearWord"></text>
				</view>
				<!-- searchType = 1 -->
				<view v-if="searchType === 1">
					<!-- 历史搜索 -->
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text v-if="searchHistory.length" class="iconfont icon-icon" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view class="search-history-tag" v-for="(item, index) in searchHistory" :key="index"
								@tap="handleToHistory(item)">{{ item }}
							</view>
						</view>
					</view>
					<!-- 热搜榜 -->
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-item" v-for="(item, index) in searchHot" :key="index"
							@tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">{{ index + 1 }}</view>
							<view class="search-hot-word">
								<view>
									{{ item.searchWord }}
									<image v-if="item.iconUrl" :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>{{ item.content }}</view>
							</view>
							<text class="search-hot-count">{{ item.score }}</text>
						</view>
					</view>
				</view>
				<!-- searchType = 2 -->
				<view v-else-if="searchType === 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item, index) in searchList" :key="item.id"
							@tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.name }} - {{ item.artists[0].name }}</view>
							</view>
							<text class="iconfont icon-24gf-playCircle"></text>
						</view>
					</view>
				</view>
				<!-- searchType = 3 -->
				<view v-else-if="searchType === 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{ searchKeyWord }}”</view>
						<view class="search-suggest-item" v-for="(item, index) in searchSuggestList" :key="index" @tap="handleSuggest(item.keyword)">
							<text class="iconfont icon-fangdajing"></text> {{ item.keyword }}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHead from '@/components/music-head/music-head.vue'
	import {
		searchHot,
		searchWord,
		searchSuggest
	} from '@/common/api.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchKeyWord: '',
				searchHistory: [],
				searchType: 1,
				searchList: [],
				searchSuggestList: []
			};
		},
		onLoad() {
			searchHot().then(res => {
				if (res[1].data.code === 200) {
					this.searchHot = res[1].data.data
				}
			})
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data
				}
			});
		},
		methods: {
			handleToWord(word) {
				this.searchKeyWord = word
			},
			handleToSearch(word) {
				// 先搜索
				this.getSearchList(word)
				const index = this.searchHistory.indexOf(word)
				if (index !== -1) return
				this.searchHistory.unshift(word) // 插入开头
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
			},
			handleToHistory(word) {
				this.searchKeyWord = word
				this.getSearchList(word)
			},
			handleToClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				});
			},
			handleToClearWord() {
				this.searchKeyWord = ''
				this.searchType = 1
			},
			getSearchList(word) {
				searchWord(word).then(res => {
					if (res[1].data.code === 200) {
						this.searchList = res[1].data.result.songs
						this.searchType = 2
					}
				})
			},
			handleToDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + id.toString()
				})
			},
			handleSuggest(word) {
				this.searchKeyWord = word
				this.getSearchList(word)
			},
			handleToSuggest(ev) {
				clearTimeout(this.timer)
				const value = ev.detail.value
				if (!value) {
					this.searchType = 1
					return
				}
				// 节流
				this.timer = setTimeout(() => {
					searchSuggest(value).then(res => {
						if (res[1].data.code === 200) {
							this.searchSuggestList = res[1].data.result.allMatch
							this.searchType = 3
						}
					})
				}, 800)
			}
		},
		components: {
			MusicHead
		}
	}
</script>

<style lang="less" scoped>
	.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 35rpx;

		text {
			margin: 0px 26rpx;
		}

		input {
			flex: 1;
			font-size: 26rpx;
		}
	}

	.search-history {
		margin: 0 30rpx;
		font-size: 26rpx;

		.search-history-head {
			display: flex;
			justify-content: space-between;
		}

		.search-history-list {
			margin: 36rpx 0px;
			display: flex;
			flex-wrap: wrap;

			.search-history-tag {
				margin-right: 30rpx;
				margin-bottom: 30rpx;
				padding: 16rpx 28rpx;
				border-radius: 40rpx;
				background-color: #f7f7f7;
			}
		}
	}

	.search-hot {
		margin: 0 30rpx;
		font-size: 26rpx;

		.search-hot-head {
			margin-bottom: 36rpx;
		}

		.search-hot-item {
			display: flex;
			align-items: center;
			margin-bottom: 58rpx;

			.search-hot-top {
				color: #ff0000;
				width: 60rpx;
				margin-left: 8rpx;
			}

			.search-hot-word {
				flex: 1;

				view {
					&:nth-child(1) {
						font-size: 30rpx;
					}

					&:nth-child(2) {
						font-size: 24rpx;
						color: #878787;
					}
				}

				image {
					width: 48rpx;
					height: 34rpx;
				}
			}

			.search-hot-count {
				color: #878787;
			}
		}
	}

	.search-result {
		border-top: 4rpx solid #e4e4e4;
		padding: 30rpx;

		.search-result-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 30rpx;
			margin-bottom: 30rpx;
			border-bottom: 2rpx solid #e4e4e4;

			.search-result-word {
				view {
					&:nth-child(1) {
						font-size: 28rpx;
						color: #235790;
						margin-bottom: 12rpx;
					}

					&:nth-child(2) {
						font-size: 22rpx;
						color: #898989;
					}
				}

				text {
					font-size: 50rpx;
				}
			}
		}
	}

	.search-suggest {
		border-top: 4rpx solid #e4e4e4;
		padding: 30rpx;
		font-size: 26rpx;

		.search-suggest-head {
			color: #4574a5;
			margin-bottom: 74rpx;
		}

		.search-suggest-item {
			color: #5d5d5d;
			margin-bottom: 74rpx;

			text {
				color: #bdbdbd;
				margin-right: 28rpx;
			}
		}
	}
</style>
