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

    const W = 560, H = 560, cx = W / 2, cy = H / 2;

    // Personal activity icons (Material Icons 24×24)
    const personalIcons = {
        heart:     'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
        runner:    'M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z',
        cyclist:   'M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L10 13.4V17h2v-4.5l-2.4-2.4.2-.1zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z',
        nutrition: 'M17 8C8 10 5.9 16.17 3.82 20.83L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c9 0 12-8 12-8-4 0-8 4-8 4s1.5-4 5-5z',
    };

    // 5 branches — Automation & Security shifted left vs v1 to give labels breathing room
    const branches = [
        {
            id: 'cloud', label: 'Cloud', x: 280, y: 108, r: 30, color: '#3b8bff',
            leaves: [
                { id: 'cf',    label: 'Cloudflare', x: 182, y: 48,  r: 24, color: '#f6821f', cdnSlug: 'cloudflare' },
                { id: 'aws',   label: 'AWS',        x: 285, y: 38,  r: 21, color: '#ff9900', localIcon: 'icons/aws-clean.svg' },
                { id: 'azure', label: 'Azure',      x: 378, y: 58,  r: 21, color: '#0078d4', localIcon: 'icons/azure.svg' },
            ],
        },
        {
            id: 'automation', label: 'Automation', x: 420, y: 200, r: 28, color: '#a78bfa',
            leaves: [
                { id: 'python', label: 'Python',    x: 472, y: 118, r: 20, color: '#3776ab', cdnSlug: 'python' },
                { id: 'tf',     label: 'Terraform', x: 488, y: 212, r: 17, color: '#a78bfa' },
                { id: 'iac',    label: 'IaC / Git', x: 452, y: 292, r: 16, color: '#c4b5fd' },
            ],
        },
        {
            id: 'security', label: 'Security', x: 392, y: 392, r: 27, color: '#ef4444',
            leaves: [
                { id: 'waf', label: 'WAF',   x: 450, y: 334, r: 17, color: '#ef4444' },
                { id: 'dns', label: 'DNS',   x: 450, y: 422, r: 17, color: '#06b6d4' },
                { id: 'f5',  label: 'F5/FW', x: 380, y: 460, r: 16, color: '#facc15' },
            ],
        },
        {
            id: 'personal', label: 'Endurance', x: 135, y: 400, r: 25, color: '#f97316',
            personal: true, personalIcon: 'heart',
            leaves: [
                { id: 'runner',    label: 'Runner',    x: 65,  y: 352, r: 18, color: '#fb923c', personalIcon: 'runner'    },
                { id: 'cyclist',   label: 'Cyclist',   x: 58,  y: 440, r: 17, color: '#fbbf24', personalIcon: 'cyclist'   },
                { id: 'nutrition', label: 'Nutrition', x: 155, y: 472, r: 15, color: '#4ade80', personalIcon: 'nutrition' },
            ],
        },
        {
            id: 'network', label: 'Network', x: 92, y: 208, r: 30, color: '#00e5ff',
            leaves: [
                { id: 'bgp',  label: 'BGP',  x: 36, y: 140, r: 20, color: '#00e5ff' },
                { id: 'ospf', label: 'OSPF', x: 28, y: 232, r: 17, color: '#7dd3fc' },
                { id: 'mpls', label: 'MPLS', x: 55, y: 312, r: 17, color: '#7dd3fc' },
            ],
        },
    ];

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
            <feGaussianBlur stdDeviation="10" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
    `;
    svg.appendChild(defs);

    // Quadratic bezier helper
    function qCurve(x1, y1, x2, y2, pull = 0.08) {
        const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * pull;
        const my = (y1 + y2) / 2 + (cy - (y1 + y2) / 2) * pull;
        return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    }

    // External label: placed radially outward, edge-aware text-anchor
    function externalLabelAttrs(n) {
        const dx = n.x - cx, dy = n.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const gap = n.r + 14;
        let lx = n.x + ux * gap;
        let ly = n.y + uy * gap;
        let anchor;

        // Clamp right edge: label would overflow → flip to left of circle
        if (lx > W - 55) { lx = n.x - (n.r + 11); anchor = 'end'; }
        else if (lx < 18) { lx = n.x + (n.r + 11); anchor = 'start'; }
        else if (ux > 0.42)  anchor = 'start';
        else if (ux < -0.42) anchor = 'end';
        else                  anchor = 'middle';

        ly = Math.max(10, Math.min(H - 6, ly));
        return { lx, ly, anchor };
    }

    // SVG text element builder
    function makeTxt(x, y, text, color, fontSize, anchor) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x); t.setAttribute('y', y);
        t.setAttribute('text-anchor', anchor);
        t.setAttribute('dominant-baseline', 'middle');
        t.setAttribute('fill', color);
        t.setAttribute('font-family', 'JetBrains Mono, monospace');
        t.setAttribute('font-size', fontSize);
        t.setAttribute('font-weight', '700');
        t.textContent = text;
        return t;
    }

    // --- Connection layer + animated data packets ---
    const connLayer   = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const packetLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    function addPacket(pathD, color, dur, begin) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '2.5');
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

    branches.forEach((branch, bi) => {
        const isPersonal = !!branch.personal;
        const delay = bi * 0.2;

        // Centre → Hub path
        const mainD = qCurve(cx, cy, branch.x, branch.y);
        const mainP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mainP.setAttribute('d', mainD);
        mainP.setAttribute('stroke', branch.color);
        mainP.setAttribute('stroke-width', isPersonal ? '1.5' : '2.2');
        mainP.setAttribute('fill', 'none');
        if (isPersonal) {
            // Dotted: fade-in + slow continuous flow
            mainP.style.cssText = `stroke-dasharray:3 5; animation:mmFadeIn 0.9s ease-out ${delay}s both, mmSlowFlow 4s linear ${delay}s infinite;`;
        } else {
            // Dashed: fade-in to full opacity, then continuous flow
            mainP.style.cssText = `stroke-dasharray:5 4; animation:mmFadeInLine 0.9s ease-out ${delay}s both, mmDashFlow 3s linear ${delay}s infinite;`;
            addPacket(mainD, branch.color, 3.2 + bi * 0.3, delay + 1);
        }
        connLayer.appendChild(mainP);

        // Hub → Leaf paths
        branch.leaves.forEach((leaf, li) => {
            const leafD = qCurve(branch.x, branch.y, leaf.x, leaf.y, 0);
            const leafP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leafP.setAttribute('d', leafD);
            leafP.setAttribute('stroke', leaf.color);
            leafP.setAttribute('stroke-width', '1.2');
            leafP.setAttribute('fill', 'none');
            const leafDelay = delay + 0.55 + li * 0.12;
            if (isPersonal) {
                leafP.style.cssText = `stroke-dasharray:3 5; animation:mmFadeIn 0.7s ease-out ${leafDelay}s both, mmSlowFlow 4s linear ${leafDelay}s infinite;`;
            } else {
                leafP.style.cssText = `stroke-dasharray:5 4; animation:mmFadeInLine 0.7s ease-out ${leafDelay}s both, mmDashFlow 3s linear ${leafDelay}s infinite;`;
                addPacket(leafD, leaf.color, 2.4 + li * 0.35, leafDelay + 0.7);
            }
            connLayer.appendChild(leafP);
        });
    });

    svg.appendChild(connLayer);
    svg.appendChild(packetLayer);

    // --- Node layer ---
    const nodeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Centre node
    const centerG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    centerG.setAttribute('class', 'mm-node');

    const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerRing.setAttribute('cx', cx); outerRing.setAttribute('cy', cy); outerRing.setAttribute('r', '56');
    outerRing.setAttribute('fill', 'none'); outerRing.setAttribute('stroke', '#3b8bff');
    outerRing.setAttribute('stroke-width', '1');
    outerRing.style.animation = 'mmRingPulse 4s ease-in-out infinite';

    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', cx); centerCircle.setAttribute('cy', cy); centerCircle.setAttribute('r', '44');
    centerCircle.setAttribute('fill', 'rgba(59,139,255,0.13)');
    centerCircle.setAttribute('stroke', '#3b8bff'); centerCircle.setAttribute('stroke-width', '2');
    centerCircle.setAttribute('filter', 'url(#softglow)');

    centerG.appendChild(outerRing);
    centerG.appendChild(centerCircle);
    centerG.appendChild(makeTxt(cx, cy - 7, 'SS',        '#3b8bff', '18', 'middle'));
    centerG.appendChild(makeTxt(cx, cy + 11, '12+ years', '#7dd3fc', '7',  'middle'));
    centerG.style.animation = 'mmNodeIn 0.5s ease-out 0s both';
    nodeLayer.appendChild(centerG);

    // Render one node (hub or leaf)
    function drawNode(n, delay, isPersonal) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'mm-node');

        // Glow ring
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', n.x); ring.setAttribute('cy', n.y); ring.setAttribute('r', n.r + 6);
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

        const isHub = n.r >= 25;

        if (n.localIcon || n.cdnSlug) {
            // Brand icon: fills circle, label goes OUTSIDE
            const url = n.localIcon
                ? n.localIcon
                : `https://cdn.simpleicons.org/${n.cdnSlug}/${n.color.replace('#', '')}`;
            const sz = n.r * 1.18;
            const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            img.setAttribute('href', url);
            img.setAttribute('x', n.x - sz / 2); img.setAttribute('y', n.y - sz / 2);
            img.setAttribute('width', sz); img.setAttribute('height', sz);
            img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            g.appendChild(img);
            const { lx, ly, anchor } = externalLabelAttrs(n);
            g.appendChild(makeTxt(lx, ly, n.label, n.color, '10', anchor));

        } else if (n.personalIcon && personalIcons[n.personalIcon]) {
            // Personal icon: fills circle, label goes OUTSIDE
            const sz = n.r * 1.12;
            const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            wrap.setAttribute('x', n.x - sz / 2); wrap.setAttribute('y', n.y - sz / 2);
            wrap.setAttribute('width', sz); wrap.setAttribute('height', sz);
            wrap.setAttribute('viewBox', '0 0 24 24');
            const ip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            ip.setAttribute('d', personalIcons[n.personalIcon]);
            ip.setAttribute('fill', n.color); ip.setAttribute('opacity', '0.85');
            wrap.appendChild(ip);
            g.appendChild(wrap);
            const { lx, ly, anchor } = externalLabelAttrs(n);
            g.appendChild(makeTxt(lx, ly, n.label, n.color, '10', anchor));

        } else if (isHub) {
            // Hub text node (Cloud, Network, Automation, Security): label INSIDE at 10px
            g.appendChild(makeTxt(n.x, n.y, n.label, n.color, '10', 'middle'));

        } else {
            // Leaf text node (BGP, OSPF, MPLS, Terraform, IaC/Git): label OUTSIDE at 10px
            const { lx, ly, anchor } = externalLabelAttrs(n);
            g.appendChild(makeTxt(lx, ly, n.label, n.color, '10', anchor));
        }

        g.style.animation = `mmNodeIn 0.45s ease-out ${delay}s both`;
        return g;
    }

    branches.forEach((branch, bi) => {
        const isPersonal = !!branch.personal;
        const hubDelay = bi * 0.2 + 0.3;
        nodeLayer.appendChild(drawNode(branch, hubDelay, isPersonal));
        branch.leaves.forEach((leaf, li) => {
            nodeLayer.appendChild(drawNode(leaf, hubDelay + 0.5 + li * 0.12, isPersonal));
        });
    });

    svg.appendChild(nodeLayer);

    // CSS keyframes injected into SVG
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        .mm-node  { transform-box: fill-box; transform-origin: center; }
        @keyframes mmFadeInLine { from { opacity: 0; } to { opacity: 0.42; } }
        @keyframes mmFadeIn     { from { opacity: 0; } to { opacity: 0.30; } }
        @keyframes mmDashFlow   { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -18; } }
        @keyframes mmSlowFlow   { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -16; } }
        @keyframes mmRingPulse  { 0%,100%{opacity:.08} 50%{opacity:.28} }
        @keyframes mmNodeIn     { from { opacity:0; transform:scale(0.35); } to { opacity:1; transform:scale(1); } }
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
