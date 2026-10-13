/* DNA v3：SPA 主页 · 两步点选（选中→展开） · B 旋臂工具球 · 首屏金句 */
(function () {
	'use strict';
	var NS = 'http://www.w3.org/2000/svg';
	var BASE = window.DOOMSDAY_BASEURL || '';

	var CHAPTERS = [
		{ n: '1', zhNum: '第一章', enNum: 'Chapter 1', zh: '最后的一课', en: 'The Last Lesson', img: 'ch01.jpg', anchor: 'ch1' },
		{ n: '2', zhNum: '第二章', enNum: 'Chapter 2', zh: '树林里的先生', en: 'The Teacher in the Grove', img: 'ch02.jpg', anchor: 'ch2' },
		{ n: '3', zhNum: '第三章', enNum: 'Chapter 3', zh: '赤炎神坛', en: 'The Crimson Altar', img: 'ch03.jpg', anchor: 'ch3' },
		{ n: '4', zhNum: '第四章', enNum: 'Chapter 4', zh: '两个世界', en: 'Two Worlds', img: 'ch04.jpg', anchor: 'ch4' },
		{ n: '5', zhNum: '第五章', enNum: 'Chapter 5', zh: '塔胡里大捷', en: 'The Triumph at Tahuri', img: 'ch05.jpg', anchor: 'ch5' },
		{ n: '6', zhNum: '第六章', enNum: 'Chapter 6', zh: '黑色的黎明', en: 'Black Dawn', img: 'ch06.jpg', anchor: 'ch6' },
		{ n: '7', zhNum: '第七章', enNum: 'Chapter 7', zh: '丧尸', en: 'The Zombies', img: 'ch07.jpg', anchor: 'ch7' },
		{ n: '8', zhNum: '第八章', enNum: 'Chapter 8', zh: '牢中的先生', en: 'The Teacher in Prison', img: 'ch08.jpg', anchor: 'ch8' },
		{ n: '9', zhNum: '第九章', enNum: 'Chapter 9', zh: '救世军', en: 'The Saviours', img: 'ch09.jpg', anchor: 'ch9' },
		{ n: '10', zhNum: '第十章', enNum: 'Chapter 10', zh: '断头台', en: 'The Guillotine', img: 'ch10.jpg', anchor: 'ch10' },
		{ n: '11', zhNum: '第十一章', enNum: 'Chapter 11', zh: '凯诺', en: 'Kino', img: 'ch11.jpg', anchor: 'ch11' },
		{ n: '12', zhNum: '第十二章', enNum: 'Chapter 12', zh: '拉帕玛乌', en: 'Rapa Mau', img: 'ch12.jpg', anchor: 'ch12' },
		{ n: '13', zhNum: '第十三章', enNum: 'Chapter 13', zh: '先驱者号', en: 'The Pioneer', img: 'ch13.jpg', anchor: 'ch13' },
		{ n: '14', zhNum: '第十四章', enNum: 'Chapter 14', zh: '真相', en: 'The Truth', img: 'ch14.jpg', anchor: 'ch14' },
		{ n: '15', zhNum: '第十五章', enNum: 'Chapter 15', zh: '脑共享', en: 'Mind-Sharing', img: 'ch15.jpg', anchor: 'ch15' },
		{ n: '16', zhNum: '第十六章', enNum: 'Chapter 16', zh: '骗局', en: 'The Deception', img: 'ch16.jpg', anchor: 'ch16' },
		{ n: '17', zhNum: '第十七章', enNum: 'Chapter 17', zh: '「它」', en: '"It"', img: 'ch17.jpg', anchor: 'ch17' },
		{ n: '18', zhNum: '第十八章', enNum: 'Chapter 18', zh: '最笨的学生', en: 'The Dullest Student', img: 'ch18.jpg', anchor: 'ch18' },
		{ n: '19', zhNum: '第十九章', enNum: 'Chapter 19', zh: '先生的离去', en: "The Teacher's Passing", img: 'ch19.jpg', anchor: 'ch19' },
		{ n: '20', zhNum: '第二十章', enNum: 'Chapter 20', zh: '神山之巅', en: 'The Summit of the Sacred Mountain', img: 'ch20.jpg', anchor: 'ch20' },
		{ n: '21', zhNum: '第二十一章', enNum: 'Chapter 21', zh: '基因里的文明', en: 'Civilization in the Genes', img: 'ch21.jpg', anchor: 'ch21' },
		{ n: '尾', zhNum: '尾声', enNum: 'Epilogue', zh: '圣阿空迦大教堂', en: 'St. Akonga Cathedral', img: 'ch22.jpg', anchor: 'epilogue' }
	];
	window.DOOMSDAY_CHAPTERS = CHAPTERS;

	/* 首屏金句：正文实摘 */
	var QUOTES = [
		{ zh: "“你还天真的以为我不泄露天机，人类就不会灭亡了吗？”", en: "'Do you naively believe that, had I not leaked heaven's secret, humanity would not perish?'", srcZh: "第七章 · 丧尸", srcEn: "Chapter 7 · The Zombies" },
		{ zh: "“除非是救世主出现，否则没有人可以拯救人类。”", en: "'Unless a saviour appears, no one can save humanity.'", srcZh: "第八章 · 牢中的先生", srcEn: "Chapter 8 · The Teacher in Prison" },
		{ zh: "丧尸一直都在人的心里，只要还有希望和梦想，人永远无法成为丧尸。", en: "The zombie has always lived in the human heart; so long as hope and dreams remain, a man can never become a zombie.", srcZh: "第二十章 · 神山之巅", srcEn: "Chapter 20 · The Summit of the Sacred Mountain" },
		{ zh: "救世主？我连自己的女儿都救不了，有什么资格当救世主？", en: "A saviour? I could not even save my own daughter — what right had I to be a saviour?", srcZh: "第十一章 · 凯诺", srcEn: "Chapter 11 · Kino" },
		{ zh: "“你是否愿意接受伊沪·玛西亚作为你个人的救主？”", en: "'Do you accept Ihu Mesia as your personal saviour?'", srcZh: "第三章 · 赤炎神坛", srcEn: "Chapter 3 · The Crimson Altar" },
		{ zh: "“圣经里没有这个人，他只存在于神的‘机密档案’中。”", en: "'There is no such person in the Bible. He exists only in God's 'Secret Files.''", srcZh: "尾声 · 圣阿空迦大教堂", srcEn: "Epilogue · St. Akonga Cathedral" },
		{ zh: "“为自由干杯！”", en: "'A toast — to freedom!'", srcZh: "第二章 · 树林里的先生", srcEn: "Chapter 2 · The Teacher in the Grove" },
		{ zh: "先生越是按兵不动，它越是害怕！", en: "The longer he held his forces unmoving, the more it feared him!", srcZh: "第十八章 · 最笨的学生", srcEn: "Chapter 18 · The Dullest Student" },
		{ zh: "共和国31年5月9日，黑色的黎明。", en: "The 9th of May, in the thirty-first year of the Republic. Black dawn.", srcZh: "第六章 · 黑色的黎明", srcEn: "Chapter 6 · Black Dawn" },
		{ zh: "“我不但意识到了它的存在，还无意之中发现了它的弱点！”", en: "'Not only did I become aware of its existence — I inadvertently discovered its weakness!'", srcZh: "第十六章 · 骗局", srcEn: "Chapter 16 · The Deception" }
	];

	/* B 旋臂工具球：钉在对应章节横杆另一端（home = 章节 slot） */
	var UTILS = [
		{ id: 'back',  home: 0, zh: '返回', en: 'Back' },
		{ id: 'lang',  home: 1, zh: '中/EN', en: '中/EN' },
		{ id: 'share', home: 2, zh: '分享', en: 'Share' },
		{ id: 'about', home: 3, zh: '关于', en: 'About' }
	];
	var LAST_KEY = 'doomsday:last';

	var N = CHAPTERS.length;
	var TWIST = 0.62;
	var SCROLL_K = 0.0038;
	var IDLE = 0.0032;
	var SAMPLES = 200;
	var COVER = BASE + '/img/secretfiles.jpg';
	var PCOLORS = ['#ff6b61', '#ec3529', '#ffb199', '#ffd166'];

	function el(name, attrs) {
		var e = document.createElementNS(NS, name);
		for (var k in attrs) e.setAttribute(k, attrs[k]);
		return e;
	}
	function setSpan(box, zh, en) {
		if (!box) return;
		var z = box.querySelector('.t-zh'), e = box.querySelector('.t-en');
		if (z) z.textContent = zh;
		if (e) e.textContent = en;
	}
	function closeOverlay() {
		var ov = document.getElementById('dnaOverlay');
		var tg = document.getElementById('dnaToggle');
		if (ov) ov.setAttribute('hidden', '');
		document.body.style.overflow = '';
		if (tg) tg.classList.remove('open');
	}
	function toast(msg) {
		var t = document.getElementById('toast');
		if (!t) return;
		t.textContent = msg;
		t.removeAttribute('hidden');
		requestAnimationFrame(function () { t.classList.add('on'); });
		clearTimeout(t._h);
		t._h = setTimeout(function () { t.classList.remove('on'); }, 1900);
	}
	window.DoomsdayToast = toast;
	function readLast() {
		try { return JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); }
		catch (e) { return null; }
	}

	function buildIcon(g, id) {
		if (id === 'back') {
			g.appendChild(el('path', { d: 'M8,0 H-5 M-1,-4.5 L-5,0 L-1,4.5', stroke: '#c98a76', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
		} else if (id === 'lang') {
			var tx = el('text', { 'font-size': 9, fill: '#c98a76', 'text-anchor': 'middle', dy: '.35em', 'font-family': 'monospace' });
			tx.textContent = '中/EN';
			g.appendChild(tx);
		} else if (id === 'share') {
			var sg = el('g', { stroke: '#c98a76', 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' });
			sg.appendChild(el('line', { x1: -6, y1: 1, x2: 5, y2: -4.5 }));
			sg.appendChild(el('line', { x1: -6, y1: 1, x2: 5, y2: 5.5 }));
			[[-6, 1], [5, -4.5], [5, 5.5]].forEach(function (pt) {
				sg.appendChild(el('circle', { cx: pt[0], cy: pt[1], r: 2.4, fill: '#0d0707' }));
			});
			g.appendChild(sg);
		} else if (id === 'about') {
			var at = el('text', { 'font-size': 17, 'font-style': 'italic', fill: '#c98a76', 'text-anchor': 'middle', dy: '.36em', 'font-family': 'Georgia,serif' });
			at.textContent = 'i';
			g.appendChild(at);
		}
	}

	function init(stage) {
		var tallwrap = stage.querySelector('.dna-tallwrap');
		var layers = stage.querySelectorAll('.dna-bg-layer');
		var curNum = stage.querySelector('.dna-cur-num');
		var curTitle = stage.querySelector('.dna-cur-title');
		var selBox = stage.querySelector('.dna-cur-sel');
		var idleBox = stage.querySelector('.dna-cur-idle');
		var quoteBox = stage.querySelector('.dna-quote');
		var quoteSrc = stage.querySelector('.dna-quote-src');
		var goBtn = stage.querySelector('.dna-go');
		var canvas = stage.querySelector('.dna-fx');
		var aboutOv = document.getElementById('aboutOv');
		var aboutX = document.getElementById('aboutX');
		if (!tallwrap || !canvas) return;
		var ctx = canvas.getContext('2d');

		var inOverlay = !!stage.closest('.dna-overlay');
		var onHome = !inOverlay;

		var svg = el('svg', { preserveAspectRatio: 'xMidYMid meet' });
		tallwrap.appendChild(svg);
		var defs = el('defs', {});
		defs.innerHTML =
			'<radialGradient id="ballGrad" cx="35%" cy="30%" r="75%">' +
			'<stop offset="0%" stop-color="#ffb3a6"/><stop offset="35%" stop-color="#ff6b61"/>' +
			'<stop offset="68%" stop-color="#ec3529"/><stop offset="100%" stop-color="#6e110b"/>' +
			'</radialGradient>' +
			'<filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">' +
			'<feGaussianBlur stdDeviation="4" result="b"/>' +
			'<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
		svg.appendChild(defs);

		var gRung = el('g', {});
		var gStrand = el('g', { 'stroke-linecap': 'round', fill: 'none' });
		var gNode = el('g', { filter: 'url(#nodeGlow)' });
		var gUtil = el('g', {});
		var sA = [el('path', { stroke: '#3d0b08', 'stroke-width': 13 }),
		          el('path', { stroke: '#c1272d', 'stroke-width': 8 }),
		          el('path', { stroke: '#ff7a6a', 'stroke-width': 2.6, opacity: 0.9 })];
		var sB = [el('path', { stroke: '#2c0806', 'stroke-width': 13, opacity: 0.75 }),
		          el('path', { stroke: '#7e1f16', 'stroke-width': 8, opacity: 0.8 }),
		          el('path', { stroke: '#a03a2c', 'stroke-width': 2.6, opacity: 0.6 })];
		sA.forEach(function (p) { gStrand.appendChild(p); });
		sB.forEach(function (p) { gStrand.appendChild(p); });
		svg.appendChild(gRung);
		svg.appendChild(gStrand);
		svg.appendChild(gNode);
		svg.appendChild(gUtil);

		/* 章节球（A 旋臂） */
		var rungs = [], nodes = [];
		for (var i = 0; i < N; i++) {
			var rung = el('line', { stroke: '#8f2a1e', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 });
			gRung.appendChild(rung);
			rungs.push(rung);
			var g = el('g', { 'class': 'dna-node' });
			var hit = el('circle', { r: 34, fill: 'rgba(0,0,0,0)' });
			var ball = el('circle', { fill: 'url(#ballGrad)', stroke: '#ff9a8a', 'stroke-width': 1.4, opacity: 0.95 });
			var lab = el('text', { 'font-size': 18, fill: '#e8a08c', dy: '.35em', opacity: 0 });
			lab.textContent = CHAPTERS[i].n;
			g.appendChild(hit);
			g.appendChild(ball);
			g.appendChild(lab);
			gNode.appendChild(g);
			nodes.push({ g: g, hit: hit, ball: ball, lab: lab, y: 0, x: 0 });
		}

		/* 工具球（B 旋臂） */
		var utils = [];
		UTILS.forEach(function (u) {
			var g = el('g', { 'class': 'dna-util' });
			var hit = el('circle', { r: 30, fill: 'rgba(0,0,0,0)' });
			var ball = el('circle', { r: 16, 'class': 'u-ball' });
			var icon = el('g', {});
			buildIcon(icon, u.id);
			var lab = el('text', { x: 24, 'font-size': 10.5, 'class': 'u-lab', dy: '.35em' });
			g.appendChild(hit);
			g.appendChild(ball);
			g.appendChild(icon);
			g.appendChild(lab);
			gUtil.appendChild(g);
			utils.push({ id: u.id, zh: u.zh, en: u.en, home: u.home, slot: u.home, g: g, lab: lab, sx: 0, sy: 0, cx: null, cy: null });
		});
		function paintUtilLabs() {
			var lang = (window.DoomsdayLang && window.DoomsdayLang.get()) ||
				document.documentElement.getAttribute('lang') || 'zh';
			utils.forEach(function (u) {
				u.lab.textContent = lang === 'zh' ? u.zh : u.en;
			});
		}
		document.addEventListener('langchange', paintUtilLabs);

		var W = 0, H = 0, CX = 0, AMP = 0, pitch = 0;
		function layout() {
			var r = tallwrap.getBoundingClientRect();
			W = Math.max(50, r.width); H = Math.max(50, r.height);
			svg.setAttribute('viewBox', '0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0));
			CX = W * 0.5;
			AMP = Math.min(W * 0.33, 150);
			pitch = H / N;
			for (var i = 0; i < N; i++) nodes[i].y = (i + 0.5) * pitch;
			sizeCanvas();
			if (H < 200) setTimeout(layout, 600);
		}
		function sizeCanvas() {
			var dpr = Math.min(2, window.devicePixelRatio || 1);
			canvas.width = Math.round(window.innerWidth * dpr);
			canvas.height = Math.round(window.innerHeight * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		var autoT = Math.random() * 6.28;
		var hoverIdx = -1, scrollIdx = 0, selectIdx = -1;
		var shownEff = -2, shownBG = null, frontIdx = 0;
		var interacted = false;
		var hoverCapable = window.matchMedia && window.matchMedia('(hover:hover)').matches;
		var parts = [], lastAmb = 0;

		function imgURL(c) { return BASE + '/img/chapters/' + c.img; }
		function paintSelection() {
			if (selectIdx >= 0) {
				var ch = CHAPTERS[selectIdx];
				selBox.removeAttribute('hidden');
				idleBox.setAttribute('hidden', '');
				setSpan(curNum, ch.zhNum, ch.enNum);
				setSpan(curTitle, ch.zh, ch.en);
			} else {
				selBox.setAttribute('hidden', '');
				idleBox.removeAttribute('hidden');
			}
		}
		function showBG(src) {
			if (shownBG === src) return;
			shownBG = src;
			var next = layers[1 - frontIdx], cur = layers[frontIdx];
			var im = new Image();
			im.onload = function () {
				next.style.backgroundImage = 'url("' + src + '")';
				next.classList.add('on');
				cur.classList.remove('on');
				frontIdx = 1 - frontIdx;
			};
			im.src = src;
		}
		function nodeScreen(i) {
			var r = svg.getBoundingClientRect();
			return [r.left + nodes[i].x / W * r.width, r.top + nodes[i].y];
		}
		function burst(sx, sy) {
			for (var k = 0; k < 34; k++) {
				if (parts.length > 420) break;
				var a = Math.random() * 6.283, sp = 0.7 + Math.random() * 2.8;
				parts.push({ x: sx, y: sy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.9,
					life: 1, decay: 0.009 + Math.random() * 0.016,
					r: 1 + Math.random() * 2.6, c: PCOLORS[(Math.random() * 4) | 0] });
			}
		}
		function scrollerOf() {
			var ov = stage.closest('.dna-overlay');
			return ov || window;
		}
		function ensureVisible(i) {
			var p = nodeScreen(i);
			if (p[1] < 90 || p[1] > window.innerHeight - 90) {
				var sc = scrollerOf();
				var target = (sc === window ? window.scrollY : sc.scrollTop) + p[1] - window.innerHeight * 0.45;
				if (sc === window) window.scrollTo({ top: target, behavior: 'smooth' });
				else sc.scrollTo({ top: target, behavior: 'smooth' });
			}
		}
		function selectChapter(i, scroll) {
			selectIdx = i;
			interacted = true;
			paintSelection();
			var ch = CHAPTERS[i];
			showBG(imgURL(ch));
			var p = nodeScreen(i);
			burst(p[0], p[1]);
			if (scroll) ensureVisible(i);
		}
		function expandChapter(i) {
			if (window.Reader && onHome) {
				var p = nodeScreen(i);
				var vh = window.innerHeight, vw = window.innerWidth;
				var x = (p[1] < 0 || p[1] > vh) ? vw * 0.32 : p[0];
				var y = (p[1] < 0 || p[1] > vh) ? vh * 0.5 : p[1];
				window.Reader.open(i, x, y);
			}
		}
		function goAnchor(i) {
			/* 浮层模式（小说页）：关闭浮层并滚动到章节 */
			var anchor = CHAPTERS[i].anchor;
			closeOverlay();
			var tgt = document.getElementById(anchor);
			try { history.replaceState(null, '', '#' + anchor); } catch (e) {}
			if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
			else location.hash = '#' + anchor;
		}
		function activate(i) {
			if (selectIdx === i) {
				if (onHome) expandChapter(i);
				else goAnchor(i);
			} else {
				selectChapter(i, true);
			}
		}

		nodes.forEach(function (nd, i) {
			nd.g.addEventListener('click', function (ev) {
				ev.stopPropagation();
				activate(i);
			});
			if (hoverCapable) {
				nd.g.addEventListener('mouseenter', function () {
					hoverIdx = i;
					interacted = true;
					var p = nodeScreen(i); burst(p[0], p[1]);
				});
			}
		});
		if (hoverCapable) svg.addEventListener('mouseleave', function () { hoverIdx = -1; });
		if (goBtn) goBtn.addEventListener('click', function () {
			if (selectIdx < 0) {
				/* 未选中：自动点第一章的小球 */
				selectChapter(0, true);
			} else if (onHome) {
				expandChapter(selectIdx);
			} else {
				goAnchor(selectIdx);
			}
		});

		/* 工具球点击 */
		utils.forEach(function (u) {
			u.g.addEventListener('click', function (ev) {
				ev.stopPropagation();
				interacted = true;
				if (u.id === 'back') {
					var last = readLast();
					if (!last) { toast('还没有阅读记录 / No reading history yet'); return; }
					if (onHome && window.Reader) {
						window.Reader.open(last.i, u.sx, u.sy, { scrollY: last.y || 0 });
					} else {
						closeOverlay();
					}
				} else if (u.id === 'lang') {
					if (window.DoomsdayLang) window.DoomsdayLang.toggle();
				} else if (u.id === 'share') {
					var url = location.href.split('#')[0];
					var title = '末世劫 · 机密档案';
					if (navigator.share) {
						navigator.share({ title: title, text: title, url: url }).catch(function () {});
					} else if (navigator.clipboard && navigator.clipboard.writeText) {
						navigator.clipboard.writeText(url).then(function () {
							toast('链接已复制 / Link copied');
						}, function () { toast(url); });
					} else {
						toast(url);
					}
				} else if (u.id === 'about') {
					if (aboutOv) {
						aboutOv.removeAttribute('hidden');
						requestAnimationFrame(function () { aboutOv.classList.add('open'); });
					}
				}
			});
		});
		function closeAbout() {
			if (!aboutOv || aboutOv.hasAttribute('hidden')) return;
			aboutOv.classList.remove('open');
			setTimeout(function () { aboutOv.setAttribute('hidden', ''); }, 320);
		}
		if (aboutX) aboutX.addEventListener('click', closeAbout);
		if (aboutOv) aboutOv.addEventListener('click', function (e) { if (e.target === aboutOv) closeAbout(); });
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAbout(); });

		/* 首屏金句 */
		(function paintQuote() {
			var q = QUOTES[(Math.random() * QUOTES.length) | 0];
			setSpan(quoteBox, q.zh, q.en);
			setSpan(quoteSrc, '—— ' + q.srcZh, '—— ' + q.srcEn);
		})();

		layers[0].style.backgroundImage = 'url("' + COVER + '")';
		layers[0].classList.add('on');
		shownBG = COVER;

		var rsz;
		window.addEventListener('resize', function () {
			clearTimeout(rsz);
			rsz = setTimeout(layout, 200);
		});

		/* 对外接口：阅读页关闭时缩回目标 */
		window.DNA = window.DNA || {};
		window.DNA.nodePos = nodeScreen;

		function frame(now) {
			var ov = stage.closest('.dna-overlay');
			var hidden = ov && ov.hasAttribute('hidden');
			var readerOpen = window.Reader && window.Reader.isOpen && window.Reader.isOpen();
			if (!document.hidden && !hidden && !readerOpen) {
				var scroller = ov || window;
				var sy = (scroller === window) ? (window.scrollY || 0) : scroller.scrollTop;
				if (sy > 8) interacted = true;
				autoT += IDLE;
				var t = autoT + sy * SCROLL_K;
				var rect = tallwrap.getBoundingClientRect();

				var dA = '', dB = '', s, y, th, x1, x2;
				for (s = 0; s <= SAMPLES; s++) {
					y = H * s / SAMPLES;
					th = t + (s / SAMPLES) * N * TWIST;
					x1 = CX + AMP * Math.sin(th);
					x2 = CX + AMP * Math.sin(th + Math.PI);
					dA += (s ? 'L' : 'M') + x1.toFixed(1) + ' ' + y.toFixed(1);
					dB += (s ? 'L' : 'M') + x2.toFixed(1) + ' ' + y.toFixed(1);
				}
				sA.forEach(function (p) { p.setAttribute('d', dA); });
				sB.forEach(function (p) { p.setAttribute('d', dB); });

				for (var i = 0; i < N; i++) {
					var th2 = t + (i + 0.5) * TWIST;
					var sn = Math.sin(th2), dn = (Math.cos(th2) + 1) / 2;
					var x = CX + AMP * sn, yy = nodes[i].y;
					nodes[i].x = x;
					var rg = rungs[i];
					rg.setAttribute('x1', x.toFixed(1)); rg.setAttribute('y1', yy.toFixed(1));
					rg.setAttribute('x2', (CX - AMP * sn).toFixed(1)); rg.setAttribute('y2', yy.toFixed(1));
					rg.setAttribute('opacity', (0.45 + 0.45 * dn).toFixed(2));
					var nd = nodes[i], isSel = (i === selectIdx), isHov = (i === hoverIdx);
					var r = (isSel || isHov) ? 25 + 2 * Math.sin(t * 6) : 12 + 9 * dn;
					nodes[i].sx = rect.left + x / W * rect.width;
					nodes[i].sy = rect.top + yy;
					nd.ball.setAttribute('cx', x.toFixed(1));
					nd.ball.setAttribute('cy', yy.toFixed(1));
					nd.ball.setAttribute('r', r.toFixed(1));
					nd.ball.setAttribute('opacity', (0.35 + 0.65 * dn).toFixed(2));
					nd.hit.setAttribute('cx', x.toFixed(1));
					nd.hit.setAttribute('cy', yy.toFixed(1));
					var lab = nd.lab, lo = dn > 0.5 ? ((dn - 0.5) * 1.9).toFixed(2) : 0;
					var nearEdge = Math.abs(x - CX) > AMP * 0.72;
					var side = nearEdge ? (x >= CX ? -1 : 1) : (x >= CX ? 1 : -1);
					lab.setAttribute('x', (x + side * (r + 10)).toFixed(1));
					lab.setAttribute('y', yy.toFixed(1));
					lab.setAttribute('text-anchor', side > 0 ? 'start' : 'end');
					lab.setAttribute('opacity', (isSel || isHov) ? 1 : lo);
				}

				/* 工具球：钉在 B 旋臂横杆另一端；重叠时往后挪格（章节优先） */
				var occupied = {};
				utils.forEach(function (u) {
					var chosen = -1;
					for (var s = u.home; s < N; s++) {
						if (occupied[s]) continue;
						var d = Math.abs(2 * AMP * Math.sin(t + (s + 0.5) * TWIST));
						var need = (s === u.slot) ? 40 : 48;
						if (d >= need) { chosen = s; break; }
					}
					if (chosen < 0) chosen = u.home;
					occupied[chosen] = true;
					u.slot = chosen;
					var yyu = (chosen + 0.5) * pitch;
					var tx = CX - AMP * Math.sin(t + (chosen + 0.5) * TWIST);
					if (u.cx === null) { u.cx = tx; u.cy = yyu; }
					else { u.cx += (tx - u.cx) * 0.2; u.cy += (yyu - u.cy) * 0.2; }
					u.sx = rect.left + u.cx / W * rect.width;
					u.sy = rect.top + u.cy;
					u.g.setAttribute('transform', 'translate(' + u.cx.toFixed(1) + ' ' + u.cy.toFixed(1) + ')');
					/* 标签避让：球在右半边时标签放左边 */
					var lside = u.cx >= CX ? -1 : 1;
					u.lab.setAttribute('x', (lside * 24).toFixed(0));
					u.lab.setAttribute('text-anchor', lside > 0 ? 'start' : 'end');
				});

				/* 背景：悬停 > 选中 > 滚动（首屏保持封面） */
				var rect2 = rect;
				var midY = window.innerHeight * 0.5;
				var best = 0, bd = 1e12;
				for (var j = 0; j < N; j++) {
					var dd = Math.abs(rect2.top + (j + 0.5) * pitch - midY);
					if (dd < bd) { bd = dd; best = j; }
				}
				scrollIdx = best;
				var bgEff = !interacted ? -1 : (hoverIdx >= 0 ? hoverIdx : (selectIdx >= 0 ? selectIdx : scrollIdx));
				if (bgEff !== shownEff) {
					shownEff = bgEff;
					showBG(bgEff < 0 ? COVER : imgURL(CHAPTERS[bgEff]));
				}

				/* 粒子 */
				if (now - lastAmb > 700 && parts.length < 240) {
					lastAmb = now;
					parts.push({ x: Math.random() * window.innerWidth, y: window.innerHeight + 8,
						vx: (Math.random() - 0.5) * 0.3, vy: -0.25 - Math.random() * 0.4,
						life: 0.5, decay: 0.0022, r: 1 + Math.random() * 1.8, c: '#a03a2c' });
				}
				ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
				for (var k = parts.length - 1; k >= 0; k--) {
					var p = parts[k];
					p.x += p.vx; p.y += p.vy; p.vy -= 0.008; p.life -= p.decay;
					if (p.life <= 0 || p.y < -20) { parts.splice(k, 1); continue; }
					ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
					ctx.fillStyle = p.c;
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r, 0, 6.283);
					ctx.fill();
				}
				ctx.globalAlpha = 1;
			}
			requestAnimationFrame(frame);
		}

		paintUtilLabs();
		layout();
		paintSelection();
		requestAnimationFrame(frame);
	}

	document.addEventListener('DOMContentLoaded', function () {
		var stages = document.querySelectorAll('.dna-stage');
		for (var i = 0; i < stages.length; i++) init(stages[i]);

		var toggle = document.getElementById('dnaToggle');
		var overlay = document.getElementById('dnaOverlay');
		if (toggle && overlay) {
			toggle.addEventListener('click', function () {
				if (overlay.hasAttribute('hidden')) {
					overlay.removeAttribute('hidden');
					document.body.style.overflow = 'hidden';
					toggle.classList.add('open');
				} else {
					closeOverlay();
				}
			});
			document.addEventListener('keydown', function (e) {
				if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeOverlay();
			});
		}

		/* 直接以 #rN 进入阅读 */
		var m = /^#r(\d+)$/.exec(location.hash);
		if (m && window.Reader) {
			var idx = parseInt(m[1], 10) - 1;
			if (idx >= 0 && idx < CHAPTERS.length) {
				window.Reader.open(idx, window.innerWidth * 0.5, window.innerHeight * 0.5, { noHash: true });
			}
		}
	});
})();
