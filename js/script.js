// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('a, button').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Testimonial "See more" toggle — the button only shows up if a quote is
// actually being truncated, so short testimonials never get a dead button.
const testimonialCards = document.querySelectorAll('.testimonial-card');

if (testimonialCards.length) {
  function refreshTestimonialToggles() {
    testimonialCards.forEach((card) => {
      const quote = card.querySelector('.testimonial-quote');
      const toggle = card.querySelector('[data-testimonial-toggle]');
      if (!quote || !toggle || quote.classList.contains('is-expanded')) return;
      toggle.classList.toggle('is-hidden', quote.scrollHeight <= quote.clientHeight + 1);
    });
  }

  testimonialCards.forEach((card) => {
    const quote = card.querySelector('.testimonial-quote');
    const toggle = card.querySelector('[data-testimonial-toggle]');
    if (!quote || !toggle) return;

    toggle.addEventListener('click', () => {
      const expanded = quote.classList.toggle('is-expanded');
      toggle.textContent = expanded ? 'See less' : 'See more';
    });
  });

  refreshTestimonialToggles();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshTestimonialToggles);
  }
  window.addEventListener('resize', refreshTestimonialToggles);
}

// Simple contact form: Name, Email, Message only
// (guarded — not every page has this form)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const businessNameInput = document.getElementById('contactBusinessName');
  const websiteInput = document.getElementById('contactWebsite');
  const phoneInput = document.getElementById('contactPhone');
  const messageInput = document.getElementById('contactMessage');
  const nameError = document.getElementById('contactNameError');
  const emailError = document.getElementById('contactEmailError');
  const businessNameError = document.getElementById('contactBusinessNameError');
  const messageError = document.getElementById('contactMessageError');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const formStatus = document.getElementById('formStatus');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateContactForm() {
    let valid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      valid = false;
    } else {
      nameError.textContent = '';
    }

    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    } else {
      emailError.textContent = '';
    }

    if (!businessNameInput.value.trim()) {
      businessNameError.textContent = 'Please enter your business name.';
      valid = false;
    } else {
      businessNameError.textContent = '';
    }

    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please tell us what you need help with.';
      valid = false;
    } else {
      messageError.textContent = '';
    }

    return valid;
  }

  [nameInput, emailInput, businessNameInput, messageInput].forEach((input) => {
    input.addEventListener('blur', validateContactForm);
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateContactForm()) return;

    formStatus.textContent = '';
    formStatus.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'contact',
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          businessName: businessNameInput.value.trim(),
          website: websiteInput.value.trim(),
          phone: phoneInput.value.trim(),
          message: messageInput.value.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      formStatus.textContent = "Thanks for reaching out — we'll be in touch soon.";
      formStatus.classList.add('success');
      contactForm.reset();
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

// Get Started quiz: multi-step modal lead qualifier
// (guarded — every page carries the same modal markup in its footer)
const quizOverlay = document.querySelector('[data-quiz-overlay]');

if (quizOverlay) {
  const openTriggers = document.querySelectorAll('[data-open-quiz]');
  const closeTriggers = quizOverlay.querySelectorAll('[data-close-quiz]');
  const finishBtn = quizOverlay.querySelector('[data-quiz-finish]');
  const steps = Array.from(quizOverlay.querySelectorAll('[data-quiz-step]'));
  const progressBar = quizOverlay.querySelector('[data-quiz-progress-bar]');
  const stepLabel = quizOverlay.querySelector('[data-quiz-step-label]');
  const backBtn = quizOverlay.querySelector('[data-quiz-back]');
  const quizForm = quizOverlay.querySelector('[data-quiz-form]');
  const confirmStepIndex = steps.findIndex((step) => step.hasAttribute('data-quiz-confirm'));
  const questionStepCount = confirmStepIndex;

  const state = {
    businessType: '',
    situation: '',
    serviceNeeded: '',
    timeline: '',
    name: '',
    email: '',
    businessName: '',
    website: '',
    phone: '',
    notes: '',
  };

  let currentStep = 0;

  function lockBody(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function applySelectedState() {
    quizOverlay.querySelectorAll('[data-option-group]').forEach((group) => {
      const key = group.dataset.optionGroup;
      group.querySelectorAll('.quiz-option').forEach((option) => {
        option.classList.toggle(
          'is-selected',
          Boolean(state[key]) && option.dataset.value === state[key]
        );
      });
    });
  }

  function updateProgress() {
    if (!progressBar || !stepLabel) return;
    if (currentStep >= confirmStepIndex) {
      progressBar.style.width = '100%';
      stepLabel.textContent = "You're all set";
      return;
    }
    progressBar.style.width = `${((currentStep + 1) / questionStepCount) * 100}%`;
    stepLabel.textContent = `Step ${currentStep + 1} of ${questionStepCount}`;
  }

  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, idx) => step.classList.toggle('is-active', idx === currentStep));
    if (backBtn) {
      backBtn.classList.toggle('is-hidden', currentStep === 0 || currentStep >= confirmStepIndex);
    }
    updateProgress();
    applySelectedState();
  }

  function resetQuiz() {
    Object.keys(state).forEach((key) => {
      state[key] = '';
    });
    if (quizForm) quizForm.reset();
    quizOverlay.querySelectorAll('.quiz-option.is-selected').forEach((el) => {
      el.classList.remove('is-selected');
    });
    quizOverlay.querySelectorAll('.form-error').forEach((el) => {
      el.textContent = '';
    });
    const status = quizOverlay.querySelector('[data-quiz-status]');
    if (status) {
      status.textContent = '';
      status.className = 'form-status';
    }
    const submitBtn = quizOverlay.querySelector('[data-quiz-submit]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request a Free Consultation';
    }
  }

  function openQuiz() {
    quizOverlay.classList.add('is-active');
    lockBody(true);
    showStep(0);
  }

  function closeQuiz() {
    quizOverlay.classList.remove('is-active');
    lockBody(false);
  }

  openTriggers.forEach((btn) => btn.addEventListener('click', openQuiz));
  closeTriggers.forEach((btn) => btn.addEventListener('click', closeQuiz));

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      closeQuiz();
      resetQuiz();
      showStep(0);
    });
  }

  quizOverlay.addEventListener('click', (event) => {
    if (event.target === quizOverlay) closeQuiz();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && quizOverlay.classList.contains('is-active')) {
      closeQuiz();
    }
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => showStep(currentStep - 1));
  }

  quizOverlay.querySelectorAll('[data-option-group]').forEach((group) => {
    group.addEventListener('click', (event) => {
      const option = event.target.closest('.quiz-option');
      if (!option) return;
      const key = group.dataset.optionGroup;
      state[key] = option.dataset.value;
      group.querySelectorAll('.quiz-option').forEach((el) => el.classList.remove('is-selected'));
      option.classList.add('is-selected');
      window.setTimeout(() => showStep(currentStep + 1), 220);
    });
  });

  if (quizForm) {
    const quizNameInput = document.getElementById('quizName');
    const quizEmailInput = document.getElementById('quizEmail');
    const quizBusinessNameInput = document.getElementById('quizBusinessName');
    const quizWebsiteInput = document.getElementById('quizWebsite');
    const quizPhoneInput = document.getElementById('quizPhone');
    const quizNotesInput = document.getElementById('quizNotes');
    const quizNameError = quizForm.querySelector('[data-quiz-error="name"]');
    const quizEmailError = quizForm.querySelector('[data-quiz-error="email"]');
    const quizBusinessNameError = quizForm.querySelector('[data-quiz-error="businessName"]');
    const quizStatus = quizForm.querySelector('[data-quiz-status]');
    const quizSubmitBtn = quizForm.querySelector('[data-quiz-submit]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    quizForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let valid = true;

      if (!quizNameInput.value.trim()) {
        quizNameError.textContent = 'Please enter your name.';
        valid = false;
      } else {
        quizNameError.textContent = '';
      }

      if (!quizEmailInput.value.trim() || !emailPattern.test(quizEmailInput.value.trim())) {
        quizEmailError.textContent = 'Please enter a valid email address.';
        valid = false;
      } else {
        quizEmailError.textContent = '';
      }

      if (!quizBusinessNameInput.value.trim()) {
        quizBusinessNameError.textContent = 'Please enter your business name.';
        valid = false;
      } else {
        quizBusinessNameError.textContent = '';
      }

      if (!valid) return;

      state.name = quizNameInput.value.trim();
      state.email = quizEmailInput.value.trim();
      state.businessName = quizBusinessNameInput.value.trim();
      state.website = quizWebsiteInput.value.trim();
      state.phone = quizPhoneInput.value.trim();
      state.notes = quizNotesInput.value.trim();

      quizStatus.textContent = '';
      quizStatus.className = 'form-status';
      quizSubmitBtn.disabled = true;
      quizSubmitBtn.textContent = 'Submitting...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formType: 'quiz', ...state }),
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        showStep(confirmStepIndex);
      } catch (err) {
        quizStatus.textContent =
          'Something went wrong submitting your answers. Please email us directly instead.';
        quizStatus.classList.add('error');
      } finally {
        quizSubmitBtn.disabled = false;
        quizSubmitBtn.textContent = 'Request a Free Consultation';
      }
    });
  }
}
