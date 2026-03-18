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

// Stagger siblings within the same parent container
document.querySelectorAll(
  '.how-step, .pricing-card, .editorial-pull, .editorial-body, .compare-table-wrap, .reveal, .reveal-heading'
).forEach((el, i) => {
  if (!el.classList.contains('reveal') && !el.classList.contains('reveal-heading')) {
    el.classList.add('reveal');
  }
  // Stagger delay based on sibling index within parent
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

// Attach dot clicks
dots.forEach(d => {
  d.addEventListener('click', () => goToStage(parseInt(d.dataset.step)));
});

// Attach demo-next-btn clicks via data-goto attribute (replaces all inline onclick)
document.querySelectorAll('.demo-next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const goto = parseInt(btn.dataset.goto);
    if (!isNaN(goto)) goToStage(goto);
  });
});

// Attach restore button
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

  // Reset
  btabs.forEach(t => { if (t) t.classList.remove('archiving-out'); });
  if (toast)   toast.classList.remove('show');
  if (nextBtn) nextBtn.classList.remove('visible');

  // Archive each tab with stagger
  btabs.forEach((tab, i) => {
    setTimeout(() => { if (tab) tab.classList.add('archiving-out'); }, 700 + i * 450);
  });

  // Show toast then next button
  setTimeout(() => { if (toast)   toast.classList.add('show'); },    700 + 3 * 450 + 200);
  setTimeout(() => { if (nextBtn) nextBtn.classList.add('visible'); }, 700 + 3 * 450 + 700);
}

// ── Stage 2: Smart Groups ──
function runGroupsAnimation() {
  const buttons = document.querySelectorAll('.mock-group-btn');
  const cta     = document.getElementById('mock-restore-group');
  const nextBtn = document.getElementById('next-1');

  if (nextBtn) nextBtn.classList.remove('visible');

  // Pulse the active button
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

  // Type the query letter by letter
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

// ── Stage 3: Calendar + Auto popup + Interactive restore ──
function runRestoreAnimation() {
  const notif      = document.getElementById('caddy-notif');
  const countdown  = document.getElementById('cal-countdown');
  const actions    = document.getElementById('notif-actions');
  const success    = document.getElementById('notif-success');
  const restoreBtn = document.getElementById('restore-btn');
  const nextBtn    = document.querySelector('#demo-3 .demo-next-btn.demo-next-ghost');

  // Reset state
  if (notif)      { notif.classList.remove('show'); }
  if (countdown)  countdown.classList.remove('show');
  if (success)    success.classList.remove('show');
  if (actions)    actions.style.display = '';
  if (restoreBtn) { restoreBtn.textContent = 'Restore All'; restoreBtn.disabled = false; }
  if (nextBtn)    nextBtn.style.opacity = '0';

  // Show countdown badge on calendar event
  setTimeout(() => { if (countdown) countdown.classList.add('show'); }, 800);

  // Slide up notification
  setTimeout(() => { if (notif) notif.classList.add('show'); }, 2000);

  // Show start-over button
  setTimeout(() => { if (nextBtn) nextBtn.style.opacity = '1'; }, 2500);
}

// Interactive restore button handler
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

// Kick off initial animation
runStageAnimation(0);

// ── Typewriter ──
const typewriterEl = document.getElementById('typewriter');
const tw_lines = [
  'Tabs you forget get archived automatically.',
  'Search anything. Find it in seconds.',
  'Purple diamonds group your tabs by topic.',
  'Your calendar triggers the restore for you.',
  'Everything stays in your browser. Always.',
];
let tw_line = 0;
let tw_char = 0;
let tw_deleting = false;
let tw_timer;

function typewriterTick() {
  if (!typewriterEl) return;
  const line = tw_lines[tw_line];

  if (!tw_deleting) {
    tw_char++;
    typewriterEl.textContent = line.slice(0, tw_char);
    if (tw_char === line.length) {
      tw_deleting = true;
      tw_timer = setTimeout(typewriterTick, 2200);
      return;
    }
    tw_timer = setTimeout(typewriterTick, 42);
  } else {
    tw_char--;
    typewriterEl.textContent = line.slice(0, tw_char);
    if (tw_char === 0) {
      tw_deleting = false;
      tw_line = (tw_line + 1) % tw_lines.length;
      tw_timer = setTimeout(typewriterTick, 400);
      return;
    }
    tw_timer = setTimeout(typewriterTick, 22);
  }
}

setTimeout(typewriterTick, 1400);

// ── Waitlist form ──
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyknbnoq';

const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input   = document.getElementById('waitlist-email');
    const btn     = document.getElementById('waitlist-btn');
    const confirm = document.getElementById('waitlist-confirm');
    const email   = input.value.trim();
    if (!email) return;

    btn.textContent = 'Submitting...';
    btn.disabled    = true;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        input.disabled       = true;
        input.style.opacity  = '0.4';
        btn.textContent      = "You're on the list";
        btn.style.background = '#1a1a1a';
        confirm.textContent  = "Got it. You'll hear from us first.";
        confirm.style.color  = 'var(--gold)';
      } else {
        btn.textContent = 'Try again';
        btn.disabled    = false;
      }
    } catch {
      const list = JSON.parse(localStorage.getItem('caddy_waitlist') || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem('caddy_waitlist', JSON.stringify(list));
      input.disabled       = true;
      input.style.opacity  = '0.4';
      btn.textContent      = "You're on the list";
      btn.style.background = '#1a1a1a';
      confirm.textContent  = "Got it. You'll hear from us first.";
      confirm.style.color  = 'var(--gold)';
    }
  });
}
