/* Language toggle component: 中 / EN
 * - Single page, both languages in DOM (.t-zh / .t-en spans)
 * - Switching sets <html lang> and persists to localStorage
 * - Paragraphs are 1:1 aligned, so the reader keeps their position
 */
(function () {
	'use strict';
	var KEY = 'doomsday-lang';
	var root = document.documentElement;
	var btn = document.getElementById('langToggle');
	if (!btn) return;

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
		var opts = btn.querySelectorAll('[data-l]');
		for (var i = 0; i < opts.length; i++) {
			opts[i].classList.toggle('on', opts[i].getAttribute('data-l') === lang);
		}
	}

	function apply(lang) {
		root.setAttribute('lang', lang);
		paint(lang);
		try { localStorage.setItem(KEY, lang); } catch (e) {}
		document.dispatchEvent(new Event('langchange'));
	}

	var initial = 'zh';
	try { initial = localStorage.getItem(KEY) || 'zh'; } catch (e) {}
	if (initial !== 'zh' && initial !== 'en') initial = 'zh';

	btn.addEventListener('click', function () {
		var anchor = currentAnchor();
		var next = root.getAttribute('lang') === 'zh' ? 'en' : 'zh';
		apply(next);
		if (anchor) anchor.scrollIntoView();
	});

	apply(initial);
})();
