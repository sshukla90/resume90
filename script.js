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

/* ---- Network Graph (SVG canvas) ---- */
function buildNetworkGraph() {
    const container = document.getElementById('network-graph');
    if (!container) return;

    const W = 560, H = 560;
    const cx = W / 2, cy = H / 2;

    // Simple Icons CDN: https://cdn.simpleicons.org/[slug]/[hexcolor]
    // Feather-style paths for concept nodes (not brands)
    const iconPaths = {
        shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        globe: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0v20M2 12h20M4.9 4.9C7 7 9.4 8 12 8s5-1 7.1-3.1M4.9 19.1C7 17 9.4 16 12 16s5 1 7.1 3.1',
        lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
    };

    // Node definitions
    // cdnSlug  → Simple Icons CDN (real brand logos, free/CC0)
    // icon     → inline SVG path for concept nodes
    // (neither) → bold text only for protocol names
    const nodes = [
        { id: 'core', x: cx, y: cy, r: 33, label: 'CORE', color: '#3b8bff' },
        { id: 'cf', x: cx, y: cy - 175, r: 30, label: 'Cloudflare', color: '#f6821f', cdnSlug: 'cloudflare' },
        { id: 'waf', x: cx + 108, y: cy - 140, r: 20, label: 'WAF', color: '#ef4444', icon: 'shield' },
        { id: 'dns', x: cx - 108, y: cy - 140, r: 19, label: 'DNS', color: '#06b6d4', icon: 'globe' },
        { id: 'bgp', x: cx + 172, y: cy - 68, r: 21, label: 'BGP', color: '#00e5ff' },
        { id: 'ospf', x: cx + 182, y: cy + 28, r: 17, label: 'OSPF', color: '#a78bfa' },
        { id: 'mpls', x: cx + 118, y: cy + 168, r: 19, label: 'MPLS', color: '#f472b6' },
        { id: 'azure', x: cx - 118, y: cy + 168, r: 22, label: 'Azure', color: '#0078d4', localIcon: 'icons/azure.svg' },
        { id: 'aws', x: cx - 182, y: cy + 28, r: 21, label: 'AWS', color: '#ff9900', localIcon: 'icons/aws-clean.svg' },
        { id: 'sec', x: cx - 172, y: cy - 68, r: 18, label: 'F5/FW', color: '#facc15', icon: 'lock' },
        { id: 'py', x: cx + 65, y: cy - 170, r: 18, label: 'Python', color: '#3776ab', cdnSlug: 'python' },
        { id: 'cloud', x: cx, y: cy + 182, r: 17, label: 'CLOUD', color: '#34d399' },
    ];

    const edges = [
        ['core', 'cf'], ['core', 'bgp'], ['core', 'ospf'],
        ['core', 'mpls'], ['core', 'azure'], ['core', 'aws'],
        ['core', 'sec'], ['core', 'cloud'],
        ['cf', 'waf'], ['cf', 'dns'], ['cf', 'py'],
        ['waf', 'bgp'], ['mpls', 'cloud'], ['azure', 'cloud'],
        ['aws', 'cloud'],
    ];

    // Build SVG — no fixed width/height, CSS controls rendered size via viewBox
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // Defs: glow filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softglow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  `;
    svg.appendChild(defs);

    // Draw edges
    const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edges.forEach(([a, b], i) => {
        const na = nodes.find(n => n.id === a);
        const nb = nodes.find(n => n.id === b);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
        line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
        line.setAttribute('stroke', 'rgba(99,179,255,0.2)');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', '4 4');
        line.style.animation = `dashFlow 3s linear infinite`;
        line.style.animationDelay = `${i * 0.35}s`;
        edgeGroup.appendChild(line);
    });
    svg.appendChild(edgeGroup);

    // Animated data packets
    const packetGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edges.forEach(([a, b], i) => {
        const na = nodes.find(n => n.id === a);
        const nb = nodes.find(n => n.id === b);
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '3');
        dot.setAttribute('fill', '#3b8bff');
        dot.setAttribute('opacity', '0.8');
        dot.setAttribute('filter', 'url(#glow)');
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        anim.setAttribute('dur', `${2.5 + i * 0.4}s`);
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('begin', `${i * 0.6}s`);
        anim.setAttribute('path', `M${na.x},${na.y} L${nb.x},${nb.y}`);
        anim.setAttribute('keyPoints', '0;1');
        anim.setAttribute('keyTimes', '0;1');
        anim.setAttribute('calcMode', 'linear');
        dot.appendChild(anim);
        packetGroup.appendChild(dot);
    });
    svg.appendChild(packetGroup);

    // Draw nodes
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodes.forEach(n => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        // Outer glow ring
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', n.x); glow.setAttribute('cy', n.y);
        glow.setAttribute('r', n.r + 8);
        glow.setAttribute('fill', 'none');
        glow.setAttribute('stroke', n.color);
        glow.setAttribute('stroke-width', '1');
        glow.setAttribute('opacity', '0.2');
        glow.style.animation = `nodePulse 3s ease-in-out infinite`;
        glow.style.animationDelay = `${Math.random() * 2}s`;

        // Circle body
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
        circle.setAttribute('r', n.r);
        circle.setAttribute('fill', `rgba(${hexToRgb(n.color)},0.15)`);
        circle.setAttribute('stroke', n.color);
        circle.setAttribute('stroke-width', '1.5');
        if (n.id === 'core') circle.setAttribute('filter', 'url(#softglow)');

        g.appendChild(glow);
        g.appendChild(circle);

        if (n.localIcon || n.cdnSlug) {
            // Real brand logo — local file or Simple Icons CDN
            const iconUrl = n.localIcon
                ? n.localIcon
                : `https://cdn.simpleicons.org/${n.cdnSlug}/${n.color.replace('#', '')}`;
            const iconSize = n.r * 1.1;
            const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            img.setAttribute('href', iconUrl);
            img.setAttribute('x', n.x - iconSize / 2);
            img.setAttribute('y', n.y - iconSize / 2 - n.r * 0.15);
            img.setAttribute('width', iconSize);
            img.setAttribute('height', iconSize);
            img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            g.appendChild(img);

            // Label below icon, inside circle
            const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            lbl.setAttribute('x', n.x);
            lbl.setAttribute('y', n.y + n.r * 0.72);
            lbl.setAttribute('text-anchor', 'middle');
            lbl.setAttribute('dominant-baseline', 'middle');
            lbl.setAttribute('fill', n.color);
            lbl.setAttribute('font-family', 'JetBrains Mono, monospace');
            lbl.setAttribute('font-size', Math.max(5, Math.round(n.r * 0.28)));
            lbl.setAttribute('font-weight', '700');
            lbl.textContent = n.label;
            g.appendChild(lbl);

        } else if (n.icon && iconPaths[n.icon]) {
            // Concept icon — inline SVG path (shield / globe / lock)
            const iconSize = n.r * 1.15;
            const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            iconSvg.setAttribute('x', n.x - iconSize / 2);
            iconSvg.setAttribute('y', n.y - iconSize / 2 - n.r * 0.12);
            iconSvg.setAttribute('width', iconSize);
            iconSvg.setAttribute('height', iconSize);
            iconSvg.setAttribute('viewBox', '0 0 24 24');
            iconSvg.setAttribute('overflow', 'visible');
            const ip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            ip.setAttribute('d', iconPaths[n.icon]);
            ip.setAttribute('fill', 'none');
            ip.setAttribute('stroke', n.color);
            ip.setAttribute('stroke-width', n.r < 20 ? '2.5' : '2');
            ip.setAttribute('stroke-linecap', 'round');
            ip.setAttribute('stroke-linejoin', 'round');
            iconSvg.appendChild(ip);
            g.appendChild(iconSvg);

            // Label below icon, inside circle
            const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            lbl.setAttribute('x', n.x);
            lbl.setAttribute('y', n.y + n.r * 0.68);
            lbl.setAttribute('text-anchor', 'middle');
            lbl.setAttribute('dominant-baseline', 'middle');
            lbl.setAttribute('fill', n.color);
            lbl.setAttribute('font-family', 'JetBrains Mono, monospace');
            lbl.setAttribute('font-size', Math.max(6, Math.round(n.r * 0.31)));
            lbl.setAttribute('font-weight', '700');
            lbl.textContent = n.label;
            g.appendChild(lbl);

        } else {
            // Text-only node (CORE + protocol names: BGP, OSPF, MPLS, CLOUD)
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', n.x); text.setAttribute('y', n.y + 1);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', n.color);
            text.setAttribute('font-family', 'JetBrains Mono, monospace');
            text.setAttribute('font-size', n.id === 'core' ? '10' : '8');
            text.setAttribute('font-weight', '700');
            text.textContent = n.label;
            g.appendChild(text);
        }


        nodeGroup.appendChild(g);
    });
    svg.appendChild(nodeGroup);

    // CSS keyframes
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
    @keyframes dashFlow { to { stroke-dashoffset: -20; } }
    @keyframes nodePulse { 0%,100%{opacity:.15} 50%{opacity:.35} }
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

buildNetworkGraph();

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
