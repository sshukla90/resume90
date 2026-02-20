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

    // Personal activity icons (Material Icons, 24×24 viewBox, filled paths)
    const personalIcons = {
        heart:     'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
        runner:    'M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z',
        cyclist:   'M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L10 13.4V17h2v-4.5l-2.4-2.4.2-.1zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z',
        nutrition: 'M17 8C8 10 5.9 16.17 3.82 20.83L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c9 0 12-8 12-8-4 0-8 4-8 4s1.5-4 5-5z',
    };

    // 5 branches: 4 tech + 1 personal (warm, always visible but subtle)
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
            id: 'automation', label: 'Automation', x: 440, y: 200, r: 28, color: '#a78bfa',
            leaves: [
                { id: 'python', label: 'Python',    x: 492, y: 118, r: 20, color: '#3776ab', cdnSlug: 'python' },
                { id: 'tf',     label: 'Terraform', x: 508, y: 212, r: 17, color: '#a78bfa' },
                { id: 'iac',    label: 'IaC / Git', x: 472, y: 298, r: 16, color: '#c4b5fd' },
            ],
        },
        {
            id: 'security', label: 'Security', x: 400, y: 400, r: 27, color: '#ef4444',
            leaves: [
                { id: 'waf', label: 'WAF',   x: 462, y: 340, r: 17, color: '#ef4444' },
                { id: 'dns', label: 'DNS',   x: 462, y: 428, r: 17, color: '#06b6d4' },
                { id: 'f5',  label: 'F5/FW', x: 390, y: 465, r: 16, color: '#facc15' },
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

    // Quadratic bezier: midpoint control pulled slightly toward canvas centre
    function qCurve(x1, y1, x2, y2, inward = 0.1) {
        const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * inward;
        const my = (y1 + y2) / 2 + (cy - (y1 + y2) / 2) * inward;
        return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    }

    // --- Connection layer ---
    const connLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    branches.forEach((branch, bi) => {
        const isPersonal = !!branch.personal;
        const delay = bi * 0.18;

        // Centre → Hub
        const mainP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mainP.setAttribute('d', qCurve(cx, cy, branch.x, branch.y));
        mainP.setAttribute('stroke', branch.color);
        mainP.setAttribute('stroke-width', isPersonal ? '1.5' : '2.2');
        mainP.setAttribute('fill', 'none');
        if (isPersonal) {
            mainP.style.cssText = `stroke-dasharray:5 4; animation:mmFadeIn 0.9s ease-out ${delay}s both;`;
        } else {
            mainP.setAttribute('pathLength', '100');
            mainP.style.cssText = `opacity:0.4; stroke-dasharray:100 100; stroke-dashoffset:100; animation:mmPathGrow 1s ease-out ${delay}s both;`;
        }
        connLayer.appendChild(mainP);

        // Hub → Leaves
        branch.leaves.forEach((leaf, li) => {
            const leafP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leafP.setAttribute('d', qCurve(branch.x, branch.y, leaf.x, leaf.y, 0));
            leafP.setAttribute('stroke', leaf.color);
            leafP.setAttribute('stroke-width', '1.2');
            leafP.setAttribute('fill', 'none');
            const leafDelay = delay + 0.6 + li * 0.1;
            if (isPersonal) {
                leafP.style.cssText = `stroke-dasharray:3 3; animation:mmFadeIn 0.7s ease-out ${leafDelay}s both;`;
            } else {
                leafP.setAttribute('pathLength', '100');
                leafP.style.cssText = `opacity:0.28; stroke-dasharray:100 100; stroke-dashoffset:100; animation:mmPathGrow 0.7s ease-out ${leafDelay}s both;`;
            }
            connLayer.appendChild(leafP);
        });
    });

    svg.appendChild(connLayer);

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

    const ct1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ct1.setAttribute('x', cx); ct1.setAttribute('y', cy - 7);
    ct1.setAttribute('text-anchor', 'middle'); ct1.setAttribute('dominant-baseline', 'middle');
    ct1.setAttribute('fill', '#3b8bff'); ct1.setAttribute('font-family', 'Inter, sans-serif');
    ct1.setAttribute('font-size', '18'); ct1.setAttribute('font-weight', '800');
    ct1.textContent = 'SS';

    const ct2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ct2.setAttribute('x', cx); ct2.setAttribute('y', cy + 10);
    ct2.setAttribute('text-anchor', 'middle'); ct2.setAttribute('dominant-baseline', 'middle');
    ct2.setAttribute('fill', '#7dd3fc'); ct2.setAttribute('font-family', 'JetBrains Mono, monospace');
    ct2.setAttribute('font-size', '6.5'); ct2.setAttribute('font-weight', '500');
    ct2.textContent = '12+ years';

    centerG.appendChild(outerRing); centerG.appendChild(centerCircle);
    centerG.appendChild(ct1); centerG.appendChild(ct2);
    centerG.style.animation = 'mmNodeIn 0.5s ease-out 0s both';
    nodeLayer.appendChild(centerG);

    // Helper: render one branch hub or leaf node
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

        if (n.localIcon || n.cdnSlug) {
            // Brand icon (Cloudflare, AWS, Azure, Python)
            const iconUrl = n.localIcon
                ? n.localIcon
                : `https://cdn.simpleicons.org/${n.cdnSlug}/${n.color.replace('#', '')}`;
            const sz = n.r * 1.05;
            const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            img.setAttribute('href', iconUrl);
            img.setAttribute('x', n.x - sz / 2); img.setAttribute('y', n.y - sz / 2 - n.r * 0.14);
            img.setAttribute('width', sz); img.setAttribute('height', sz);
            img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            g.appendChild(img);

            const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            lbl.setAttribute('x', n.x); lbl.setAttribute('y', n.y + n.r * 0.72);
            lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('dominant-baseline', 'middle');
            lbl.setAttribute('fill', n.color); lbl.setAttribute('font-family', 'JetBrains Mono, monospace');
            lbl.setAttribute('font-size', Math.max(5, Math.round(n.r * 0.28)));
            lbl.setAttribute('font-weight', '700');
            lbl.textContent = n.label;
            g.appendChild(lbl);

        } else if (n.personalIcon && personalIcons[n.personalIcon]) {
            // Personal activity icon (filled path)
            const sz = n.r * 1.05;
            const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            wrap.setAttribute('x', n.x - sz / 2); wrap.setAttribute('y', n.y - sz / 2 - n.r * 0.12);
            wrap.setAttribute('width', sz); wrap.setAttribute('height', sz);
            wrap.setAttribute('viewBox', '0 0 24 24');
            const ip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            ip.setAttribute('d', personalIcons[n.personalIcon]);
            ip.setAttribute('fill', n.color); ip.setAttribute('opacity', '0.85');
            wrap.appendChild(ip);
            g.appendChild(wrap);

            const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            lbl.setAttribute('x', n.x); lbl.setAttribute('y', n.y + n.r * 0.75);
            lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('dominant-baseline', 'middle');
            lbl.setAttribute('fill', n.color); lbl.setAttribute('font-family', 'JetBrains Mono, monospace');
            lbl.setAttribute('font-size', Math.max(5, Math.round(n.r * 0.29)));
            lbl.setAttribute('font-weight', '700');
            lbl.textContent = n.label;
            g.appendChild(lbl);

        } else {
            // Text-only node (protocol names + hub labels)
            const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            txt.setAttribute('x', n.x); txt.setAttribute('y', n.y + 1);
            txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('dominant-baseline', 'middle');
            txt.setAttribute('fill', n.color); txt.setAttribute('font-family', 'JetBrains Mono, monospace');
            txt.setAttribute('font-size', Math.min(9, Math.max(6, Math.round(n.r * 0.3))));
            txt.setAttribute('font-weight', '700');
            txt.textContent = n.label;
            g.appendChild(txt);
        }

        g.style.animation = `mmNodeIn 0.45s ease-out ${delay}s both`;
        return g;
    }

    branches.forEach((branch, bi) => {
        const isPersonal = !!branch.personal;
        const hubDelay = bi * 0.18 + 0.3;
        nodeLayer.appendChild(drawNode(branch, hubDelay, isPersonal));
        branch.leaves.forEach((leaf, li) => {
            nodeLayer.appendChild(drawNode(leaf, hubDelay + 0.5 + li * 0.1, isPersonal));
        });
    });

    svg.appendChild(nodeLayer);

    // CSS keyframes injected into SVG
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        .mm-node { transform-box: fill-box; transform-origin: center; }
        @keyframes mmPathGrow  { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        @keyframes mmFadeIn    { from { opacity: 0; } to { opacity: 0.3; } }
        @keyframes mmRingPulse { 0%,100%{opacity:.08} 50%{opacity:.28} }
        @keyframes mmNodeIn    { from { opacity:0; transform:scale(0.35); } to { opacity:1; transform:scale(1); } }
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
