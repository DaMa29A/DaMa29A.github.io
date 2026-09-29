// --- Page reveal -------------------------------------------------------------
function revealPage() {
    document.body.classList.remove('body-preload');
}
if (document.readyState === 'complete') {
    revealPage();
} else {
    window.addEventListener('load', revealPage);
}

// --- Footer year ---------------------------------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Sticky nav, reading progress, back-to-top ---------------------------------
const nav = document.querySelector('.topnav');
const navList = document.querySelector('.topnav ul');
const progressBar = document.querySelector('.scroll-progress i');
const toTop = document.querySelector('.to-top');
const navLinks = [...document.querySelectorAll('.topnav li a')];
const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

let currentId = null;

function setActive(id) {
    if (id === currentId) return;
    currentId = id;
    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'true');
            // on phones the links are a horizontal row: keep the active one visible
            if (navList && navList.scrollWidth > navList.clientWidth) {
                const target = link.offsetLeft - (navList.clientWidth - link.offsetWidth) / 2;
                navList.scrollTo({ left: target, behavior: 'smooth' });
            }
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function onScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (nav) nav.classList.toggle('scrolled', scrollY > 20);
    if (toTop) toTop.classList.toggle('show', scrollY > window.innerHeight * 0.6);

    // active section = the last one whose top has passed 40% of the screen
    let active = sections.length ? sections[0].id : null;
    const line = window.innerHeight * 0.4;
    for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) active = section.id;
    }
    // at the very bottom, the last section is the active one
    if (maxScroll - scrollY < 4 && sections.length) active = sections[sections.length - 1].id;
    if (active) setActive(active);
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
            onScroll();
            ticking = false;
        });
    }
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();
