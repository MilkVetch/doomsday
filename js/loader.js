/* 入场加载：预载封面 + 背景音乐（流式：缓冲数秒即放行，进站边播边下），就绪后点击「进入」开播音乐 */
(function () {
	'use strict';
	var loader = document.getElementById('loader');
	if (!loader) return;
	var fill = document.getElementById('loaderFill');
	var pctEl = document.getElementById('loaderPct');
	var statusEl = document.getElementById('loaderStatus');
	var enterBtn = document.getElementById('loaderEnter');
	var BASE = window.DOOMSDAY_BASEURL || '';

	/* 深链 #rN 直达阅读时不拦路 */
	if (/^#r\d+$/.test(location.hash)) { loader.remove(); return; }

	document.body.style.overflow = 'hidden';

	/* 权重：封面 20 · 音乐 60 · 页面 20 */
	var parts = { cover: 0, music: 0, page: 0 };
	var ready = false;
	function paint() {
		var p = Math.min(100, Math.round(parts.cover * 20 + parts.music * 60 + parts.page * 20));
		if (fill) fill.style.width = p + '%';
		if (pctEl) pctEl.textContent = p + '%';
		if (p >= 100) setReady(false);
	}
	function setStatus(zh, en) {
		if (!statusEl) return;
		statusEl.innerHTML = '<span class="t-zh">' + zh + '</span><span class="t-en">' + en + '</span>';
	}
	function setReady(slow) {
		if (ready) return;
		ready = true;
		if (fill) fill.style.width = '100%';
		if (pctEl) pctEl.textContent = '100%';
		setStatus(slow ? '网络较慢，可先进入' : '解密完成', slow ? 'Slow network — enter anyway' : 'Decryption complete');
		if (enterBtn) enterBtn.classList.add('ready');
	}

	/* 封面预载 */
	var cover = new Image();
	cover.onload = cover.onerror = function () { parts.cover = 1; paint(); };
	cover.src = BASE + '/img/secretfiles.jpg';

	/* 音乐预载（流式放行）：与 dna.js 共用同一 <audio> 元素，只下载一次；
	   缓冲够播（canplay）或已缓冲 ≥6 秒即满格；最迟 5 秒也放行，余下进站后边播边下 */
	function trackAudio() {
		if (!window.BGM || !window.BGM.el) { setTimeout(trackAudio, 120); return; }
		var a = window.BGM.el();
		var t0 = Date.now();
		function upd() {
			try {
				if (a.readyState >= 3) { parts.music = 1; }
				else if (a.duration > 0 && a.buffered.length) {
					var ahead = a.buffered.end(a.buffered.length - 1) - a.currentTime;
					if (ahead >= 6) parts.music = 1;
					else parts.music = Math.min(0.92, a.buffered.end(a.buffered.length - 1) / a.duration);
				}
				if (parts.music < 1 && Date.now() - t0 >= 5000) parts.music = 1;
			} catch (e) {}
			paint();
		}
		['progress', 'canplay', 'canplaythrough', 'loadedmetadata'].forEach(function (ev) {
			a.addEventListener(ev, upd);
		});
		setInterval(upd, 600);
		upd();
	}
	trackAudio();

	if (document.readyState === 'complete') { parts.page = 1; paint(); }
	else window.addEventListener('load', function () { parts.page = 1; paint(); });

	/* 兜底：10 秒后无论如何放行 */
	setTimeout(function () { if (!ready) setReady(true); }, 10000);

	enterBtn.addEventListener('click', function () {
		document.body.style.overflow = '';
		loader.classList.add('done');
		if (window.BGM) window.BGM.play();
		setTimeout(function () { loader.remove(); }, 800);
	});
})();
