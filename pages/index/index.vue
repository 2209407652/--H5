<template>
	<view class="index">
		<!-- 导航条 -->
		<MusicHead title="网易云音乐" :icon="false"></MusicHead>
		<!-- 歌单 -->
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" value="" placeholder="搜索歌曲" />
				</view>
				<!-- 排行榜列表 -->
				<view class="index-list">
					<view class="index-list-item" v-for="(item,index) in topList" :key="index"
						@tap="handleToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{ item.updateFrequency }}</text>
						</view>
						<view class="index-list-text">
							<view class="index-list-text-item" v-for="(subItem, index2) in item.tracks" :key="index2">
								{{ index2 + 1 }}.{{ subItem.first }} - {{ subItem.second }}
							</view>
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
		topList
	} from '@/common/api.js'
	export default {
		data() {
			return {
				topList: []
			}
		},
		onLoad() {
			// 加载
			uni.showLoading({
				title: '加载主页...'
			});
			topList().then(res => {
				if (res.length) {
					this.topList = res
					uni.hideLoading()
				}
			})
		},
		methods: {
			handleToList(id) {
				uni.navigateTo({
					url: '/pages/list/list?id=' + id.toString()
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		},
		components: {
			MusicHead
		}
	}
</script>

<style scoped lang="less">
	.index {
		.index-search {
			display: flex;
			align-items: center;
			height: 70rpx;
			margin: 70rpx 30rpx 30rpx 30rpx;
			background-color: #f7f7f7;
			border-radius: 35rpx;

			text {
				font-size: 26rpx;
				margin: 0px 28rpx;
			}

			input {
				font-size: 28rpx;
				flex: 1;
			}
		}

		.index-list {
			margin: 0 30rpx;

			.index-list-item {
				margin-bottom: 34rpx;
				display: flex;

				.index-list-img {
					width: 212rpx;
					height: 212rpx;
					position: relative;
					border-radius: 30rpx;
					overflow: hidden;
					margin-right: 22rpx;

					image {
						width: 100%;
						height: 100%;
					}

					text {
						position: absolute;
						left: 12rpx;
						bottom: 16rpx;
						color: #fff;
						font-size: 20rpx;
					}
				}

				.index-list-text {
					width: calc(100% - 212rpx);
					font-size: 24rpx;
					line-height: 66rpx;
					overflow: hidden;

					.index-list-text-item {
						// 这里为了显示省略号
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
</style>
