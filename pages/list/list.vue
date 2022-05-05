<template>
	<view class="list">
		<view class="fixbg" :style="'background-image: url(' + playList.coverImgUrl + ')'"></view>
		<!-- 导航条 -->
		<MusicHead title="歌单" :icon="true" text-color="#fff"></MusicHead>
		<!-- 主容器 - 可以滑动 -->
		<view class="container" v-if="!loading">
			<scroll-view scroll-y="true">
				<!-- 列表头 -->
				<view class="list-head">
					<view class="list-head-img">
						<image v-if="playList.coverImgUrl" :src="playList.coverImgUrl" mode=""></image>
						<text class="iconfont icon-yousanjiao">{{ playList.playCount | formatCount }}</text>
					</view>
					<view class="list-head-text">
						<view>{{ playList.name }}</view>
						<view>
							<image :src="playList.creator.avatarUrl" mode=""></image>{{ playList.creator.nickname }}
						</view>
						<view>
							{{ playList.description }}
						</view>
					</view>
				</view>
				<!-- 列表分享 -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>分享H5页面
				</button>
				<!-- #endif -->
				<!-- 音乐列表 -->
				<view class="list-music">
					<view class="list-music-head">
						<text class="iconfont icon-bofang"></text>
						<text>播放全部</text>
						<text>(共{{ playList.trackCount }}首)</text>
					</view>
					<view class="list-music-item" v-for="(item, index) in playList.tracks" :key="index"
						@tap="handleToDetail(item.id)">
						<view class="list-music-top">{{ index + 1 }}</view>
						<view class="list-music-song">
							<view>{{ item.name }}</view>
							<view>
								<image v-if="privileges[index].flag < 100" src="../../static/独家.png" mode=""></image>
								{{ item.ar[0].name }} - {{ item.name }}
							</view>
						</view>
						<text class="iconfont icon-24gf-playCircle"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHead from '@/components/music-head/music-head.vue'
	import {
		list
	} from '@/common/api.js'
	export default {
		data() {
			return {
				playList: {
					creator: {
						avatarUrl: "",
						nickname: ""
					},
					tracks: []
				},
				privileges: [],
				// 加载
				loading: true
			}
		},
		onLoad(options) {
			// 加载
			uni.showLoading({
				title: '加载歌单...'
			});
			list(options.id).then(res => {
				if (res[1].data.code === 200) {
					this.playList = res[1].data.playlist
					this.privileges = res[1].data.privileges
					this.$store.commit('INIT_TOPLISTIDS', res[1].data.playlist.trackIds)
					uni.hideLoading()
					this.loading = false
				}
			})
		},
		methods: {
			handleToDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + id.toString()
				})
			}
		},
		components: {
			MusicHead
		}
	}
</script>

<style lang="less" scoped>
	.list-head {
		display: flex;
		margin: 30rpx;

		.list-head-img {
			width: 264rpx;
			height: 264rpx;
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;
			margin-right: 42rpx;

			image {
				width: 100%;
				height: 100%;
			}

			text {
				position: absolute;
				top: 8rpx;
				right: 8rpx;
				color: #fff;
				font-size: 26rpx;

			}
		}

		.list-head-text {
			flex: 1;

			view {
				color: #f0f2f7;

				&:nth-child(1) {
					color: #fff;
					font-size: 34rpx;
				}

				&:nth-child(2) {
					display: flex;
					align-items: center;
					margin: 20rpx 0px;

					image {
						width: 54rpx;
						height: 54rpx;
						border-radius: 50%;
						margin-right: 14rpx;
					}
				}

				&:nth-child(3) {
					line-height: 34rpx;
				}
			}
		}
	}

	.list-share {
		width: 330rpx;
		height: 74rpx;
		margin: 0px auto;
		background-color: rgba(255, 255, 255, 0.4);
		color: #fff;
		border-radius: 32rpx;
		text-align: center;
		line-height: 74rpx;
		font-size: 28rpx;

		text {
			margin-right: 16rpx;
		}
	}

	.list-music {
		background-color: #fff;
		border-radius: 50rpx;
		margin-top: 40rpx;
		overflow: hidden;

		.list-music-head {
			height: 50rpx;
			margin: 22rpx 0px 0px 22rpx;

			text {
				&:nth-child(1) {
					height: 50rpx;
					font-size: 50rpx;
					color: #ff0000;
				}

				&:nth-child(2) {
					font-size: 35rpx;
					font-weight: 700;
					margin: 0px 10rpx 0px 26rpx;
				}

				&:nth-child(3) {
					font-size: 26rpx;
					color: #b2b2b2;
				}
			}
		}

		.list-music-item {
			display: flex;
			margin: 66rpx 32rpx 66rpx 46rpx;
			align-items: center;
			color: #959595;

			.list-music-top {
				width: 58rpx;
				line-height: 30rpx;
			}

			.list-music-song {
				flex: 1;

				view {
					&:nth-child(1) {
						font-size: 35rpx;
						color: #000;
						width: 70vw;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					&:nth-child(2) {
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						width: 70vw;

						image {
							width: 32rpx;
							height: 20rpx;
							margin-right: 10rpx;
						}
					}
				}
			}

			text {
				font-size: 50rpx;
				color: #c7c7c7;
			}
		}
	}
</style>
