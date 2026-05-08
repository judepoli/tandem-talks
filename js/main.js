// Nav: mobile toggle
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Mark active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Date field: minimum is tomorrow
const rideDateInput = document.getElementById('ride-date');
if (rideDateInput) {
  const earliest = new Date();
  earliest.setDate(earliest.getDate() + 14);
  rideDateInput.min = earliest.toISOString().split('T')[0];
}

// Netlify form: show success state without page reload
const bookingForm = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Combine time selects into hidden ride_time field
    const hour = document.getElementById('time-hour');
    const minute = document.getElementById('time-minute');
    const ampm = document.getElementById('time-ampm');
    const rideTime = document.getElementById('ride-time');
    if (!hour.value || !minute.value || !ampm.value) {
      hour.style.borderColor = 'var(--color-accent)';
      minute.style.borderColor = 'var(--color-accent)';
      ampm.style.borderColor = 'var(--color-accent)';
      hour.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    let h = parseInt(hour.value);
    if (ampm.value === 'PM' && h !== 12) h += 12;
    if (ampm.value === 'AM' && h === 12) h = 0;
    rideTime.value = `${h.toString().padStart(2, '0')}:${minute.value}`;

    const submitBtn = bookingForm.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const data = new FormData(bookingForm);
      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });

      if (response.ok) {
        bookingForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        throw new Error('Network response not ok');
      }
    } catch {
      submitBtn.textContent = 'Book My Ride';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again or DM @tandem_talks on Instagram.');
    }
  });
}
