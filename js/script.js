// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Contact form validation + submit handling
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

const fields = {
  name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
  email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
  message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(key) {
  const { input, error } = fields[key];
  let message = '';

  if (!input.value.trim()) {
    message = 'This field is required.';
  } else if (key === 'email' && !emailPattern.test(input.value.trim())) {
    message = 'Please enter a valid email address.';
  }

  error.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  input.closest('.form-row').classList.toggle('has-error', Boolean(message));
  return !message;
}

Object.keys(fields).forEach((key) => {
  fields[key].input.addEventListener('blur', () => validateField(key));
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const validations = Object.keys(fields).map(validateField);
  const isValid = validations.every(Boolean);

  formStatus.textContent = '';
  formStatus.className = 'form-status';

  if (!isValid) {
    formStatus.textContent = 'Please fix the highlighted fields and try again.';
    formStatus.classList.add('error');
    return;
  }

  const payload = {
    name: fields.name.input.value.trim(),
    email: fields.email.input.value.trim(),
    phone: document.getElementById('phone').value.trim(),
    service: document.getElementById('service').value,
    message: fields.message.input.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    // Draft-stage endpoint: intended to hand off to a server function that
    // emails CONTACT_FORM_TO_EMAIL (see api/contact.js). Not wired up yet,
    // so this will fail until a backend is deployed — that's expected for
    // this pass and demonstrates the error state below.
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    formStatus.textContent = "Thanks for reaching out — we'll be in touch soon.";
    formStatus.classList.add('success');
    form.reset();
  } catch (err) {
    formStatus.textContent =
      "Something went wrong sending your message. Please email us directly instead.";
    formStatus.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});
