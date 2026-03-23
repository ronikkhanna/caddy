// ── Splash Screen ──
const splash = document.getElementById('splash');

if (splash) {
  document.body.style.overflow = 'hidden';

  const line1Words = document.querySelectorAll('#splash-line1 .splash-word');
  const line2Words = document.querySelectorAll('#splash-line2 .splash-word');

  const wordDelayL1 = 260;  // slightly snappy for first line
  const pauseBetweenLines = 1000; // 1 second pause between lines
  const wordDelayL2 = 320;  // slightly slower/deliberate for emphasis
  const holdAfterDone = 1200;  // hold before fading

  // Animate line 1 word by word
  let t = 280;
  line1Words.forEach((word) => {
    setTimeout(() => word.classList.add('show'), t);
    t += wordDelayL1;
  });

  // After line 1 finishes (+transition time), pause, then animate line 2
  const line2Start = t + pauseBetweenLines;
  line2Words.forEach((word, i) => {
    setTimeout(() => word.classList.add('show'), line2Start + i * wordDelayL2);
  });

  // Fade out after everything is done
  const fadeOut = line2Start + (line2Words.length - 1) * wordDelayL2 + 550 + holdAfterDone;
  setTimeout(() => {
    splash.classList.add('done');
    document.body.style.overflow = '';
  }, fadeOut);
}

// ── Demo scroll button ──
const demoScrollBtn = document.getElementById('demo-scroll-btn');
if (demoScrollBtn) {
  demoScrollBtn.addEventListener('click', () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ── Hamburger / Mobile Nav ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ── Scroll-triggered reveal (with staggered children) ──
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll(
  '.how-step, .pricing-card, .editorial-pull, .editorial-body, .compare-table-wrap, .reveal, .reveal-heading'
).forEach((el, i) => {
  if (!el.classList.contains('reveal') && !el.classList.contains('reveal-heading')) {
    el.classList.add('reveal');
  }
  const siblings = Array.from(el.parentElement.children).filter(
    c => c.classList.contains('reveal') || c.classList.contains('reveal-heading') || c.classList.contains('how-step')
  );
  const sibIdx = siblings.indexOf(el);
  if (sibIdx > 0) {
    el.style.transitionDelay = `${sibIdx * 0.1}s`;
  }
  observer.observe(el);
});

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Demo Stage Controller ──
let currentStage = 0;
const stages = document.querySelectorAll('.demo-stage');
const dots   = document.querySelectorAll('.demo-dot');

function goToStage(n) {
  stages[currentStage].classList.remove('active');
  dots[currentStage].classList.remove('active');
  currentStage = ((n % stages.length) + stages.length) % stages.length;
  stages[currentStage].classList.add('active');
  dots[currentStage].classList.add('active');
  runStageAnimation(currentStage);
}

dots.forEach(d => {
  d.addEventListener('click', () => goToStage(parseInt(d.dataset.step)));
});

document.querySelectorAll('.demo-next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const goto = parseInt(btn.dataset.goto);
    if (!isNaN(goto)) goToStage(goto);
  });
});

const restoreBtnEl = document.getElementById('restore-btn');
if (restoreBtnEl) {
  restoreBtnEl.addEventListener('click', handleDemoRestore);
}

function runStageAnimation(n) {
  if (n === 0) runArchiveAnimation();
  if (n === 1) runGroupsAnimation();
  if (n === 2) runSearchAnimation();
  if (n === 3) runRestoreAnimation();
}

// ── Stage 1: Archive ──
function runArchiveAnimation() {
  const btabs  = [0, 1, 2].map(i => document.getElementById('btab-' + i));
  const toast  = document.getElementById('archive-toast');
  const nextBtn = document.getElementById('next-0');

  btabs.forEach(t => { if (t) t.classList.remove('archiving-out'); });
  if (toast)   toast.classList.remove('show');
  if (nextBtn) nextBtn.classList.remove('visible');

  btabs.forEach((tab, i) => {
    setTimeout(() => { if (tab) tab.classList.add('archiving-out'); }, 700 + i * 450);
  });

  setTimeout(() => { if (toast)   toast.classList.add('show'); },    700 + 3 * 450 + 200);
  setTimeout(() => { if (nextBtn) nextBtn.classList.add('visible'); }, 700 + 3 * 450 + 700);
}

// ── Stage 2: Smart Groups ──
function runGroupsAnimation() {
  const buttons = document.querySelectorAll('.mock-group-btn');
  const nextBtn = document.getElementById('next-1');

  if (nextBtn) nextBtn.classList.remove('visible');

  buttons.forEach(b => b.classList.remove('mock-group-btn-active'));
  setTimeout(() => {
    const active = document.querySelector('.mock-group-btn:nth-child(3)');
    if (active) active.classList.add('mock-group-btn-active');
  }, 500);

  setTimeout(() => { if (nextBtn) nextBtn.classList.add('visible'); }, 1200);
}

