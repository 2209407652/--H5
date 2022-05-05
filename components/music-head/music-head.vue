<template>
	<view class="musci-head" :style="{ color: textColor }">
		<view v-if="icon" class="music-head-icon" :class="{ 'music-head-iconblack': iconColorBlack }">
			<text class="iconfont icon-zuojiantou" @tap="handleToBack"></text> | <text class="iconfont icon-shouye"
				@tap="handleToHome"></text>
		</view>
		{{ title }}
	</view>
</template>

<script>
	export default {
		name: "music-head",
		props: ['title', 'icon', 'textColor', 'iconColorBlack'],
		data() {
			return {

			};
		},
		methods: {
			handleToBack() {
				uni.navigateBack()
			},
			handleToHome() {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.musci-head {
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: #000;
		position: relative;

		.music-head-icon {
			position: absolute;
			left: 8px;
			top: 25px;
			width: 90px;
			height: 31px;
			background-color: rgba(0, 0, 0, .4);
			color: #fff;
			line-height: 31px;
			border-radius: 15px;
			display: flex;
			justify-content: space-evenly;
		}

		.music-head-iconblack {
			background-color: #fff;
			color: #000;
			border: 1px solid #eaeaea;
		}
	}
</style>
