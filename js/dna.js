/* DNA 章节目录 v2：球棍模型 · 页面可滚动 · 滚动联动旋转 · 悬停粒子 */
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

	var N = CHAPTERS.length;
	var TWIST = 0.62;        /* 相邻节点扭转角 */
	var SCROLL_K = 0.0038;   /* 滚动带动旋转系数 */
	var IDLE = 0.0032;       /* 静止时缓慢自转 */
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

	function init(stage) {
		var tallwrap = stage.querySelector('.dna-tallwrap');
		var layers = stage.querySelectorAll('.dna-bg-layer');
		var curNum = stage.querySelector('.dna-cur-num');
		var curTitle = stage.querySelector('.dna-cur-title');
		var goBtn = stage.querySelector('.dna-go');
		var canvas = stage.querySelector('.dna-fx');
		if (!tallwrap || !canvas) return;
		var ctx = canvas.getContext('2d');

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
		/* 主链 A：三层管壁；副链 B：同结构偏暗 */
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

		var rungs = [], nodes = [];
		for (var i = 0; i < N; i++) {
			var rung = el('line', { stroke: '#8f2a1e', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 });
			gRung.appendChild(rung);
			rungs.push(rung);
			var g = el('g', { 'class': 'dna-node' });
			var hit = el('circle', { r: 34, fill: 'rgba(0,0,0,0)' });
			var ball = el('circle', { fill: 'url(#ballGrad)', stroke: '#ff9a8a', 'stroke-width': 1.4, opacity: 0.95 });
			var lab = el('text', { 'font-size': 14, fill: '#d98a76', dy: '.35em', opacity: 0 });
			lab.textContent = CHAPTERS[i].n;
			g.appendChild(hit);
			g.appendChild(ball);
			g.appendChild(lab);
			gNode.appendChild(g);
			nodes.push({ g: g, hit: hit, ball: ball, lab: lab, y: 0, x: 0 });
		}

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
			/* CSS 若还没生效导致量错高度，稍后重试 */
			if (H < 200) setTimeout(layout, 600);
		}
		function sizeCanvas() {
			var dpr = Math.min(2, window.devicePixelRatio || 1);
			canvas.width = Math.round(window.innerWidth * dpr);
			canvas.height = Math.round(window.innerHeight * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		var autoT = Math.random() * 6.28;
		var hoverIdx = -1, scrollIdx = 0, shownEff = -2, shownBG = null, frontIdx = 0;
		var hoverCapable = window.matchMedia && window.matchMedia('(hover:hover)').matches;
		var onNovelPage = !!document.querySelector('.story-body');
		var novelURL = BASE + '/secretfiles.html';
		var parts = [], lastAmb = 0;

		function imgURL(c) { return BASE + '/img/chapters/' + c.img; }
		function setPanel(ch) {
			setSpan(curNum, ch.zhNum, ch.enNum);
			setSpan(curTitle, ch.zh, ch.en);
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
		function go(i) {
			var anchor = CHAPTERS[i].anchor;
			if (onNovelPage) {
				closeOverlay();
				var tgt = document.getElementById(anchor);
				try { history.replaceState(null, '', '#' + anchor); } catch (e) {}
				if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
				else location.hash = '#' + anchor;
			} else {
				location.href = novelURL + '#' + anchor;
			}
		}

		nodes.forEach(function (nd, i) {
			nd.g.addEventListener('click', function (ev) {
				ev.stopPropagation();
				if (!hoverCapable && hoverIdx !== i) {
					hoverIdx = i;
					var p = nodeScreen(i); burst(p[0], p[1]);
				} else {
					go(i);
				}
			});
			if (hoverCapable) {
				nd.g.addEventListener('mouseenter', function () {
					hoverIdx = i;
					var p = nodeScreen(i); burst(p[0], p[1]);
				});
			}
		});
		if (hoverCapable) svg.addEventListener('mouseleave', function () { hoverIdx = -1; });
		if (goBtn) goBtn.addEventListener('click', function () {
			var eff = hoverIdx >= 0 ? hoverIdx : scrollIdx;
			go(eff);
		});

		layers[0].style.backgroundImage = 'url("' + COVER + '")';
		layers[0].classList.add('on');
		shownBG = COVER;

		var rsz;
		window.addEventListener('resize', function () {
			clearTimeout(rsz);
			rsz = setTimeout(layout, 200);
		});

		function frame(now) {
			var ov = stage.closest('.dna-overlay');
			var hidden = ov && ov.hasAttribute('hidden');
			if (!document.hidden && !hidden) {
				var scroller = ov || window;
				var sy = (scroller === window) ? (window.scrollY || 0) : scroller.scrollTop;
				autoT += IDLE;
				var t = autoT + sy * SCROLL_K;

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
					var nd = nodes[i], isHov = (i === hoverIdx);
					var r = isHov ? 25 + 2 * Math.sin(t * 6) : 12 + 9 * dn;
					nd.ball.setAttribute('cx', x.toFixed(1));
					nd.ball.setAttribute('cy', yy.toFixed(1));
					nd.ball.setAttribute('r', r.toFixed(1));
					nd.ball.setAttribute('opacity', (0.35 + 0.65 * dn).toFixed(2));
					nd.hit.setAttribute('cx', x.toFixed(1));
					nd.hit.setAttribute('cy', yy.toFixed(1));
					var lab = nd.lab, lo = dn > 0.5 ? ((dn - 0.5) * 1.9).toFixed(2) : 0;
					/* 靠近边缘时标签改放内侧，防被裁 */
					var nearEdge = Math.abs(x - CX) > AMP * 0.72;
					var side = nearEdge ? (x >= CX ? -1 : 1) : (x >= CX ? 1 : -1);
					lab.setAttribute('x', (x + side * (r + 9)).toFixed(1));
					lab.setAttribute('y', yy.toFixed(1));
					lab.setAttribute('text-anchor', side > 0 ? 'start' : 'end');
					lab.setAttribute('opacity', isHov ? 1 : lo);
				}

				/* 当前章节：视口中央最近的节点 */
				var rect = tallwrap.getBoundingClientRect();
				var midY = window.innerHeight * 0.5;
				var best = 0, bd = 1e12;
				for (var j = 0; j < N; j++) {
					var dd = Math.abs(rect.top + (j + 0.5) * pitch - midY);
					if (dd < bd) { bd = dd; best = j; }
				}
				scrollIdx = best;
				var eff = hoverIdx >= 0 ? hoverIdx : scrollIdx;
				if (eff !== shownEff) {
					shownEff = eff;
					var ch = CHAPTERS[eff];
					setPanel(ch);
					showBG(imgURL(ch));
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

		layout();
		setPanel(CHAPTERS[0]);
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
	});
})();
