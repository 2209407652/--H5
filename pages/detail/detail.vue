<template>
	<view class="detail">
		<view class="fixbg" :style="'background-image: url(' + songDetail.al.picUrl + ')'"></view>
		<!-- 导航条 -->
		<MusicHead :title="songDetail.name" :icon="true" text-color="#fff"></MusicHead>
		<!-- 主容器 - 可以滑动 -->
		<view class="container" v-show="!loading">
			<scroll-view scroll-y="true">
				<!-- 播放图标 -->
				<view class="detail-play">
					<image :class="{ rotate: isRotate }" :src="songDetail.al.picUrl"></image>
					<text class="iconfont" :class="isPlay" @tap="handleToPlay"></text>
					<view></view>
				</view>
				<!-- 歌词 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap"
						:style="'transform: translateY(' + -((currentLyric-1) * 82) + 'rpx)'">
						<view class="detail-lyric-item" :class="{ active: currentLyric === index }"
							v-for="(item, index) in songLyric" :key="index">
							{{ item.lyric }}
						</view>
					</view>
				</view>
				<!-- 喜欢这首歌的人也在听 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也在听</view>
					<view class="detail-like-item" v-for="item in songSimi" :key="item.id" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>{{ item.name }}</view>
							<view>
								<image v-if="item.privilege.flag < 100" src="../../static/独家.png" mode=""></image>
								{{ item.album.artists[0].name }} - {{ item.name }}
							</view>
						</view>
						<text class="iconfont icon-24gf-playCircle"></text>
					</view>
				</view>
				<!-- 精彩评论 -->
				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<view class="detail-comment-item" v-for="(item, index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.time | formatDate }}</view>
								</view>
								<view class="detail-comment-like" :class="{like: item.liked}">
									{{ item.likedCount | formatCount  }}
									<text class="iconfont icon-good"></text>
								</view>
							</view>
							<view class="detail-comment-text">
								{{ item.content }}
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
		songDetail,
		songComment,
		songLyric,
		songSimi,
		songUrl
	} from '@/common/api.js'
	export default {
		data() {
			return {
				/* 加载 */
				loading: true,
				/* 歌曲播放图标 */
				songDetail: {
					al: {
						picUrl: ""
					}
				},
				/* 喜欢这首歌的人也在听 */
				songSimi: [],
				/* 精彩评论 */
				songComment: [],
				/* 歌词 */
				songLyric: [],
				currentLyric: 0,
				/* 背景播放 */
				isPlay: 'icon-bofang',
				isRotate: true
			}
		},
		onLoad(options) {
			this.getMusic(options.songId)
		},
		onUnload() {
			clearInterval(this.timer)
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		methods: {
			/* 获取音乐信息 */
			getMusic(songId) {
				// 根据当前的id，获取下一首播放的id
				this.$store.commit('NEXT_ID', songId)
				// 点击相似时，防止上一首歌曲播放中定时器没有清除
				clearInterval(this.timer)
				this.loading = true
				// 加载
				uni.showLoading({
					title: '加载歌曲...'
				});
				// 请求歌曲详细信息
				Promise.all([
					songDetail(songId),
					songSimi(songId),
					songComment(songId),
					songLyric(songId),
					songUrl(songId)
				]).then(res => {
					if (res[0][1].data.code === 200) {
						this.songDetail = res[0][1].data.songs[0]
					}
					if (res[1][1].data.code === 200) {
						this.songSimi = res[1][1].data.songs
					}
					if (res[2][1].data.code === 200) {
						this.songComment = res[2][1].data.hotComments
					}
					if (res[3][1].data.code === 200) {
						let lyric = res[3][1].data.lrc.lyric
						// console.log(lyric);
						let re = /\[([^\]]+)\]([^\[]+)/g
						let result = []
						lyric.replace(re, ($0, $1, $2) => {
							result.push({
								"time": this.formatTimeToSec($1),
								"lyric": $2.slice(0, -1)
							})
						})
						this.songLyric = result
					}
					if (res[4][1].data.code === 200) {

						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						// #endif

						// #ifdef H5
						if (!this.bgAudioManager) {
							this.bgAudioManager = uni.createInnerAudioContext();
						}

						this.isPlay = 'icon-zanting'
						this.isRotate = false
						// #endif

						this.bgAudioManager.src = res[4][1].data.data[0].url
						this.bgAudioManager.onPlay(() => {
							this.isPlay = 'icon-bofang'
							this.isRotate = true
							// 滚动歌词
							this.scrollLyric()
						})
						this.bgAudioManager.onPause(() => {
							this.isPlay = 'icon-zanting'
							this.isRotate = false
							clearInterval(this.timer)
						})
						// 自然播放结束
						this.bgAudioManager.onEnded(() => {
							if (this.$store.state.nextId) {
								this.getMusic(this.$store.state.nextId)
							}
						})
					}
					// 加载完毕
					this.loading = false
					uni.hideLoading();
				})
			},
			formatTimeToSec(time) {
				const arr = time.split(':')
				const result = (Number(arr[0] * 60) + Number(arr[1])).toFixed(1)
				return Number(result)
			},
			/* 暂停播放 */
			handleToPlay() {
				if (this.bgAudioManager.paused) {
					this.bgAudioManager.play()
					this.scrollLyric()
				} else {
					this.bgAudioManager.pause()
					clearInterval(this.timer)
				}
			},
			/* 监听歌词滚动 */
			scrollLyric() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					for (let i = 0; i < this.songLyric.length; i++) {
						if (this.bgAudioManager.currentTime >= this.songLyric[this.songLyric.length - 1].time) {
							this.currentLyric = this.songLyric.length - 1
							break
						}
						if (this.bgAudioManager.currentTime + 0.2 >= this.songLyric[i].time && this.bgAudioManager
							.currentTime < this.songLyric[i + 1].time) {
							this.currentLyric = i
						}
					}
				}, 500)
			},
			handleToSimi(id) {
				// 获取相似歌曲
				this.getMusic(id)
			}
		},
		components: {
			MusicHead
		}
	}
