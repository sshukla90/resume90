/* =========================================================
   JavaScript: Interactivity, Animations, Network Graph
   ========================================================= */

/* ---- Navbar scroll effect & active link ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link:not(.cta-btn)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Scrolled style
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}, { passive: true });

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksEl.classList.remove('open');
    });
});

/* ---- Dark / Light mode toggle ---- */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const iconMoon = themeToggle.querySelector('.icon-moon');
const iconSun = themeToggle.querySelector('.icon-sun');

// Restore saved preference
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    iconMoon.style.display = 'none';
    iconSun.style.display = 'block';
}

themeToggle.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
        html.removeAttribute('data-theme');
        iconMoon.style.display = 'block';
        iconSun.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        iconMoon.style.display = 'none';
        iconSun.style.display = 'block';
        localStorage.setItem('theme', 'light');
    }
});

/* ---- Intersection Observer: reveal animations ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-item');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger siblings
            const siblings = [...entry.target.parentElement.children]
                .filter(el => el.classList.contains('reveal') || el.classList.contains('reveal-item'));
            const idx = siblings.indexOf(entry.target);

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, idx * 90);

            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Counter animation ---- */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
    };
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ---- Mind Map (SVG canvas) ---- */
function buildMindMap() {
    const container = document.getElementById('network-graph');
    if (!container) return;

    // Landscape canvas — branches spread like a tree
    const W = 900, H = 700, cx = W / 2, cy = H / 2;

    // ── Personal / Health icons (Material 24×24 viewBox) ──
    const personalIcons = {
        heart: 'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
        runner: 'M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z',
        cyclist: 'M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L10 13.4V17h2v-4.5l-2.4-2.4.2-.1zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z',
        nutrition: 'M17 8C8 10 5.9 16.17 3.82 20.83L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c9 0 12-8 12-8-4 0-8 4-8 4s1.5-4 5-5z',
        strength: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z',
    };

    // ── Concept icons (Feather-style, 24×24 viewBox, stroke) ──
    const conceptIcons = {
        cloud: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
        code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    };

    /*  ── BRANCH DATA ──────────────────────────────────────────
        5 branches spread at roughly 72° intervals.
        Hubs sit ~210px from centre; leaves ~120-140px from hub.
        Every node can carry an optional `link` for future hrefs.
    ────────────────────────────────────────────────────────── */
    const branches = [
        /* ── 1. Cloud  (top-right, ~45°) ── */
        {
            id: 'cloud', label: 'Cloud', x: 620, y: 155, r: 36, color: '#3b8bff',
            hubIcon: 'cloud',
            leaves: [
                { id: 'cf', label: 'Cloudflare', x: 540, y: 52, r: 26, color: '#f6821f', cdnSlug: 'cloudflare' },
                { id: 'aws', label: 'AWS', x: 680, y: 48, r: 24, color: '#ff9900', localIcon: 'icons/aws-clean.svg' },
                { id: 'azure', label: 'Azure', x: 790, y: 110, r: 24, color: '#0078d4', localIcon: 'icons/azure.svg' },
            ],
        },
        /* ── 2. Automation  (right, ~110°) ── */
        {
            id: 'automation', label: 'Automation', x: 700, y: 370, r: 34, color: '#a78bfa',
            hubIcon: 'code',
            leaves: [
                { id: 'python', label: 'Python', x: 810, y: 280, r: 24, color: '#3776ab', cdnSlug: 'python' },
                { id: 'tf', label: 'Terraform', x: 840, y: 400, r: 22, color: '#844fba', cdnSlug: 'terraform' },
                { id: 'git', label: 'Git', x: 780, y: 500, r: 20, color: '#f05032', cdnSlug: 'git' },
            ],
        },
        /* ── 3. Security  (bottom-right, ~180°) ── */
        {
            id: 'security', label: 'Security', x: 550, y: 560, r: 32, color: '#ef4444',
            hubIcon: 'shield',
            leaves: [
                { id: 'waf', label: 'WAF', x: 680, y: 600, r: 22, color: '#ef4444' },
                { id: 'dns', label: 'DNS', x: 540, y: 660, r: 22, color: '#06b6d4' },
                { id: 'f5', label: 'F5', x: 410, y: 635, r: 20, color: '#facc15', cdnSlug: 'f5' },
            ],
        },
        /* ── 4. Health  (bottom-left, ~250°) ── */
        {
            id: 'health', label: 'Health', x: 200, y: 530, r: 30, color: '#f97316',
            personal: true, personalIcon: 'heart',
            leaves: [
                { id: 'runner', label: 'Runner', x: 80, y: 480, r: 22, color: '#fb923c', personalIcon: 'runner' },
                { id: 'cyclist', label: 'Cyclist', x: 65, y: 590, r: 20, color: '#fbbf24', personalIcon: 'cyclist' },
                { id: 'strength', label: 'Strength', x: 190, y: 660, r: 20, color: '#f472b6', personalIcon: 'strength' },
                { id: 'nutrition', label: 'Nutrition', x: 320, y: 640, r: 18, color: '#4ade80', personalIcon: 'nutrition' },
            ],
        },
        /* ── 5. Network  (top-left, ~315°) ── */
        {
            id: 'network', label: 'Network', x: 230, y: 170, r: 36, color: '#00e5ff',
            hubIcon: 'layers',
            leaves: [
                { id: 'bgp', label: 'BGP', x: 100, y: 90, r: 24, color: '#00e5ff' },
                { id: 'ospf', label: 'OSPF', x: 90, y: 220, r: 22, color: '#7dd3fc' },
                { id: 'mpls', label: 'MPLS', x: 140, y: 330, r: 22, color: '#7dd3fc' },
            ],
        },
    ];

    // ── SVG scaffold ──
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softglow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
    `;
    svg.appendChild(defs);

    // ── Helper: quadratic bezier with optional pull toward centre ──
    function qCurve(x1, y1, x2, y2, pull = 0.12) {
        const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * pull;
        const my = (y1 + y2) / 2 + (cy - (y1 + y2) / 2) * pull;
        return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    }

    // ── Helper: external label (radially outward from centre) ──
    function externalLabel(n) {
        const dx = n.x - cx, dy = n.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const gap = n.r + 16;
        let lx = n.x + ux * gap;
        let ly = n.y + uy * gap;
        let anchor;
        if (lx > W - 70) { lx = n.x - (n.r + 14); anchor = 'end'; }
        else if (lx < 45) { lx = n.x + (n.r + 14); anchor = 'start'; }
        else if (ux > 0.38) anchor = 'start';
        else if (ux < -0.38) anchor = 'end';
        else anchor = 'middle';
        ly = Math.max(14, Math.min(H - 10, ly));
        return { lx, ly, anchor };
    }

    // ── Helper: hub label (radially inward, on the spoke toward centre) ──
    function hubLabel(n) {
        const dx = n.x - cx, dy = n.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const gap = n.r + 18;
        const lx = n.x - ux * gap;
        const ly = Math.max(14, Math.min(H - 10, n.y - uy * gap));
        let anchor;
        if (ux > 0.38) anchor = 'end';
        else if (ux < -0.38) anchor = 'start';
        else anchor = 'middle';
        return { lx, ly, anchor };
    }

    // ── Helper: create SVG <text> ──
    function makeTxt(x, y, text, color, fontSize, anchor, opts = {}) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x); t.setAttribute('y', y);
        t.setAttribute('text-anchor', anchor);
        t.setAttribute('dominant-baseline', 'middle');
        t.setAttribute('fill', color);
        t.setAttribute('font-family', 'JetBrains Mono, monospace');
        t.setAttribute('font-size', fontSize);
        t.setAttribute('font-weight', opts.weight || '700');
        if (opts.spacing) t.setAttribute('letter-spacing', opts.spacing);
        if (opts.opacity) t.setAttribute('opacity', opts.opacity);
        t.textContent = text;
        return t;
    }

    // ── Connection + packet layers ──
    const connLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const packetLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    function addPacket(pathD, color, dur, begin) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '3');
        dot.setAttribute('fill', color);
        dot.setAttribute('filter', 'url(#glow)');
        const motion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        motion.setAttribute('path', pathD);
        motion.setAttribute('dur', `${dur}s`);
        motion.setAttribute('repeatCount', 'indefinite');
        motion.setAttribute('begin', `${begin}s`);
        const fadeIn = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        fadeIn.setAttribute('attributeName', 'opacity');
        fadeIn.setAttribute('values', '0;0.85');
        fadeIn.setAttribute('begin', `${begin}s`);
        fadeIn.setAttribute('dur', '0.5s');
        fadeIn.setAttribute('fill', 'freeze');
        dot.appendChild(motion);
        dot.appendChild(fadeIn);
        packetLayer.appendChild(dot);
    }

    // Draw connections
    branches.forEach((branch, bi) => {
        const isPersonal = !!branch.personal;
        const delay = bi * 0.18;

        // Centre → Hub
        const mainD = qCurve(cx, cy, branch.x, branch.y);
        const mainP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mainP.setAttribute('d', mainD);
        mainP.setAttribute('stroke', branch.color);
        mainP.setAttribute('stroke-width', isPersonal ? '1.5' : '2.4');
        mainP.setAttribute('fill', 'none');
        if (isPersonal) {
            mainP.style.cssText = `stroke-dasharray:3 6; animation:mmFadeIn 0.9s ease-out ${delay}s both, mmSlowFlow 4s linear ${delay}s infinite;`;
        } else {
            mainP.style.cssText = `stroke-dasharray:6 4; animation:mmFadeInLine 0.9s ease-out ${delay}s both, mmDashFlow 3s linear ${delay}s infinite;`;
            addPacket(mainD, branch.color, 3.5 + bi * 0.3, delay + 1);
        }
        connLayer.appendChild(mainP);

        // Hub → Leaves
        branch.leaves.forEach((leaf, li) => {
            const leafD = qCurve(branch.x, branch.y, leaf.x, leaf.y, 0);
            const leafP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leafP.setAttribute('d', leafD);
            leafP.setAttribute('stroke', leaf.color);
            leafP.setAttribute('stroke-width', '1.4');
            leafP.setAttribute('fill', 'none');
            const leafDelay = delay + 0.5 + li * 0.12;
            if (isPersonal) {
                leafP.style.cssText = `stroke-dasharray:3 6; animation:mmFadeIn 0.7s ease-out ${leafDelay}s both, mmSlowFlow 4s linear ${leafDelay}s infinite;`;
            } else {
                leafP.style.cssText = `stroke-dasharray:6 4; animation:mmFadeInLine 0.7s ease-out ${leafDelay}s both, mmDashFlow 3s linear ${leafDelay}s infinite;`;
                addPacket(leafD, leaf.color, 2.6 + li * 0.3, leafDelay + 0.7);
            }
            connLayer.appendChild(leafP);
        });
    });
    svg.appendChild(connLayer);
    svg.appendChild(packetLayer);

    // ── Node layer ──
    const nodeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Centre node — "SS · 12+ years"
    const cg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    cg.setAttribute('class', 'mm-node');
    const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerRing.setAttribute('cx', cx); outerRing.setAttribute('cy', cy); outerRing.setAttribute('r', '62');
    outerRing.setAttribute('fill', 'none'); outerRing.setAttribute('stroke', '#3b8bff');
    outerRing.setAttribute('stroke-width', '1');
    outerRing.style.animation = 'mmRingPulse 4s ease-in-out infinite';
    const cBody = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cBody.setAttribute('cx', cx); cBody.setAttribute('cy', cy); cBody.setAttribute('r', '48');
    cBody.setAttribute('fill', 'rgba(59,139,255,0.13)');
    cBody.setAttribute('stroke', '#3b8bff'); cBody.setAttribute('stroke-width', '2');
    cBody.setAttribute('filter', 'url(#softglow)');
    cg.appendChild(outerRing);
    cg.appendChild(cBody);
    cg.appendChild(makeTxt(cx, cy - 8, 'SS', '#3b8bff', '22', 'middle'));
    cg.appendChild(makeTxt(cx, cy + 14, '12+ years', '#7dd3fc', '9', 'middle'));
    cg.style.animation = 'mmNodeIn 0.5s ease-out 0s both';
    nodeLayer.appendChild(cg);

    // ── Render a single node (hub or leaf) ──
    function drawNode(n, delay, isPersonal) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'mm-node');

        // Glow ring
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', n.x); ring.setAttribute('cy', n.y); ring.setAttribute('r', n.r + 7);
        ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', n.color); ring.setAttribute('stroke-width', '1');
        ring.style.animation = `mmRingPulse 3s ease-in-out ${(Math.random() * 2).toFixed(1)}s infinite`;

        // Body
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        body.setAttribute('cx', n.x); body.setAttribute('cy', n.y); body.setAttribute('r', n.r);
        body.setAttribute('fill', `rgba(${hexToRgb(n.color)},0.12)`);
        body.setAttribute('stroke', n.color);
        body.setAttribute('stroke-width', isPersonal ? '1.2' : '1.5');
        if (isPersonal) body.setAttribute('stroke-dasharray', '4 2');

        g.appendChild(ring);
        g.appendChild(body);

        // ── Icon rendering (priority: localIcon > cdnSlug > personalIcon > hubIcon > text) ──
        if (n.localIcon || n.cdnSlug) {
            // Brand logo
            const url = n.localIcon
                ? n.localIcon
                : `https://cdn.simpleicons.org/${n.cdnSlug}/${n.color.replace('#', '')}`;
            const sz = n.r * 1.2;
            const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            img.setAttribute('href', url);
            img.setAttribute('x', n.x - sz / 2); img.setAttribute('y', n.y - sz / 2);
            img.setAttribute('width', sz); img.setAttribute('height', sz);
            img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            g.appendChild(img);
            const { lx, ly, anchor } = externalLabel(n);
            g.appendChild(makeTxt(lx, ly, n.label, n.color, '12', anchor, { spacing: '0.5' }));

        } else if (n.personalIcon && personalIcons[n.personalIcon]) {
            // Health / personal filled icon
            const sz = n.r * 1.15;
            const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            wrap.setAttribute('x', n.x - sz / 2); wrap.setAttribute('y', n.y - sz / 2);
            wrap.setAttribute('width', sz); wrap.setAttribute('height', sz);
            wrap.setAttribute('viewBox', '0 0 24 24');
            const ip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            ip.setAttribute('d', personalIcons[n.personalIcon]);
            ip.setAttribute('fill', n.color); ip.setAttribute('opacity', '0.85');
            wrap.appendChild(ip);
            g.appendChild(wrap);
            const { lx, ly, anchor } = externalLabel(n);
            g.appendChild(makeTxt(lx, ly, n.label, n.color, '12', anchor, { spacing: '0.5' }));

        } else if (n.hubIcon && conceptIcons[n.hubIcon]) {
            // Hub concept icon (stroke)
            const sz = n.r * 1.3;
            const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            wrap.setAttribute('x', n.x - sz / 2); wrap.setAttribute('y', n.y - sz / 2);
            wrap.setAttribute('width', sz); wrap.setAttribute('height', sz);
            wrap.setAttribute('viewBox', '0 0 24 24');
            const ip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            ip.setAttribute('d', conceptIcons[n.hubIcon]);
            ip.setAttribute('fill', 'none');
            ip.setAttribute('stroke', n.color);
            ip.setAttribute('stroke-width', '1.8');
            ip.setAttribute('stroke-linecap', 'round');
            ip.setAttribute('stroke-linejoin', 'round');
            ip.setAttribute('opacity', '0.9');
            wrap.appendChild(ip);
            g.appendChild(wrap);
            const { lx, ly, anchor } = hubLabel(n);
            g.appendChild(makeTxt(lx, ly, n.label, n.color, '13', anchor, { spacing: '0.5' }));

        } else {
            // Text-only leaf (BGP, OSPF, MPLS, WAF, DNS)
            g.appendChild(makeTxt(n.x, n.y + 1, n.label, n.color, n.r < 20 ? '9' : '10', 'middle'));
            const { lx, ly, anchor } = externalLabel(n);
            g.appendChild(makeTxt(lx, ly, n.label, n.color, '12', anchor, { spacing: '0.5', opacity: '0.7' }));
        }

        // Optional link wrapper (future-proof: add `link: "url"` to any node)
        if (n.link) {
            const a = document.createElementNS('http://www.w3.org/2000/svg', 'a');
            a.setAttribute('href', n.link);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener');
            a.style.cursor = 'pointer';
            // Move all children into the <a>
            while (g.firstChild) a.appendChild(g.firstChild);
            g.appendChild(a);
        }

        g.style.animation = `mmNodeIn 0.45s ease-out ${delay}s both`;
        return g;
    }

    // Draw all branches
    branches.forEach((branch, bi) => {
        const isPersonal = !!branch.personal;
        const hubDelay = bi * 0.2 + 0.3;
        nodeLayer.appendChild(drawNode(branch, hubDelay, isPersonal));
        branch.leaves.forEach((leaf, li) => {
            nodeLayer.appendChild(drawNode(leaf, hubDelay + 0.45 + li * 0.12, isPersonal));
        });
    });
    svg.appendChild(nodeLayer);

    // ── CSS keyframes (injected into SVG) ──
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        .mm-node  { transform-box: fill-box; transform-origin: center; }
        @keyframes mmFadeInLine { from { opacity: 0; } to { opacity: 0.45; } }
        @keyframes mmFadeIn     { from { opacity: 0; } to { opacity: 0.30; } }
        @keyframes mmDashFlow   { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -20; } }
        @keyframes mmSlowFlow   { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -18; } }
        @keyframes mmRingPulse  { 0%,100%{opacity:.08} 50%{opacity:.3} }
        @keyframes mmNodeIn     { from { opacity:0; transform:scale(0.3); } to { opacity:1; transform:scale(1); } }
    `;
    svg.appendChild(style);

    container.appendChild(svg);
}


function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
        : '59,139,255';
}

buildMindMap();

/* ---- Smooth scroll offset for fixed nav ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    });
});

/* ---- Skill tag hover ripple ---- */
document.querySelectorAll('.skill-tags span, .tech-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'scale(1.08)';
    });
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = '';
    });
});

/* ---- Typing cursor effect on hero name ---- */
(function typewriterHero() {
    const badge = document.querySelector('.hero-badge');
    if (!badge) return;
    const texts = [
        'Senior Cloud Engineer',
        'BGP · OSPF · MPLS Expert',
        'Cloudflare Platform Engineer',
        'Network Automation Pro',
        'Network Architect',
    ];
    let i = 0, j = 0, deleting = false;
    const originalText = badge.textContent.trim();

    // Clear badge text, keep just the typing slot (dot is handled by ::before CSS)
    badge.textContent = '';
    const slot = document.createElement('span');
    badge.appendChild(slot);
    // Initialise slot with zero-width space so badge is full height from the start
    slot.textContent = '\u200b';

    function tick() {
        const full = texts[i];
        if (!deleting) {
            const next = full.slice(0, j++);
            slot.textContent = next || '\u200b'; // never empty — preserves badge height
            if (j > full.length) { setTimeout(tick, 2000); deleting = true; return; }
        } else {
            const prev = full.slice(0, j--);
            slot.textContent = prev || '\u200b'; // never empty — preserves badge height
            if (j < 0) { deleting = false; i = (i + 1) % texts.length; j = 0; }
        }
        setTimeout(tick, deleting ? 40 : 75);
    }
    tick();
})();
