/* 末世劫 · 原生 JS（无 jQuery） */
(function () {
	'use strict';

	/* ---------- 移动端菜单 ---------- */
	var navToggle = document.getElementById('navToggle');
	var siteNav = document.getElementById('siteNav');
	if (navToggle && siteNav) {
		navToggle.addEventListener('click', function () {
			siteNav.classList.toggle('open');
		});
	}

	/* ---------- 阅读进度条 ---------- */
	var progress = document.getElementById('progress');
	function onScroll() {
		if (!progress) return;
		var h = document.documentElement;
		var max = h.scrollHeight - h.clientHeight;
		progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
	}
	document.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* ---------- 章节：目录高亮 + 上一章/下一章 ---------- */
	var chapters = Array.prototype.slice.call(
		document.querySelectorAll('.story-body h2.chapter')
	);
	if (!chapters.length) return;

	function isEN() { return document.documentElement.getAttribute('lang') === 'en'; }
	function chTitle(el) {
		return el.getAttribute(isEN() ? 'data-title-en' : 'data-title') || el.textContent.trim();
	}

	/* 上一章 / 下一章 */
	var navBox = document.querySelector('.chapter-nav');
	if (navBox) {
		function linkFor(i, cls, dir) {
			var a = document.createElement('a');
			a.href = '#' + chapters[i].id;
			a.className = cls;
			var d = document.createElement('span'); d.className = 'dir'; d.textContent = dir;
			var t = document.createElement('span'); t.className = 't';
			t.textContent = chTitle(chapters[i]);
			a.appendChild(d); a.appendChild(t);
			return a;
		}
		var tocLinks = {};
		document.querySelectorAll('.toc-list a').forEach(function (a) {
			tocLinks[a.getAttribute('href')] = a;
		});
		function renderNav(idx) {
			navBox.innerHTML = '';
			var enL = isEN();
			if (idx > 0) navBox.appendChild(linkFor(idx - 1, 'prev', enL ? '← Prev' : '← 上一章'));
			var back = document.createElement('a');
			back.href = '#toc'; back.className = 'back';
			var bd = document.createElement('span'); bd.className = 'dir'; bd.textContent = enL ? 'Contents' : '章节目录';
			var bt = document.createElement('span'); bt.className = 't'; bt.textContent = enL ? 'Back to contents' : '回到目录';
			back.appendChild(bd); back.appendChild(bt);
			navBox.appendChild(back);
			if (idx < chapters.length - 1) navBox.appendChild(linkFor(idx + 1, 'next', enL ? 'Next →' : '下一章 →'));
		}
		renderNav(0);

		/* 滚动高亮当前章节 */
		var current = 0;
		if ('IntersectionObserver' in window) {
			var obs = new IntersectionObserver(function (entries) {
				entries.forEach(function (en) {
					if (en.isIntersecting) {
						var idx = chapters.indexOf(en.target);
						if (idx !== current) {
							current = idx;
							renderNav(idx);
							Object.keys(tocLinks).forEach(function (k) { tocLinks[k].classList.remove('active'); });
							var link = tocLinks['#' + en.target.id];
							if (link) link.classList.add('active');
						}
					}
				});
			}, { rootMargin: '-40% 0px -55% 0px' });
			chapters.forEach(function (c) { obs.observe(c); });
		}
		/* 语言切换时重绘章节导航 */
		document.addEventListener('langchange', function () { renderNav(current); });
	}
})();
