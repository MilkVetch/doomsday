/* 阅读页：小球展开 → 章节内容（取自 secretfiles.html，不改动正文） */
(function () {
	'use strict';
	var BASE = window.DOOMSDAY_BASEURL || '';
	var CHAPTERS = window.DOOMSDAY_CHAPTERS || [];
	var N = CHAPTERS.length;
	var LAST_KEY = 'doomsday:last';

	var reader = document.getElementById('reader');
	if (!reader) return;
	var scroller = document.getElementById('readerScroll');
	var body = document.getElementById('readerBody');
	var menuBtn = document.getElementById('readerMenu');
	var prevBtn = document.getElementById('readerPrev');
	var nextBtn = document.getElementById('readerNext');
	var fullBtn = document.getElementById('readerFull');

	var isOpen = false, openIdx = -1, docCache = null;
	var pushedHash = false, savedScrollY = 0;
	var wideMode = false;
	function isWideScreen() {
		return !!(window.matchMedia && window.matchMedia('(min-width:1100px)').matches);
	}
	/* 宽屏阅读时隐藏页面滚动条（页面仍可滚动），只留阅读区一条 */
	function setPageBarHidden(hide) {
		document.documentElement.classList.toggle('no-pagebar', !!hide);
	}

	function $(id) { return document.getElementById(id); }
	function setPair(zhId, enId, zh, en) {
		var z = $(zhId), e = $(enId);
		if (z) z.textContent = zh;
		if (e) e.textContent = en;
	}

	function fetchDoc() {
		if (docCache) return Promise.resolve(docCache);
		return fetch(BASE + '/secretfiles.html', { credentials: 'same-origin' })
			.then(function (r) { if (!r.ok) throw new Error('fetch failed'); return r.text(); })
			.then(function (t) {
				docCache = new DOMParser().parseFromString(t, 'text/html');
				return docCache;
			});
	}

	function chapterNodes(doc, i) {
		var h2 = doc.getElementById(CHAPTERS[i].anchor);
		if (!h2) return [];
		var out = [], s = h2.nextElementSibling;
		while (s && !(s.tagName === 'H2' && s.classList.contains('chapter'))) {
			if (!s.classList.contains('chapter-nav')) out.push(s.cloneNode(true));
			s = s.nextElementSibling;
		}
		return out;
	}

	function paintNav() {
		var p = CHAPTERS[openIdx - 1], nx = CHAPTERS[openIdx + 1];
		prevBtn.disabled = !p;
		nextBtn.disabled = !nx;
		setPair('readerPrevZh', 'readerPrevEn', p ? p.zhNum + ' ' + p.zh : '', p ? p.enNum + ' ' + p.en : '');
		setPair('readerNextZh', 'readerNextEn', nx ? nx.zhNum + ' ' + nx.zh : '', nx ? nx.enNum + ' ' + nx.en : '');
	}

	function render(i, done) {
		fetchDoc().then(function (doc) {
			var ch = CHAPTERS[i];
			setPair('readerKickerZh', 'readerKickerEn', ch.zhNum, ch.enNum);
			setPair('readerTitleZh', 'readerTitleEn', ch.zh, ch.en);
			body.innerHTML = '';
			chapterNodes(doc, i).forEach(function (n) { body.appendChild(n); });
			paintNav();
			if (done) done();
		}).catch(function () {
			body.innerHTML = '<p><span class="t-zh">加载失败，请稍后重试。</span>' +
				'<span class="t-en">Failed to load. Please try again.</span></p>';
			if (done) done();
		});
	}

	function saveLast(i, y) {
		try { localStorage.setItem(LAST_KEY, JSON.stringify({ i: i, y: y || 0 })); } catch (e) {}
		document.dispatchEvent(new CustomEvent('doomsday:readpos'));
	}

	function open(i, x, y, opts) {
		opts = opts || {};
		if (isOpen && i === openIdx) return;
		var switching = isOpen;
		isOpen = true;
		openIdx = i;
		wideMode = isWideScreen();
		reader.classList.toggle('wide', wideMode);
		if (!switching) savedScrollY = window.scrollY || 0;
		render(i, function () { scroller.scrollTop = opts.scrollY || 0; });
		if (wideMode) {
			/* 宽屏同页：右侧面板滑入，不锁页面滚动，DNA 目录保持可用；但隐藏页面滚动条避免双条 */
			document.body.style.overflow = '';
			setPageBarHidden(true);
		} else {
			setPageBarHidden(false);
			document.body.style.overflow = 'hidden';
			reader.style.setProperty('--rx', Math.round(x) + 'px');
			reader.style.setProperty('--ry', Math.round(y) + 'px');
		}
		reader.removeAttribute('hidden');
		requestAnimationFrame(function () {
			requestAnimationFrame(function () { reader.classList.add('open'); });
		});
		saveLast(i, opts.scrollY || 0);
		if (switching) {
			try { history.replaceState(null, '', '#r' + (i + 1)); } catch (e) {}
		} else if (!opts.noHash) {
			try { location.hash = 'r' + (i + 1); pushedHash = true; } catch (e) {}
		}
	}

	function close() {
		if (!isOpen) return;
		isOpen = false;
		/* 关闭即退出全屏：下次打开回到默认半屏 */
		reader.classList.remove('full');
		if (fullBtn) { fullBtn.setAttribute('aria-pressed', 'false'); fullBtn.title = '全屏 / Full screen'; }
		closeFontPop();
		setPageBarHidden(false);
		if (wideMode) {
			reader.classList.remove('open');
			setTimeout(function () {
				reader.setAttribute('hidden', '');
				reader.classList.remove('wide');
			}, 680);
			pushedHash = false;
			try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
			return;
		}
		/* 缩回小球所在位置 */
		var x = window.innerWidth * 0.35, y = window.innerHeight * 0.5;
		try {
			if (window.DNA && window.DNA.nodePos) {
				var p = window.DNA.nodePos(openIdx);
				if (p[1] > 0 && p[1] < window.innerHeight) { x = p[0]; y = p[1]; }
			}
		} catch (e) {}
		reader.style.setProperty('--rx', Math.round(x) + 'px');
		reader.style.setProperty('--ry', Math.round(y) + 'px');
		reader.classList.remove('open');
		setTimeout(function () { reader.setAttribute('hidden', ''); }, 880);
		document.body.style.overflow = '';
		try { window.scrollTo(0, savedScrollY); } catch (e) {}
		pushedHash = false;
		try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
	}

	function step(d) {
		var j = openIdx + d;
		if (j < 0 || j >= N || !isOpen) return;
		closeFontPop();
		openIdx = j;
		body.style.opacity = '0';
		render(j, function () {
			scroller.scrollTop = 0;
			requestAnimationFrame(function () { body.style.opacity = ''; });
		});
		saveLast(j, 0);
		try { history.replaceState(null, '', '#r' + (j + 1)); } catch (e) {}
	}

	menuBtn.addEventListener('click', function () {
		if (pushedHash) { try { history.back(); } catch (e) { close(); } }
		else close();
	});
	prevBtn.addEventListener('click', function () { step(-1); });
	nextBtn.addEventListener('click', function () { step(1); });
	/* 宽屏全屏开关：半屏默认，点一下全屏，再点还原；窄屏不显示此钮 */
	if (fullBtn) fullBtn.addEventListener('click', function () {
		if (!isOpen || !wideMode) return;
		var full = reader.classList.toggle('full');
		fullBtn.setAttribute('aria-pressed', full ? 'true' : 'false');
		fullBtn.title = full ? '退出全屏 / Exit full screen' : '全屏 / Full screen';
	});

	/* 字号：按钮开滑块弹层，拖动即调正文字号，偏好存 localStorage，宽窄屏都可用 */
	var fontBtn = document.getElementById('readerFont');
	var fontPop = document.getElementById('readerFontPop');
	var fontRange = document.getElementById('readerFontRange');
	var FONT_KEY = 'doomsday:fontsize';
	function applyFont(v) {
		v = Math.max(80, Math.min(150, v | 0));
		body.style.fontSize = (v / 100).toFixed(2) + 'rem';
		if (fontRange) fontRange.value = v;
		try { localStorage.setItem(FONT_KEY, String(v)); } catch (e) {}
	}
	function closeFontPop() {
		if (fontPop) fontPop.setAttribute('hidden', '');
		if (fontBtn) fontBtn.setAttribute('aria-pressed', 'false');
	}
	if (fontBtn && fontPop && fontRange) {
		var savedFont = 100;
		try { savedFont = parseInt(localStorage.getItem(FONT_KEY) || '100', 10) || 100; } catch (e) {}
		applyFont(savedFont);
		fontBtn.addEventListener('click', function () {
			if (fontPop.hasAttribute('hidden')) {
				fontPop.removeAttribute('hidden');
				fontBtn.setAttribute('aria-pressed', 'true');
			} else closeFontPop();
		});
		fontRange.addEventListener('input', function () { applyFont(parseInt(fontRange.value, 10) || 100); });
	}
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && isOpen) {
			/* 字号弹层开着时，Esc 先收弹层，不关阅读器 */
			if (fontPop && !fontPop.hasAttribute('hidden')) { closeFontPop(); return; }
			if (pushedHash) { try { history.back(); } catch (e2) { close(); } }
			else close();
		}
	});

	var saveT;
	scroller.addEventListener('scroll', function () {
		clearTimeout(saveT);
		saveT = setTimeout(function () { if (isOpen) saveLast(openIdx, scroller.scrollTop); }, 450);
	});

	window.addEventListener('hashchange', function () {
		var m = /^#r(\d+)$/.exec(location.hash);
		if (m) {
			var i = parseInt(m[1], 10) - 1;
			if (i >= 0 && i < N && !isOpen) {
				open(i, window.innerWidth * 0.5, window.innerHeight * 0.5, { noHash: true });
			}
		} else if (isOpen) {
			close();
		}
	});

	/* 窗口跨过宽屏阈值时，打开中的阅读页同步切换形态 */
	var rszT;
	window.addEventListener('resize', function () {
		clearTimeout(rszT);
		rszT = setTimeout(function () {
			if (!isOpen) return;
			var w = isWideScreen();
			if (w === wideMode) return;
			wideMode = w;
			reader.classList.toggle('wide', w);
			if (!w) reader.classList.remove('full');
			document.body.style.overflow = w ? '' : 'hidden';
			setPageBarHidden(w);
		}, 220);
	});

	window.Reader = {
		open: open,
		close: close,
		isOpen: function () { return isOpen; },
		isWideOpen: function () { return isOpen && wideMode; }
	};
})();
