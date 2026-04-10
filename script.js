// ── Splash Screen ──
const splash = document.getElementById('splash');

if (splash) {
  document.body.style.overflow = 'hidden';

  const line1Words = document.querySelectorAll('#splash-line1 .splash-word');
  const line2Words = document.querySelectorAll('#splash-line2 .splash-word');

  const wordDelayL1 = 260;
  const pauseBetweenLines = 1000;
  const wordDelayL2 = 320;
  const holdAfterDone = 1200;

  let t = 280;
  line1Words.forEach((word) => {
    setTimeout(() => word.classList.add('show'), t);
    t += wordDelayL1;
  });

  const line2Start = t + pauseBetweenLines;
  line2Words.forEach((word, i) => {
    setTimeout(() => word.classList.add('show'), line2Start + i * wordDelayL2);
  });

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

// ── Scroll-triggered reveal ──
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

// ── Demo Stage Controller (4 stages, old interactive pattern) ──
let currentStage = 0;
const stages = document.querySelectorAll('.demo-stage');
const dots   = document.querySelectorAll('.demo-dot');

// Timer management
let autoTimers = [];
function clearAutoTimers() {
  autoTimers.forEach(clearTimeout);
  autoTimers = [];
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

// Dot clicks
dots.forEach(d => {
  d.addEventListener('click', () => goToStage(parseInt(d.dataset.step)));
});

// Arrow clicks
const leftArrowBtn  = document.getElementById('demo-arrow-left');
const rightArrowBtn = document.getElementById('demo-arrow-right');
if (leftArrowBtn)  leftArrowBtn.addEventListener('click',  () => goToStage(currentStage - 1));
if (rightArrowBtn) rightArrowBtn.addEventListener('click', () => goToStage(currentStage + 1));

// Stage 0: "Start demo" button — first click starts archive, second click advances
const next0 = document.getElementById('next-0');
if (next0) {
  next0.addEventListener('click', () => {
    if (next0.dataset.ready === 'true') {
      goToStage(1);
    } else {
      startFullDemo();
    }
  });
}

// All other next buttons use data-goto
document.querySelectorAll('.demo-next-btn:not(#next-0)').forEach(btn => {
  btn.addEventListener('click', () => {
    const goto = parseInt(btn.dataset.goto);
    if (!isNaN(goto)) goToStage(goto);
  });
});

// Restore button
const restoreBtnEl = document.getElementById('restore-btn');
if (restoreBtnEl) restoreBtnEl.addEventListener('click', handleDemoRestore);

function runStageAnimation(n) {
  if (n === 0) runArchiveAnimation();
  if (n === 1) runGroupsAnimation();
  if (n === 2) runSearchAnimation();
  if (n === 3) runRestoreAnimation();
}

// ── Stage 1: Archive — reset to static state ──
function runArchiveAnimation() {
  const btabs   = [0, 1, 2].map(i => document.getElementById('btab-' + i));
  const toast   = document.getElementById('archive-toast');
  const nextBtn = document.getElementById('next-0');

  btabs.forEach(t => { if (t) t.classList.remove('archiving-out'); });
  if (toast) toast.classList.remove('show');
  if (nextBtn) {
    nextBtn.dataset.ready = 'false';
    nextBtn.textContent   = 'Start demo';
    nextBtn.disabled      = false;
    nextBtn.classList.add('visible');
  }
}

// "Start demo" — runs archive animation then reveals next button
function startFullDemo() {
  const btabs   = [0, 1, 2].map(i => document.getElementById('btab-' + i));
  const toast   = document.getElementById('archive-toast');
  const nextBtn = document.getElementById('next-0');

  if (nextBtn) nextBtn.disabled = true;

  btabs.forEach((tab, i) => {
    at(() => { if (tab) tab.classList.add('archiving-out'); }, 400 + i * 400);
  });

  const afterArchive = 400 + 3 * 400 + 300;
  at(() => { if (toast) toast.classList.add('show'); }, afterArchive);

  at(() => {
    if (nextBtn) {
      nextBtn.innerHTML     = 'See smart groups \u00a0\u2192';
      nextBtn.dataset.ready = 'true';
      nextBtn.disabled      = false;
    }
  }, afterArchive + 600);
}

// ── Stage 2: Smart Groups (auto-cycles UNI, RESEARCH, YOUTUBE, SOCIAL) ──
function runGroupsAnimation() {
  const chips   = document.querySelectorAll('#ext-groups-1 .ext-chip');
  const results = document.getElementById('ext-results-1');

  const groupTabs = {
    'chip-uni': [
      { icon: 'C', title: 'ECON 102: Midterm Guide', meta: 'canvas.ubc.ca \u00b7 1d ago' },
      { icon: 'U', title: 'UBC Library Portal', meta: 'library.ubc.ca \u00b7 2d ago' },
      { icon: 'E', title: 'Intro to Economics', meta: 'economics101.com \u00b7 2d ago' },
      { icon: 'I', title: 'Investopedia: Supply & Demand', meta: 'investopedia.com \u00b7 3d ago' },
    ],
    'chip-res': [
      { icon: 'N', title: 'NASA Climate Change Overview', meta: 'climate.nasa.gov \u00b7 4h ago' },
      { icon: 'G', title: 'IPCC AR6 Summary Report', meta: 'ipcc.ch \u00b7 2d ago' },
    ],
    'chip-yt': [
      { icon: 'Y', title: '3hr Pomodoro Timer', meta: 'youtube.com \u00b7 1d ago' },
      { icon: 'Y', title: 'Lo-fi Hip Hop Radio', meta: 'youtube.com \u00b7 3d ago' },
    ],
    'chip-soc': [
      { icon: 'R', title: 'Reddit \u2014 r/economics', meta: 'reddit.com \u00b7 1h ago' },
      { icon: 'R', title: 'Reddit \u2014 r/UBC', meta: 'reddit.com \u00b7 3h ago' },
      { icon: 'T', title: 'Twitter / X', meta: 'x.com \u00b7 5h ago' },
      { icon: 'I', title: 'Instagram', meta: 'instagram.com \u00b7 1d ago' },
      { icon: 'D', title: 'Discord \u2014 Study Group', meta: 'discord.com \u00b7 1d ago' },
    ]
  };

  const chipOrder = ['chip-uni', 'chip-res', 'chip-yt', 'chip-soc'];

  chips.forEach(c => c.classList.remove('visible', 'ext-chip-active'));
  if (results) results.classList.remove('visible');

  chips.forEach((chip, i) => {
    at(() => chip.classList.add('visible'), 280 + i * 170);
  });

  const afterChips = 280 + chips.length * 170 + 300;

  function showGroup(chipId, delay) {
    at(() => {
      chips.forEach(c => c.classList.remove('ext-chip-active'));
      const chip = document.getElementById(chipId);
      if (chip) chip.classList.add('ext-chip-active');

      const tabs = groupTabs[chipId] || [];
      if (results) {
        results.classList.add('visible');
        results.innerHTML = tabs.map(r =>
          `<div class="ext-tab-row visible">
            <div class="ext-tab-fav">${r.icon}</div>
            <div class="ext-tab-info">
              <div class="ext-tab-title">${r.title}</div>
              <div class="ext-tab-meta">${r.meta}</div>
            </div>
            <button class="ext-restore-btn">Restore</button>
          </div>`
        ).join('') + `<div class="ext-restore-all-row visible"><button class="ext-restore-all-btn">Restore all ${tabs.length} \u00a0\u2192</button></div>`;

        results.style.opacity = '0';
        results.style.transform = 'translateY(5px)';
        results.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        requestAnimationFrame(() => {
          results.style.opacity = '1';
          results.style.transform = 'translateY(0)';
        });
      }
    }, delay);
  }

  showGroup('chip-uni', afterChips);
  showGroup('chip-res', afterChips + 2200);
  showGroup('chip-yt', afterChips + 4400);
  showGroup('chip-soc', afterChips + 6600);
}

// ── Stage 3: Search (types econ, deletes, types climate) ──
const searchStates = [
  {
    query: 'econ',
    label: '3 results \u00b7 \u201cecon\u201d',
    results: [
      { icon: 'E', title: 'Introduction to Economics', meta: 'economics101.com \u00b7 2h ago' },
      { icon: 'C', title: 'ECON 102: Midterm Guide', meta: 'canvas.ubc.ca \u00b7 1d ago' },
      { icon: 'I', title: 'Supply and Demand, Investopedia', meta: 'investopedia.com \u00b7 3d ago' },
    ]
  },
  {
    query: 'climate',
    label: '3 results \u00b7 \u201cclimate\u201d',
    results: [
      { icon: 'N', title: 'NASA Climate Change Overview', meta: 'climate.nasa.gov \u00b7 4h ago' },
      { icon: 'G', title: 'IPCC AR6 Summary Report', meta: 'ipcc.ch \u00b7 2d ago' },
      { icon: 'K', title: 'Carbon Cycle, Khan Academy', meta: 'khanacademy.org \u00b7 3d ago' },
    ]
  }
];

function showSearchResults(state, resultsEl, labelEl) {
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
    resultsEl.style.transition = 'opacity 0.3s, transform 0.3s';
    resultsEl.style.opacity = '1';
    resultsEl.style.transform = 'translateY(0)';
  }
}

function clearSearchResults(resultsEl, labelEl) {
  if (resultsEl) {
    resultsEl.style.opacity = '0';
    resultsEl.style.transform = 'translateY(6px)';
  }
  if (labelEl) labelEl.textContent = 'type to search\u2026';
}

function runSearchAnimation() {
  const queryEl   = document.getElementById('mock-query');
  const labelEl   = document.getElementById('mock-label');
  const resultsEl = document.getElementById('mock-results');

  if (!queryEl) return;
  queryEl.textContent = '';
  clearSearchResults(resultsEl, labelEl);

  const state1 = searchStates[0];
  const state2 = searchStates[1];

  let t = 400;

  // Type "econ"
  state1.query.split('').forEach((ch, i) => {
    at(() => { queryEl.textContent += ch; }, t + i * 110);
  });
  t += state1.query.length * 110;
  at(() => { showSearchResults(state1, resultsEl, labelEl); }, t);

  t += 1800;
  at(() => { clearSearchResults(resultsEl, labelEl); }, t);
  t += 300;

  for (let i = 0; i < state1.query.length; i++) {
    at(() => { queryEl.textContent = queryEl.textContent.slice(0, -1); }, t + i * 70);
  }
  t += state1.query.length * 70 + 400;

  // Type "climate"
  state2.query.split('').forEach((ch, i) => {
    at(() => { queryEl.textContent += ch; }, t + i * 110);
  });
  t += state2.query.length * 110;
  at(() => { showSearchResults(state2, resultsEl, labelEl); }, t);
}

// ── Stage 4: Calendar + Corner Notif + Expand to Full ──
function runRestoreAnimation() {
  const calMock     = document.getElementById('cal-mock');
  const cornerNotif = document.getElementById('corner-notif');
  const notif       = document.getElementById('caddy-notif');
  const actions     = document.getElementById('notif-actions');
  const success     = document.getElementById('notif-success');
  const restoreBtn  = document.getElementById('restore-btn');

  // Reset everything
  if (calMock) { calMock.style.opacity = '0'; calMock.style.transform = 'translateY(8px)'; }
  if (cornerNotif) cornerNotif.classList.remove('show', 'dismiss');
  if (notif) notif.classList.remove('show');
  if (success) success.classList.remove('show');
  if (actions) actions.style.display = '';
  if (restoreBtn) { restoreBtn.textContent = 'Restore All'; restoreBtn.disabled = false; }

  // Step 1: Calendar browser window fades in
  at(() => {
    if (calMock) {
      calMock.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      calMock.style.opacity = '1';
      calMock.style.transform = 'translateY(0)';
    }
  }, 400);

  // Step 2: Corner notification pops from CV icon
  at(() => { if (cornerNotif) cornerNotif.classList.add('show'); }, 1400);

  // Step 3: Dismiss corner, show full notification below
  at(() => {
    if (cornerNotif) cornerNotif.classList.add('dismiss');
    if (notif) notif.classList.add('show');
  }, 2800);
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

// Init: show stage 0 in static state
runStageAnimation(0);
