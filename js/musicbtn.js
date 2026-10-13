/* 背景音乐按钮（右上角 ≡ 下方）：状态以均衡器动画呈现——播放中=红色跳动，未播放=灰色静止 */
(function () {
	'use strict';
	var btns = document.querySelectorAll('[data-music-btn]');
	if (!btns.length) return;
	function paint() {
		var playing = !!(window.BGM && window.BGM.isPlaying());
		btns.forEach(function (b) { b.classList.toggle('on', playing); });
	}
	btns.forEach(function (b) {
		b.addEventListener('click', function () {
			if (!window.BGM) return;
			var on = window.BGM.toggle();
			if (window.DoomsdayToast) {
				window.DoomsdayToast(on ? '音乐开 · Music on' : '音乐关 · Music off');
			}
			paint();
		});
	});
	document.addEventListener('doomsday:bgmchange', paint);
	paint();
})();
