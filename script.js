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

// Waitlist form
function handleWaitlist(e) {
  e.preventDefault();
  const input = e.target.querySelector('.waitlist-input');
  const btn   = e.target.querySelector('.waitlist-btn');
  const email = input.value.trim();
  if (!email) return;

  // In production this would POST to your waitlist backend.
  // For now, show confirmation inline.
  btn.textContent  = '✓ You\'re on the list';
  btn.style.background = '#1a1a1a';
  btn.disabled     = true;
  input.disabled   = true;
  input.style.opacity = '0.5';
}