// ── Stage 3: Search ──
const searchStates = [
  {
    query: 'econ',
    label: '3 results \u00b7 "econ"',
    results: [
      { icon: 'E', title: 'Introduction to Economics',    meta: 'economics101.com \u00b7 2h ago' },
      { icon: 'C', title: 'ECON 102: Midterm Guide',      meta: 'canvas.ubc.ca \u00b7 1d ago' },
      { icon: 'I', title: 'Supply and Demand, Investopedia', meta: 'investopedia.com \u00b7 3d ago' },
    ]
  },
  {
    query: 'climate',
    label: '2 results \u00b7 "climate"',
    results: [
      { icon: 'N', title: 'NASA Climate Change Overview', meta: 'climate.nasa.gov \u00b7 4h ago' },
      { icon: 'G', title: 'IPCC AR6 Summary Report',      meta: 'ipcc.ch \u00b7 2d ago' },
      { icon: 'K', title: 'Carbon Cycle, Khan Academy',   meta: 'khanacademy.org \u00b7 3d ago' },
    ]
  }
];
let searchIdx = 0;

function runSearchAnimation() {
  const state     = searchStates[searchIdx % searchStates.length];
  searchIdx++;
  const queryEl   = document.getElementById('mock-query');
  const labelEl   = document.getElementById('mock-label');
  const resultsEl = document.getElementById('mock-results');
  const nextBtn   = document.getElementById('next-2');

  if (nextBtn) nextBtn.classList.remove('visible');
  if (!queryEl) return;

  resultsEl.style.opacity    = '0';
  resultsEl.style.transform  = 'translateY(6px)';
  resultsEl.style.transition = 'opacity 0.3s, transform 0.3s';

  queryEl.textContent = '';
  const chars = state.query.split('');
  chars.forEach((ch, i) => {
    setTimeout(() => { queryEl.textContent += ch; }, 300 + i * 120);
  });

  setTimeout(() => {
    labelEl.textContent = state.label;
    resultsEl.innerHTML = state.results.map(r => `
      <div class="mock-result">
        <div class="mock-favicon">${r.icon}</div>
        <div class="mock-info">
          <div class="mock-title">${r.title}</div>
          <div class="mock-meta">${r.meta}</div>
        </div>
        <button class="mock-restore">Restore</button>
      </div>
    `).join('');
    resultsEl.style.opacity   = '1';
    resultsEl.style.transform = 'translateY(0)';
  }, 300 + chars.length * 120 + 200);

  setTimeout(() => { if (nextBtn) nextBtn.classList.add('visible'); }, 300 + chars.length * 120 + 700);
}

// ── Stage 4: Calendar + Auto popup + Interactive restore ──
function runRestoreAnimation() {
  const notif      = document.getElementById('caddy-notif');
  const countdown  = document.getElementById('cal-countdown');
  const actions    = document.getElementById('notif-actions');
  const success    = document.getElementById('notif-success');
  const restoreBtn = document.getElementById('restore-btn');
  const nextBtn    = document.querySelector('#demo-3 .demo-next-btn.demo-next-ghost');

  if (notif)      { notif.classList.remove('show'); }
  if (countdown)  countdown.classList.remove('show');
  if (success)    success.classList.remove('show');
  if (actions)    actions.style.display = '';
  if (restoreBtn) { restoreBtn.textContent = 'Restore All'; restoreBtn.disabled = false; }
  if (nextBtn)    nextBtn.style.opacity = '0';

  setTimeout(() => { if (countdown) countdown.classList.add('show'); }, 800);
  setTimeout(() => { if (notif) notif.classList.add('show'); }, 2000);
  setTimeout(() => { if (nextBtn) nextBtn.style.opacity = '1'; }, 2500);
}

function handleDemoRestore() {
  const actions    = document.getElementById('notif-actions');
  const success    = document.getElementById('notif-success');
  const restoreBtn = document.getElementById('restore-btn');

  if (restoreBtn) { restoreBtn.textContent = 'Restoring...'; restoreBtn.disabled = true; }

  setTimeout(() => {
    if (actions) actions.style.display = 'none';
    if (success) success.classList.add('show');
  }, 600);
}

// ── Demo Start Button ──
const demoStartBtn = document.getElementById('demo-start-btn');
const demoStartScreen = document.getElementById('demo-start-screen');
const demoWrap = document.getElementById('demo-wrap');

if (demoStartBtn) {
  demoStartBtn.addEventListener('click', () => {
    demoStartScreen.style.display = 'none';
    demoWrap.style.display = 'block';
    runStageAnimation(0);
  });
}
