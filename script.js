// Scroll-triggered reveal
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.how-step, .pricing-card, .editorial-pull, .editorial-body, .compare-table').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  observer.observe(el);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Animated mockup: cycles through search states
const mockStates = [
  {
    query: 'econ',
    label: '3 results \u00b7 "econ"',
    reminder: 'ECON Midterm \u00b7 in 47m',
    results: [
      { icon: 'E', title: 'Introduction to Economics', meta: 'economics101.com \u00b7 2h ago' },
      { icon: 'C', title: 'ECON 102: Midterm Guide',   meta: 'canvas.ubc.ca \u00b7 1d ago' },
      { icon: 'I', title: 'Supply and Demand, Investopedia', meta: 'investopedia.com \u00b7 3d ago' },
    ]
  },
  {
    query: 'climate',
    label: '2 results \u00b7 "climate"',
    reminder: 'ENV Essay \u00b7 in 2h',
    results: [
      { icon: 'N', title: 'NASA Climate Change Overview', meta: 'climate.nasa.gov \u00b7 4h ago' },
      { icon: 'G', title: 'IPCC AR6 Summary Report',      meta: 'ipcc.ch \u00b7 2d ago' },
      { icon: 'B', title: 'Carbon Cycle, Khan Academy',   meta: 'khanacademy.org \u00b7 3d ago' },
    ]
  },
  {
    query: 'essay',
    label: '3 results \u00b7 "essay"',
    reminder: 'English 12 \u00b7 in 30m',
    results: [
      { icon: 'P', title: 'Thesis Writing: Purdue OWL',  meta: 'owl.purdue.edu \u00b7 1h ago' },
      { icon: 'G', title: 'Google Docs \u2014 Draft 3',  meta: 'docs.google.com \u00b7 5h ago' },
      { icon: 'J', title: 'JSTOR: Secondary Sources',    meta: 'jstor.org \u00b7 1d ago' },
    ]
  }
];

let mockIndex = 0;

function updateMockup() {
  const state = mockStates[mockIndex];
  const queryEl   = document.getElementById('mock-query');
  const labelEl   = document.getElementById('mock-label');
  const resultsEl = document.getElementById('mock-results');
  const reminderTitle = document.getElementById('mock-reminder-title');

  if (!queryEl) return;

  // Fade out
  resultsEl.style.opacity = '0';
  resultsEl.style.transform = 'translateY(4px)';
  resultsEl.style.transition = 'opacity 0.3s, transform 0.3s';

  setTimeout(() => {
    queryEl.textContent = state.query;
    labelEl.textContent = state.label;
    reminderTitle.textContent = state.reminder;

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

    // Fade in
    resultsEl.style.opacity = '1';
    resultsEl.style.transform = 'translateY(0)';
    mockIndex = (mockIndex + 1) % mockStates.length;
  }, 300);
}

setInterval(updateMockup, 3000);

// Waitlist form — submits to Formspree
// To activate: sign up free at formspree.io, create a form, paste your endpoint below
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

async function handleWaitlist(e) {
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
      input.disabled        = true;
      input.style.opacity   = '0.4';
      btn.textContent       = "You're on the list";
      btn.style.background  = '#1a1a1a';
      confirm.textContent   = "Got it. You'll hear from us first.";
      confirm.style.color   = 'var(--gold)';
    } else {
      btn.textContent  = 'Try again';
      btn.disabled     = false;
    }
  } catch {
    // Offline fallback: save locally
    const list = JSON.parse(localStorage.getItem('caddy_waitlist') || '[]');
    if (!list.includes(email)) list.push(email);
    localStorage.setItem('caddy_waitlist', JSON.stringify(list));
    btn.textContent      = "You're on the list";
    btn.style.background = '#1a1a1a';
    confirm.textContent  = "Got it. You'll hear from us first.";
    confirm.style.color  = 'var(--gold)';
  }
}
