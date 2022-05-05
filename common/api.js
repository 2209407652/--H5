import {
	baseURL
} from './config.js'

/**
 * 获取排行榜榜单
 */
export function topList() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseURL}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				const result = res.data.list
				result.length = 4
				resolve(result)
			},
			fail: () => {},
			complete: () => {}
		});
	})
}

/**
 * 获取榜单详细信息
 * @param { String } id 榜单ID
 */
export function list(id) {
	return uni.request({
		url: `${baseURL}/playlist/detail?id=${id}`,
		method: 'GET',
	});
}

/**
 * 获取歌曲详细信息 - /song/detail?ids=***
 * @param { String } songId 
 */
export function songDetail(songId) {
	return uni.request({
		url: `${baseURL}/song/detail?ids=${songId}`,
		method: 'GET',
	});
}

/**
 * 获取相似歌曲信息 - /simi/song?id=***
 * @param { String } songId 
 */
export function songSimi(songId) {
	return uni.request({
		url: `${baseURL}/simi/song?id=${songId}`,
		method: 'GET',
	});
}

/**
 * 获取歌曲评论 - /comment/music?id=***
 * @param { String } songId 
 */
export function songComment(songId) {
	return uni.request({
		url: `${baseURL}/comment/music?id=${songId}`,
		method: 'GET',
	});
}

/**
 * 获取歌曲歌词 - /lyric?id=***
 * @param { String } songId 
 */
export function songLyric(songId) {
	return uni.request({
		url: `${baseURL}/lyric?id=${songId}`,
		method: 'GET',
	});
}

/**
 * 获取歌曲链接 - /song/url?id=***
 * @param { String } songId 
 */
export function songUrl(songId) {
	return uni.request({
		url: `${baseURL}/song/url?id=${songId}`,
		method: 'GET',
	});
}

/**
 * 热搜榜详情 - /search/hot/detail
 */
export function searchHot() {
	return uni.request({
		url: `${baseURL}/search/hot/detail`,
		method: 'GET',
	});
}

/**
 * 获取关键字搜索结果 - /search?keywords=***
 * @param { String } word 
 */
export function searchWord(word) {
	return uni.request({
		url: `${baseURL}/search?keywords=${word}`,
		method: 'GET',
	});
}

/**
 * 获取搜索关键词的搜索建议
 * @param { String } word 
 */
export function searchSuggest(word) {
	return uni.request({
		url: `${baseURL}/search/suggest?keywords=${word}&type=mobile`,
		method: 'GET',
	});
}
