// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

if (navToggle && primaryNav) {
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
}

// Contact form: two-step validation + submit handling
// (guarded — service detail pages share this script but have no contact form)
const form = document.getElementById('contactForm');

if (form) {
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  const formStep1 = document.getElementById('formStep1');
  const formStep2 = document.getElementById('formStep2');
  const stepIndicator1 = document.getElementById('stepIndicator1');
  const stepIndicator2 = document.getElementById('stepIndicator2');
  const step1NextBtn = document.getElementById('step1NextBtn');
  const step2BackBtn = document.getElementById('step2BackBtn');

  const emailInput = document.getElementById('email');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailError = document.getElementById('emailError');
  const step1Error = document.getElementById('step1Error');

  const servicesOther = document.getElementById('servicesOther');
  const otherSpecifyRow = document.getElementById('otherSpecifyRow');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateStep1() {
    let valid = true;

    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.setAttribute('aria-invalid', 'true');
      valid = false;
    } else {
      emailError.textContent = '';
      emailInput.setAttribute('aria-invalid', 'false');
    }

    if (!firstNameInput.value.trim() && !lastNameInput.value.trim()) {
      step1Error.textContent = 'Please enter your first or last name.';
      valid = false;
    } else {
      step1Error.textContent = '';
    }

    return valid;
  }

  [emailInput, firstNameInput, lastNameInput].forEach((input) => {
    input.addEventListener('blur', validateStep1);
  });

  function isStep2Active() {
    return formStep2.classList.contains('is-active');
  }

  function goToStep2() {
    if (!validateStep1()) return;
    formStep1.classList.remove('is-active');
    formStep2.classList.add('is-active');
    stepIndicator1.classList.remove('is-active');
    stepIndicator2.classList.add('is-active');
  }

  function goToStep1() {
    formStep2.classList.remove('is-active');
    formStep1.classList.add('is-active');
    stepIndicator2.classList.remove('is-active');
    stepIndicator1.classList.add('is-active');
  }

  step1NextBtn.addEventListener('click', goToStep2);
  step2BackBtn.addEventListener('click', goToStep1);

  if (servicesOther && otherSpecifyRow) {
    servicesOther.addEventListener('change', () => {
      otherSpecifyRow.classList.toggle('is-hidden', !servicesOther.checked);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // A stray Enter keypress on step 1 submits the form natively — treat that
    // as "go to next step" instead, since the real submit button lives on step 2.
    if (!isStep2Active()) {
      goToStep2();
      return;
    }

    if (!validateStep1()) {
      goToStep1();
      return;
    }

    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const servicesNeeded = Array.from(
      form.querySelectorAll('input[name="servicesNeeded"]:checked')
    ).map((el) => el.value);

    const payload = {
      businessName: document.getElementById('businessName').value.trim(),
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: document.getElementById('phone').value.trim(),
      website: document.getElementById('website').value.trim(),
      address: {
        street: document.getElementById('addressStreet').value.trim(),
        city: document.getElementById('addressCity').value.trim(),
        state: document.getElementById('addressState').value.trim(),
        zip: document.getElementById('addressZip').value.trim(),
        country: document.getElementById('addressCountry').value.trim(),
      },
      servicesNeeded,
      otherSpecify: document.getElementById('otherSpecify').value.trim(),
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
      otherSpecifyRow.classList.add('is-hidden');
      goToStep1();
    } catch (err) {
      formStatus.textContent =
        "Something went wrong sending your message. Please email us directly instead.";
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
