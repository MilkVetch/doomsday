/* DNA 章节目录：SVG 旋转双螺旋，每节点一章节；悬停预览插画，点击进入 */
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

	var W = 400, H = 920, CX = 200, AMP = 132, TOP = 64, BOT = 856;
	var N = CHAPTERS.length, TWIST = 0.62, SPEED = 0.0075, SAMPLES = 130;
	var COVER = BASE + '/img/secretfiles.jpg';

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
		var wrap = stage.querySelector('.dna-svg-wrap');
		var layers = stage.querySelectorAll('.dna-bg-layer');
		var capNum = stage.querySelector('.dna-cap-num');
		var capTitle = stage.querySelector('.dna-cap-title');
		var capGo = stage.querySelector('.dna-cap-go');
		var hint = stage.querySelector('.dna-hint');
		if (!wrap) return;

		var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid meet' });
		wrap.appendChild(svg);
		var defs = el('defs', {});
		defs.innerHTML = '<filter id="dnaGlow" x="-60%" y="-60%" width="220%" height="220%">' +
			'<feGaussianBlur stdDeviation="3.2" result="b"/>' +
			'<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
		svg.appendChild(defs);

		var gRung = el('g', {});
		var gStrand = el('g', { filter: 'url(#dnaGlow)' });
		var gNode = el('g', {});
		var pathA = el('path', { fill: 'none', stroke: '#ec3529', 'stroke-width': 2.6, opacity: 0.9 });
		var pathB = el('path', { fill: 'none', stroke: '#8f1f16', 'stroke-width': 2, opacity: 0.85 });
		gStrand.appendChild(pathA);
		gStrand.appendChild(pathB);
		svg.appendChild(gRung);
		svg.appendChild(gStrand);
		svg.appendChild(gNode);

		var rungs = [], nodes = [];
		for (var i = 0; i < N; i++) {
			var y = TOP + (BOT - TOP) * i / (N - 1);
			var rung = el('line', { stroke: '#6e1f18', 'stroke-width': 1, opacity: 0.55 });
			gRung.appendChild(rung);
			rungs.push(rung);
			var g = el('g', { 'class': 'dna-node' });
			var hit = el('circle', { r: 18, fill: 'rgba(0,0,0,0)' });
			var dot = el('circle', { r: 7, fill: '#1c0a08', stroke: '#ec3529', 'stroke-width': 2 });
			var lab = el('text', { 'font-size': 11, fill: '#c05a48', dy: '.35em', opacity: 0 });
			lab.textContent = CHAPTERS[i].n;
			g.appendChild(hit);
			g.appendChild(dot);
			g.appendChild(lab);
			gNode.appendChild(g);
			nodes.push({ g: g, hit: hit, dot: dot, lab: lab, y: y });
		}

		var t = Math.random() * 6.28;
		var selected = -1, shown = null, frontIdx = 0;
		var hoverCapable = window.matchMedia && window.matchMedia('(hover:hover)').matches;
		var onNovelPage = !!document.querySelector('.story-body');
		var novelURL = BASE + '/secretfiles.html';

		function imgURL(c) { return BASE + '/img/chapters/' + c.img; }
		function setCaption(ch) {
			setSpan(capNum, ch ? ch.zhNum : '机密档案', ch ? ch.enNum : 'Secret Files');
			setSpan(capTitle, ch ? ch.zh : '全二十二章', ch ? ch.en : '22 Chapters');
			if (capGo) capGo.hidden = !ch;
		}
		function showBG(src) {
			if (shown === src) return;
			shown = src;
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
		function select(i) {
			selected = i;
			var ch = CHAPTERS[i];
			showBG(imgURL(ch));
			setCaption(ch);
			if (hint) hint.style.opacity = '0';
			[i - 1, i + 1].forEach(function (j) {
				if (j >= 0 && j < N) { var im = new Image(); im.src = imgURL(CHAPTERS[j]); }
			});
		}
		function deselect() {
			if (selected < 0) return;
			selected = -1;
			showBG(COVER);
			setCaption(null);
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
				if (selected === i) go(i);
				else select(i);
			});
			if (hoverCapable) nd.g.addEventListener('mouseenter', function () { select(i); });
		});
		if (hoverCapable) svg.addEventListener('mouseleave', deselect);
		if (capGo) capGo.addEventListener('click', function () { if (selected >= 0) go(selected); });

		/* 默认背景：封面 */
		layers[0].style.backgroundImage = 'url("' + COVER + '")';
		layers[0].classList.add('on');
		shown = COVER;
		setCaption(null);

		function frame() {
			var ov = stage.closest('.dna-overlay');
			if (!document.hidden && !(ov && ov.hasAttribute('hidden'))) {
				t += SPEED;
				var dA = '', dB = '', s, y, th, x1, x2;
				for (s = 0; s <= SAMPLES; s++) {
					y = TOP + (BOT - TOP) * s / SAMPLES;
					th = t + (s / SAMPLES) * (N - 1) * TWIST;
					x1 = CX + AMP * Math.sin(th);
					x2 = CX + AMP * Math.sin(th + Math.PI);
					dA += (s ? 'L' : 'M') + x1.toFixed(1) + ' ' + y.toFixed(1);
					dB += (s ? 'L' : 'M') + x2.toFixed(1) + ' ' + y.toFixed(1);
				}
				pathA.setAttribute('d', dA);
				pathB.setAttribute('d', dB);
				for (var i = 0; i < N; i++) {
					var th2 = t + i * TWIST;
					var sn = Math.sin(th2), dn = (Math.cos(th2) + 1) / 2;
					var x = CX + AMP * sn, yy = nodes[i].y;
					var rg = rungs[i];
					rg.setAttribute('x1', x.toFixed(1)); rg.setAttribute('y1', yy.toFixed(1));
					rg.setAttribute('x2', (CX - AMP * sn).toFixed(1)); rg.setAttribute('y2', yy.toFixed(1));
					var nd = nodes[i], isSel = (i === selected);
					var r = isSel ? 10.5 + 1.6 * Math.sin(t * 5) : 4 + 5 * dn;
					nd.dot.setAttribute('cx', x.toFixed(1));
					nd.dot.setAttribute('cy', yy.toFixed(1));
					nd.dot.setAttribute('r', r.toFixed(1));
					nd.dot.setAttribute('fill', (isSel || dn > 0.5) ? '#ec3529' : '#1c0a08');
					nd.dot.setAttribute('fill-opacity', isSel ? 1 : (0.25 + 0.75 * dn).toFixed(2));
					nd.hit.setAttribute('cx', x.toFixed(1));
					nd.hit.setAttribute('cy', yy.toFixed(1));
					var lab = nd.lab, lo = dn > 0.55 ? ((dn - 0.55) * 2.1).toFixed(2) : 0;
					var side = x >= CX ? 1 : -1;
					lab.setAttribute('x', (x + side * (r + 7)).toFixed(1));
					lab.setAttribute('y', yy.toFixed(1));
					lab.setAttribute('text-anchor', side > 0 ? 'start' : 'end');
					lab.setAttribute('opacity', isSel ? 1 : lo);
				}
			}
			requestAnimationFrame(frame);
		}
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
