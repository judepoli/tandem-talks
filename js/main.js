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

// Interest form: post to /api/contact, show success without page reload
const bookingForm = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const data = new FormData(bookingForm);
      const response = await fetch('https://hooks.zapier.com/hooks/catch/27524470/4yekwg2/', {
        method: 'POST',
        body: new URLSearchParams(data).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (response.ok) {
        bookingForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        throw new Error('Network response not ok');
      }
    } catch {
      submitBtn.textContent = "I'm Interested";
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again or DM @tandem_talks on Instagram.');
    }
  });
}
