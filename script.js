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

// Auto-advance timer management
let autoTimers = [];
function clearAutoTimers() {
  autoTimers.forEach(clearTimeout);
  autoTimers = [];
  const c = document.getElementById('demo-cursor');
  if (c) { c.style.opacity = '0'; c.classList.remove('clicking'); }
}
function at(fn, ms) {
  const id = setTimeout(fn, ms);
  autoTimers.push(id);
  return id;
}

function goToStage(n) {
  clearAutoTimers();
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

const leftArrowBtn  = document.getElementById('demo-arrow-left');
const rightArrowBtn = document.getElementById('demo-arrow-right');
if (leftArrowBtn)  leftArrowBtn.addEventListener('click',  () => goToStage(currentStage - 1));
if (rightArrowBtn) rightArrowBtn.addEventListener('click', () => goToStage(currentStage + 1));

document.querySelectorAll('.demo-next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const goto = parseInt(btn.dataset.goto);
    if (!isNaN(goto)) goToStage(goto);
  });
});

const restoreBtnEl = document.getElementById('restore-btn');
if (restoreBtnEl) restoreBtnEl.addEventListener('click', handleDemoRestore);

function runStageAnimation(n) {
  if (n === 0) runArchiveAnimation();
  if (n === 1) runGroupsAnimation();
  if (n === 2) runSessionAnimation();
  if (n === 3) runSearchAnimation();
  if (n === 4) runRestoreAnimation();
}

// ── Cursor helper ──
function animateCursorTo(targetEl, callback) {
  const cursor = document.getElementById('demo-cursor');
  if (!cursor || !targetEl) { if (callback) callback(); return; }
  const wrapEl = document.getElementById('demo-wrap');
  if (!wrapEl) { if (callback) callback(); return; }

  const wrapRect   = wrapEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const cx = targetRect.left + targetRect.width  * 0.25 - wrapRect.left;
  const cy = targetRect.top  + targetRect.height * 0.25 - wrapRect.top;

  cursor.style.transition = 'none';
  cursor.style.left = (cx - 28) + 'px';
  cursor.style.top  = (cy - 12) + 'px';
  cursor.style.opacity = '1';

  at(() => {
    cursor.style.transition = 'opacity 0.18s, left 0.5s cubic-bezier(0.16,1,0.3,1), top 0.5s cubic-bezier(0.16,1,0.3,1)';
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  }, 30);

  at(() => {
    cursor.classList.add('clicking');
    targetEl.classList.add('cursor-click');
    at(() => {
      cursor.style.opacity = '0';
      cursor.classList.remove('clicking');
      targetEl.classList.remove('cursor-click');
      if (callback) callback();
    }, 220);
  }, 580);
}

function advanceWithCursor(delay) {
  at(() => {
    if (currentStage < stages.length - 1 && rightArrowBtn) {
      animateCursorTo(rightArrowBtn, () => goToStage(currentStage + 1));
    }
  }, delay);
}

// ── Stage 1: Archive ──
function runArchiveAnimation() {
  const btabs = [0, 1, 2, 3].map(i => document.getElementById('btab-' + i));
  const toast = document.getElementById('archive-toast');

  btabs.forEach(t => { if (t) t.classList.remove('archiving-out'); });
  if (toast) toast.classList.remove('show');

  btabs.forEach((tab, i) => {
    at(() => { if (tab) tab.classList.add('archiving-out'); }, 600 + i * 420);
  });

  at(() => { if (toast) toast.classList.add('show'); }, 600 + 4 * 420 + 200);
  advanceWithCursor(600 + 4 * 420 + 2100);
}

// ── Stage 2: Smart Groups ──
function runGroupsAnimation() {
  const chips      = document.querySelectorAll('#ext-groups-1 .ext-chip');
  const uniChip    = document.getElementById('chip-uni');
  const results    = document.getElementById('ext-results-1');
  const rows       = results ? results.querySelectorAll('.ext-tab-row') : [];
  const restoreRow = results ? results.querySelector('.ext-restore-all-row') : null;

  chips.forEach(c => c.classList.remove('visible', 'ext-chip-active'));
  if (results) results.classList.remove('visible');
  rows.forEach(r => r.classList.remove('visible'));
  if (restoreRow) restoreRow.classList.remove('visible');

  chips.forEach((chip, i) => {
    at(() => chip.classList.add('visible'), 280 + i * 170);
  });

  const afterChips = 280 + chips.length * 170 + 320;
  at(() => {
    if (uniChip) uniChip.classList.add('ext-chip-active');
    if (results) results.classList.add('visible');
  }, afterChips);

  rows.forEach((row, i) => {
    at(() => row.classList.add('visible'), afterChips + 180 + i * 120);
  });

  const doneAt = afterChips + 180 + rows.length * 120 + 200;
  at(() => { if (restoreRow) restoreRow.classList.add('visible'); }, doneAt);
  advanceWithCursor(doneAt + 1500);
}

