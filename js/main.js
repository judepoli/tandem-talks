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

// Date field: minimum is 14 days from today (local date, not UTC)
const rideDateInput = document.getElementById('ride-date');
if (rideDateInput) {
  const earliest = new Date();
  earliest.setDate(earliest.getDate() + 14);
  const y = earliest.getFullYear();
  const mo = String(earliest.getMonth() + 1).padStart(2, '0');
  const d = String(earliest.getDate()).padStart(2, '0');
  rideDateInput.min = `${y}-${mo}-${d}`;
}

// Netlify form: show success state without page reload
const bookingForm = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const hour = document.getElementById('time-hour');
    const minute = document.getElementById('time-minute');
    const ampm = document.getElementById('time-ampm');
    const rideTime = document.getElementById('ride-time');

    // Reset time picker state on each attempt
    hour.style.borderColor = '';
    minute.style.borderColor = '';
    ampm.style.borderColor = '';
    const existingError = document.getElementById('time-error');
    if (existingError) existingError.remove();

    // Validate time picker
    if (!hour.value || !minute.value || !ampm.value) {
      hour.style.borderColor = 'var(--color-accent)';
      minute.style.borderColor = 'var(--color-accent)';
      ampm.style.borderColor = 'var(--color-accent)';
      const err = document.createElement('p');
      err.id = 'time-error';
      err.style.cssText = 'color: var(--color-accent); font-size: 0.85rem; margin-top: 0.4rem;';
      err.textContent = 'Please select a pickup time.';
      hour.closest('.form-group').appendChild(err);
      hour.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Build 24hr time and full datetimes
    let h = parseInt(hour.value);
    if (ampm.value === 'PM' && h !== 12) h += 12;
    if (ampm.value === 'AM' && h === 12) h = 0;
    const hStr = h.toString().padStart(2, '0');
    const dateVal = document.getElementById('ride-date').value;
    rideTime.value = `${hStr}:${minute.value}`;
    document.getElementById('ride-start-datetime').value = `${dateVal} ${hStr}:${minute.value}`;

    // End time: handle midnight wrap — if 11 PM, end is 00:00 next day
    const endHRaw = h + 1;
    const endHStr = (endHRaw % 24).toString().padStart(2, '0');
    let endDate = dateVal;
    if (endHRaw >= 24) {
      const next = new Date(dateVal + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      endDate = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
    }
    document.getElementById('ride-end-datetime').value = `${endDate} ${endHStr}:${minute.value}`;

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
