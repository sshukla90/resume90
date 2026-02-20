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

    const W = 400, H = 400;
    const cx = W / 2, cy = H / 2;

    // Node definitions
    const nodes = [
        { id: 'core', x: cx, y: cy, r: 28, label: 'CORE', color: '#3b8bff' },
        { id: 'bgp', x: cx, y: cy - 130, r: 20, label: 'BGP', color: '#00e5ff' },
        { id: 'ospf', x: cx + 120, y: cy - 60, r: 18, label: 'OSPF', color: '#a78bfa' },
        { id: 'mpls', x: cx + 120, y: cy + 60, r: 18, label: 'MPLS', color: '#f472b6' },
        { id: 'cloud', x: cx, y: cy + 130, r: 20, label: 'CLOUD', color: '#34d399' },
        { id: 'aws', x: cx - 120, y: cy + 60, r: 18, label: 'AWS', color: '#fb923c' },
        { id: 'sec', x: cx - 120, y: cy - 60, r: 18, label: 'F5/FW', color: '#facc15' },
        { id: 'py', x: cx - 55, y: cy - 135, r: 14, label: 'Python', color: '#60a5fa' },
    ];

    const edges = [
        ['core', 'bgp'], ['core', 'ospf'], ['core', 'mpls'],
        ['core', 'cloud'], ['core', 'aws'], ['core', 'sec'],
        ['bgp', 'py'], ['bgp', 'ospf'], ['cloud', 'aws'],
        ['core', 'py'],
    ];

    // Build SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);

    // Defs: glow filter + gradients
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

    // Draw animated data packets on edges
    const packetGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edges.forEach(([a, b], i) => {
        const na = nodes.find(n => n.id === a);
        const nb = nodes.find(n => n.id === b);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', '#3b8bff');
        circle.setAttribute('opacity', '0.8');
        circle.setAttribute('filter', 'url(#glow)');

        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        anim.setAttribute('dur', `${2.5 + i * 0.4}s`);
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('begin', `${i * 0.6}s`);
        anim.setAttribute('path', `M${na.x},${na.y} L${nb.x},${nb.y}`);
        anim.setAttribute('keyPoints', '0;1');
        anim.setAttribute('keyTimes', '0;1');
        anim.setAttribute('calcMode', 'linear');

        circle.appendChild(anim);
        packetGroup.appendChild(circle);
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

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', n.x); text.setAttribute('y', n.y + 1);
        text.setAttribute('text-anchor', 'middle'); text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', n.color);
        text.setAttribute('font-family', 'JetBrains Mono, monospace');
        text.setAttribute('font-size', n.id === 'core' ? '9' : '7.5');
        text.setAttribute('font-weight', '700');
        text.textContent = n.label;

        g.appendChild(glow); g.appendChild(circle); g.appendChild(text);
        nodeGroup.appendChild(g);
    });
    svg.appendChild(nodeGroup);

    // Inject CSS animation keyframes
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
    @keyframes dashFlow { to { stroke-dashoffset: -20; } }
    @keyframes nodePulse { 0%,100%{opacity:.15;r:attr(r)em} 50%{opacity:.35} }
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
        'Staff Network Engineer',
        'BGP · OSPF · MPLS Expert',
        'Cloud & Automation Pro',
        'Network Architect',
    ];
    let i = 0, j = 0, deleting = false;
    const originalText = badge.textContent.trim();

    // Create a span slot without the bullet
    badge.textContent = '';
    const dot = document.createElement('span');
    dot.className = 'badge-dot';
    dot.style.cssText = 'display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--cyan);margin-right:6px;animation:pulse 2s infinite;flex-shrink:0;';
    const slot = document.createElement('span');
    badge.appendChild(dot);
    badge.appendChild(slot);

    function tick() {
        const full = texts[i];
        if (!deleting) {
            slot.textContent = full.slice(0, j++);
            if (j > full.length) { setTimeout(tick, 2000); deleting = true; return; }
        } else {
            slot.textContent = full.slice(0, j--);
            if (j < 0) { deleting = false; i = (i + 1) % texts.length; j = 0; }
        }
        setTimeout(tick, deleting ? 40 : 75);
    }
    tick();
})();