</script>

<style scoped lang="less">
	@keyframes move {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background-image: url(~@/static/disc.png);
		background-size: cover;
		margin: 214rpx auto 0px auto;
		position: relative;

		image {
			width: 370rpx;
			height: 370rpx;
			border-radius: 50%;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			animation: 30s linear move infinite;
			animation-play-state: paused;

			&.rotate {
				animation-play-state: running;
			}
		}

		text {
			width: 100rpx;
			height: 100rpx;
			font-size: 100rpx;
			color: #fff;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			color: #e4e4e4;
			box-shadow: 0px 0px 20rpx #efefef;
			border-radius: 50%;
		}

		view {
			width: 230rpx;
			height: 360rpx;
			background-image: url(~@/static/needle.png);
			background-size: cover;
			position: absolute;
			left: 100rpx;
			right: 0;
			top: -200rpx;
			margin: auto;
		}
	}

	.detail-lyric {
		width: 90vw;
		margin: 40rpx auto;
		border-radius: 30rpx;
		background-color: rgba(0, 0, 0, 0.6);
		box-shadow: 0px 10rpx 30rpx #000;
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
		color: #6f6e73;

		.detail-lyric-wrap {
			transition: 0.5s all;

			.detail-lyric-item {
				height: 82rpx;
			}

			.active {
				color: #fff;
				font-size: 37rpx;
			}
		}
	}

	.detail-like {
		margin: 0px 30rpx;

		.detail-like-head {
			font-size: 36rpx;
			color: #fff;
			margin: 50rpx 0px;
		}

		.detail-like-item {
			display: flex;
			align-items: center;
			margin-bottom: 28rpx;

			.detail-like-img {
				width: 82rpx;
				height: 82rpx;
				border-radius: 20rpx;
				overflow: hidden;
				margin-right: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.detail-like-song {
				flex: 1;

				view {
					color: #fff;

					&:nth-child(1) {
						font-size: 28rpx;
						margin-bottom: 12rpx;
					}

					&:nth-child(2) {
						font-size: 22rpx;
						color: #c6c2bf;
					}

				}

				image {
					width: 26rpx;
					height: 20rpx;
					margin-right: 10rpx;
				}
			}

			text {
				font-size: 50rpx;
				color: #c6c2bf;
			}
		}
	}

	.detail-comment {
		margin: 0px 30rpx;

		.detail-comment-head {
			font-size: 36rpx;
			color: #fff;
			margin: 50rpx 0px;
		}

		.detail-comment-item {
			margin-bottom: 28rpx;
			display: flex;

			.detail-comment-img {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 18rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.detail-comment-content {
				flex: 1;
				color: #cbcacf;

				.detail-comment-title {
					display: flex;
					justify-content: space-between;

					.detail-comment-name {

						view {
							&:nth-child(1) {
								font-size: 26rpx;
							}

							&:nth-child(2) {
								font-size: 20rpx;
							}
						}
					}

					.detail-comment-like {
						font-size: 28rpx;

						&.like {
							color: #ff0000;
						}
					}
				}

				.detail-comment-text {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #fff;
					margin-top: 20rpx;
					border-bottom: 5rpx solid #e0e0e0;
					padding-bottom: 40rpx;
				}
			}
		}
	}
</style>