// ── Stage 3: Session Groups ──
function runSessionAnimation() {
  const sessionChip = document.getElementById('chip-session');
  const otherChips  = document.querySelectorAll('#ext-groups-2 .ext-chip:not(#chip-session)');
  const results     = document.getElementById('ext-results-2');
  const rows        = results ? results.querySelectorAll('.ext-tab-row') : [];
  const restoreRow  = results ? results.querySelector('.ext-restore-all-row') : null;

  if (sessionChip) sessionChip.classList.remove('visible', 'ext-chip-active');
  otherChips.forEach(c => c.classList.remove('visible', 'ext-chip-active'));
  if (results) results.classList.remove('visible');
  rows.forEach(r => r.classList.remove('visible'));
  if (restoreRow) restoreRow.classList.remove('visible');

  at(() => { if (sessionChip) sessionChip.classList.add('visible', 'ext-chip-active'); }, 280);
  otherChips.forEach((chip, i) => {
    at(() => chip.classList.add('visible'), 520 + i * 150);
  });
  at(() => { if (results) results.classList.add('visible'); }, 900);
  rows.forEach((row, i) => {
    at(() => row.classList.add('visible'), 1000 + i * 110);
  });

  const doneAt = 1000 + rows.length * 110 + 200;
  at(() => { if (restoreRow) restoreRow.classList.add('visible'); }, doneAt);
  advanceWithCursor(doneAt + 1500);
}

// ── Stage 4: Search ──
const searchStates = [
  {
    query: 'econ',
    label: '3 results \u00b7 \u201cecon\u201d',
    results: [
      { icon: 'E', title: 'Introduction to Economics',       meta: 'economics101.com \u00b7 2h ago' },
      { icon: 'C', title: 'ECON 102: Midterm Guide',         meta: 'canvas.ubc.ca \u00b7 1d ago' },
      { icon: 'I', title: 'Supply and Demand, Investopedia', meta: 'investopedia.com \u00b7 3d ago' },
    ]
  },
  {
    query: 'climate',
    label: '3 results \u00b7 \u201cclimate\u201d',
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

  if (!queryEl) return;
  queryEl.textContent = '';
  if (labelEl) labelEl.textContent = 'type to search\u2026';
  if (resultsEl) { resultsEl.innerHTML = ''; resultsEl.style.opacity = '0'; resultsEl.style.transform = 'translateY(6px)'; }

  const chars = state.query.split('');
  chars.forEach((ch, i) => {
    at(() => { queryEl.textContent += ch; }, 380 + i * 130);
  });

  const doneTyping = 380 + chars.length * 130 + 260;
  at(() => {
    if (labelEl) labelEl.textContent = state.label;
    if (resultsEl) {
      resultsEl.innerHTML = state.results.map(r =>
        `<div class="ext-tab-row visible">
          <div class="ext-tab-fav">${r.icon}</div>
          <div class="ext-tab-info">
            <div class="ext-tab-title">${r.title}</div>
            <div class="ext-tab-meta">${r.meta}</div>
          </div>
          <button class="ext-restore-btn">Restore</button>
        </div>`
      ).join('');
      resultsEl.style.transition = 'opacity 0.35s, transform 0.35s';
      resultsEl.style.opacity    = '1';
      resultsEl.style.transform  = 'translateY(0)';
    }
  }, doneTyping);

  advanceWithCursor(doneTyping + 1600);
}

// ── Stage 5: Calendar + Notification ──
function runRestoreAnimation() {
  const notif      = document.getElementById('caddy-notif');
  const countdown  = document.getElementById('cal-countdown');
  const actions    = document.getElementById('notif-actions');
  const success    = document.getElementById('notif-success');
  const restoreBtn = document.getElementById('restore-btn');

  if (notif)      notif.classList.remove('show');
  if (countdown)  countdown.classList.remove('show');
  if (success)    success.classList.remove('show');
  if (actions)    actions.style.display = '';
  if (restoreBtn) { restoreBtn.textContent = 'Restore All'; restoreBtn.disabled = false; }

  at(() => { if (countdown) countdown.classList.add('show'); }, 800);
  at(() => { if (notif)     notif.classList.add('show'); },    2000);
  at(() => {
    const btn = document.getElementById('restore-btn');
    if (btn) animateCursorTo(btn, handleDemoRestore);
  }, 3600);
}

function handleDemoRestore() {
  const actions    = document.getElementById('notif-actions');
  const success    = document.getElementById('notif-success');
  const restoreBtn = document.getElementById('restore-btn');

  if (restoreBtn) { restoreBtn.textContent = 'Restoring\u2026'; restoreBtn.disabled = true; }
  at(() => {
    if (actions) actions.style.display = 'none';
    if (success) success.classList.add('show');
  }, 600);
}

// ── Demo Start Button ──
const demoStartBtn    = document.getElementById('demo-start-btn');
const demoStartScreen = document.getElementById('demo-start-screen');
const demoWrap        = document.getElementById('demo-wrap');

if (demoStartBtn) {
  demoStartBtn.addEventListener('click', () => {
    demoStartScreen.style.display = 'none';
    demoWrap.style.display = 'block';
    runStageAnimation(0);
  });
}
