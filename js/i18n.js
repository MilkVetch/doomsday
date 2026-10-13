/* Language toggle component: 中 / EN
 * - Single page, both languages in DOM (.t-zh / .t-en spans)
 * - Switching sets <html lang> and persists to localStorage
 * - Paragraphs are 1:1 aligned, so the reader keeps their position
 */
(function () {
	'use strict';
	var KEY = 'doomsday-lang';
	var root = document.documentElement;

	function currentAnchor() {
		var els = document.querySelectorAll('.chapter, .story-banner');
		var best = null;
		for (var i = 0; i < els.length; i++) {
			if (els[i].getBoundingClientRect().top <= 140) best = els[i];
			else break;
		}
		return best;
	}

	function paint(lang) {
		var btns = document.querySelectorAll('[data-lang-toggle]');
		for (var b = 0; b < btns.length; b++) {
			var opts = btns[b].querySelectorAll('[data-l]');
			for (var i = 0; i < opts.length; i++) {
				opts[i].classList.toggle('on', opts[i].getAttribute('data-l') === lang);
			}
		}
	}

	function apply(lang) {
		root.setAttribute('lang', lang);
		paint(lang);
		try { localStorage.setItem(KEY, lang); } catch (e) {}
		document.dispatchEvent(new Event('langchange'));
	}

	function toggle() {
		var anchor = currentAnchor();
		var next = root.getAttribute('lang') === 'zh' ? 'en' : 'zh';
		apply(next);
		if (anchor) anchor.scrollIntoView();
	}

	/* 供 DNA 工具球、阅读页等调用 */
	window.DoomsdayLang = {
		toggle: toggle,
		get: function () { return root.getAttribute('lang') || 'zh'; }
	};

	var btns = document.querySelectorAll('[data-lang-toggle]');
	if (!btns.length) return;

	var initial = 'zh';
	try { initial = localStorage.getItem(KEY) || 'zh'; } catch (e) {}
	if (initial !== 'zh' && initial !== 'en') initial = 'zh';

	for (var k = 0; k < btns.length; k++) {
		btns[k].addEventListener('click', toggle);
	}

	apply(initial);
})();
