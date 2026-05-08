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

    // Validate contact: must be a valid email or phone number
    const contactInput = document.getElementById('contact');
    const contactValue = contactInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-(). ]{7,20}$/;
    if (!emailRegex.test(contactValue) && !phoneRegex.test(contactValue)) {
      contactInput.setCustomValidity('Please enter a valid email address or phone number.');
      contactInput.reportValidity();
      return;
    }
    contactInput.setCustomValidity('');

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
