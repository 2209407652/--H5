<script>
	export default {
		onLaunch: function() {},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="less">
	@import '@/common/iconfont.css';

	/*每个页面公共css */
	.container {
		width: 100%;
		height: calc(100vh - 75px);
		overflow: hidden;

		scroll-view {
			height: 100%;
		}
	}

	// 模糊背景
	.fixbg {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-size: cover;
		background-position: center 0;
		filter: blur(20px);
		transform: scale(1.2);
	}
</style>
