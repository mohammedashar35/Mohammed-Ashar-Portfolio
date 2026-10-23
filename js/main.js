/**
 * MOHAMMED ASHAR - PORTFOLIO INTERACTION ENGINE
 * Features:
 * 1. Dual-State Header Morph (Normal full-width -> Floating pill navbar on scroll)
 * 2. GSAP & ScrollTrigger enhanced transitions
 * 3. Three.js Ambient Particle Grid Canvas
 * 4. Mobile Drawer Menu & Responsive Breakpoint Listeners
 * 5. Interactive Avatar Modal & Smooth Scrolling
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Dual-State Header Scroll Controller (Reference Image 1 -> Reference Image 2)
  // -------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const scrollThreshold = 45; // Pixels scrolled before morphing into floating pill
  let isScrolled = false;

  function updateHeaderOnScroll() {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollY > scrollThreshold && !isScrolled) {
      isScrolled = true;
      siteHeader.classList.add('is-scrolled');
      
      // GSAP micro-animation on morph
      if (window.gsap) {
        gsap.fromTo(
          '.header-nav-box',
          { y: -6, opacity: 0.94 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    } else if (currentScrollY <= scrollThreshold && isScrolled) {
      isScrolled = false;
      siteHeader.classList.remove('is-scrolled');
      
      if (window.gsap) {
        gsap.fromTo(
          '.header-nav-box',
          { y: 4, opacity: 0.95 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    }
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  // Initial check on load
  updateHeaderOnScroll();

  // -------------------------------------------------------------------------
  // 2. Mobile / Tablet Drawer Menu
  // -------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileNavDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    mobileToggleBtn.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Animate drawer links in with GSAP
    if (window.gsap) {
      gsap.fromTo(
        '.drawer-menu-list li',
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: 0.1 }
      );
    }
  }

  function closeDrawer() {
    mobileNavDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    mobileToggleBtn.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', function () {
      if (mobileNavDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // -------------------------------------------------------------------------
  // 3. Smooth Anchor Scrolling & Active Link Highlighting
  // -------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          }
        });
      }
    });
  }, { passive: true });

  // Smooth scroll handler for anchor links with Lenis support
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetHash = this.getAttribute('href');
      if (!targetHash || targetHash === '#' || targetHash === '#!') return;
      
      const targetEl = document.querySelector(targetHash);
      if (targetEl) {
        e.preventDefault();

        // If clicking #education or #resume, automatically ensure Education tab is activated
        if (targetHash === '#education' || targetHash === '#resume') {
          const eduTabBtn = document.getElementById('tabBtnEducation');
          if (eduTabBtn && !eduTabBtn.classList.contains('active')) {
            eduTabBtn.click();
          }
        }

        if (window.lenis) {
          window.lenis.scrollTo(targetEl, { offset: -70 });
        } else {
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }

        if (history.pushState) {
          history.pushState(null, null, targetHash);
        } else {
          location.hash = targetHash;
        }
      }
    });
  });

  // Handle URL hash on initial page load
  if (window.location.hash) {
    const initialHash = window.location.hash;
    setTimeout(() => {
      const targetEl = document.querySelector(initialHash);
      if (targetEl) {
        if (initialHash === '#education' || initialHash === '#resume') {
          const eduTabBtn = document.getElementById('tabBtnEducation');
          if (eduTabBtn && !eduTabBtn.classList.contains('active')) {
            eduTabBtn.click();
          }
        }
        if (window.lenis) {
          window.lenis.scrollTo(targetEl, { offset: -70 });
        } else {
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    }, 250);
  }

  // Back to Top button handler (supports both home and projects pages)
  const footerBackToTop = document.getElementById('footerBackToTop');
  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Page Animations
  // -------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', function () {
    // GSAP Entrance Animations for Home Banner Elements
    if (window.gsap) {
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      gsap.from('.site-header', {
        y: -30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Background typography entrance
      gsap.from('.bg-watermark-mohammed', {
        y: -15,
        opacity: 0.3,
        duration: 0.6,
        delay: 0.05,
        ease: 'power2.out'
      });

      gsap.from('.bg-bold-ashar', {
        scale: 0.98,
        opacity: 0.3,
        duration: 0.6,
        delay: 0.1,
        ease: 'power3.out'
      });

      // Left Column items entrance
      gsap.from(['.hero-tagline-sub', '.hero-author-name', '.hero-roles-bar', '.hero-intro-bio', '.hero-connect-block'], {
        x: -30,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        delay: 0.3,
        ease: 'power2.out'
      });

      // Portrait photo entrance
      gsap.from('.hero-my-photo', {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out'
      });

      // Right Column Focus Card entrance
      gsap.from('.hero-focus-card', {
        x: 30,
        opacity: 0,
        duration: 0.9,
        delay: 0.5,
        ease: 'power2.out'
      });

      // Skills / Specialties Section ScrollTrigger entrance
      const specialtiesTrigger = document.getElementById('skills') || document.getElementById('services');
      if (specialtiesTrigger) {
        gsap.from(['.specialties-tag', '.specialties-title', '.specialties-subtitle'], {
          scrollTrigger: {
            trigger: specialtiesTrigger,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          y: 25,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        });

        gsap.from('.specialty-card', {
          scrollTrigger: {
            trigger: specialtiesTrigger,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        });
      }

      // About Us Section ScrollTrigger entrance
      if (document.getElementById('about')) {
        gsap.from('.about-image-card', {
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          x: -35,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        });

        gsap.from(['.about-sub-greeting', '.about-main-title', '.about-bio-text', '.about-stats-grid', '.about-cta-action'], {
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 25,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        });
      }

      // Refresh ScrollTrigger after DOM setups
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }

      // Contact Section ScrollTrigger entrance
      if (document.getElementById('contact')) {
        gsap.from('.contact-info-wrap > *', {
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
          },
          x: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out'
        });

        gsap.from('.contact-form-wrap', {
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
          },
          y: 30,
          opacity: 0,
          duration: 0.85,
          delay: 0.15,
          ease: 'power2.out'
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // Contact Form Submission Handler (Sends Email to mohammedasharan35@gmail.com)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const contactStatusBox = document.getElementById('contactStatusBox');
  const RECIPIENT_EMAIL = 'mohammedasharan35@gmail.com';

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const phoneInput = document.getElementById('contactPhone');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !subject || !message) {
        showContactStatus('Please fill in all required fields marked with *.', 'danger');
        return;
      }

      // Prepare mailto link with structured content
      const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
      const mailtoBody = encodeURIComponent(
        `Hello Mohammed Ashar,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || 'Not provided'}\n` +
        `Subject: ${subject}\n\n` +
        `Message:\n${message}\n\n` +
        `---\nSent via Mohammed Ashar Portfolio Contact Form`
      );
      const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Show clean Thank You confirmation with tick icon only
      showContactStatus(
        `<div class="d-flex align-items-center gap-2">
          <i class="bi bi-check-circle-fill fs-5 text-success"></i>
          <span class="fw-semibold">Thank you, ${escapeHtml(name)}!</span>
        </div>`,
        'success'
      );

      // Trigger user's default email client
      window.location.href = mailtoUrl;

      // Reset form fields
      contactForm.reset();
    });
  }

  function showContactStatus(messageHtml, type) {
    if (!contactStatusBox) return;
    contactStatusBox.className = `contact-status-box alert alert-${type} mt-3 d-block fade show shadow-sm`;
    contactStatusBox.innerHTML = messageHtml;
    contactStatusBox.style.display = 'block';

    contactStatusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // -------------------------------------------------------------------------
  // 6. Resume Interactive Tab Switcher (Education, Skills, Certificates)
  // -------------------------------------------------------------------------
  const resumeTabBtns = document.querySelectorAll('.resume-tab-btn');
  const resumeTabPanes = document.querySelectorAll('.resume-tab-pane');

  if (resumeTabBtns.length > 0) {
    resumeTabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetSelector = this.getAttribute('data-tab-target');
        const targetPane = document.querySelector(targetSelector);

        if (!targetPane) return;

        // Toggle active states on tab buttons
        resumeTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Toggle active states on tab panes
        resumeTabPanes.forEach(pane => {
          pane.classList.remove('active');
        });
        targetPane.classList.add('active');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Certificate Lightbox Modal Preview
  // -------------------------------------------------------------------------
  const certModalEl = document.getElementById('certLightboxModal');
  const certModalImg = document.getElementById('certModalImage');
  const certModalLabel = document.getElementById('certModalLabel');
  const certModalDownload = document.getElementById('certModalDownload');

  function setCertificateData(src, title) {
    if (certModalImg) certModalImg.src = src;
    if (certModalLabel) certModalLabel.textContent = title;
    if (certModalDownload) {
      certModalDownload.href = src;
      certModalDownload.setAttribute('download', title.replace(/[^a-zA-Z0-9_-]/g, '_') + '.png');
    }
  }

  // Listen to Bootstrap's native modal event
  if (certModalEl) {
    certModalEl.addEventListener('show.bs.modal', function (event) {
      const trigger = event.relatedTarget;
      if (trigger && trigger.hasAttribute('data-cert-modal')) {
        const imgSrc = trigger.getAttribute('data-cert-modal');
        const certTitle = trigger.getAttribute('data-cert-title') || 'Certificate Preview';
        setCertificateData(imgSrc, certTitle);
      }
    });
  }

  // Direct click handler on all cert triggers (buttons and thumbnails)
  document.querySelectorAll('[data-cert-modal]').forEach(trigger => {
    trigger.addEventListener('click', function () {
      const imgSrc = this.getAttribute('data-cert-modal');
      const certTitle = this.getAttribute('data-cert-title') || 'Certificate Preview';
      setCertificateData(imgSrc, certTitle);

      if (window.bootstrap && window.bootstrap.Modal && certModalEl) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(certModalEl);
        modalInstance.show();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 8. Projects Archive Filter, Search, and Quick-View Modal Controller
  // -------------------------------------------------------------------------
  const projectCards = document.querySelectorAll('.project-archive-card');
  const projectFilterBtns = document.querySelectorAll('.project-tab-pill, .project-filter-btn');
  const projectSearchInput = document.getElementById('projectSearchInput');
  const projectSearchClear = document.getElementById('projectSearchClear');
  const visibleProjectsCount = document.getElementById('visibleProjectsCount');
  const emptyStateBox = document.getElementById('projectsEmptyState');
  const btnResetFilter = document.getElementById('btnResetFilter');

  if (projectCards.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    function filterProjects() {
      let visibleCount = 0;

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
        const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();
        const cardDesc = (card.getAttribute('data-desc') || '').toLowerCase();

        const matchesCategory = currentCategory === 'all' ||
          cardCategory.split(/[\s,]+/).includes(currentCategory);
        const matchesSearch = !searchQuery ||
          cardTitle.includes(searchQuery) ||
          cardTags.includes(searchQuery) ||
          cardDesc.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleProjectsCount) {
        visibleProjectsCount.textContent = visibleCount;
      }

      if (emptyStateBox) {
        if (visibleCount === 0) {
          emptyStateBox.style.display = 'block';
        } else {
          emptyStateBox.style.display = 'none';
        }
      }
    }

    // Category button click
    projectFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        projectFilterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-filter') || 'all';
        filterProjects();
      });
    });

    // Real-time search
    if (projectSearchInput) {
      projectSearchInput.addEventListener('input', function () {
        searchQuery = this.value.trim().toLowerCase();
        if (projectSearchClear) {
          projectSearchClear.style.display = searchQuery.length > 0 ? 'block' : 'none';
        }
        filterProjects();
      });
    }

    // Clear search button
    if (projectSearchClear) {
      projectSearchClear.addEventListener('click', function () {
        if (projectSearchInput) {
          projectSearchInput.value = '';
          searchQuery = '';
          this.style.display = 'none';
          filterProjects();
          projectSearchInput.focus();
        }
      });
    }

    // Reset filters button in empty state
    if (btnResetFilter) {
      btnResetFilter.addEventListener('click', function () {
        currentCategory = 'all';
        searchQuery = '';
        if (projectSearchInput) projectSearchInput.value = '';
        if (projectSearchClear) projectSearchClear.style.display = 'none';

        projectFilterBtns.forEach(b => {
          if (b.getAttribute('data-filter') === 'all') {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        filterProjects();
      });
    }

    // Initial count calculation
    filterProjects();
  }

  // -------------------------------------------------------------------------
  // 7. Premium Button Text Animation Engine (Letter-by-Letter Stagger)
  // Matches Reference Code & Flow
  // -------------------------------------------------------------------------
  function initButtonTextAnimation() {
    document.querySelectorAll(
      '.btn-animation .btn-anim-text, .btn-animation .elementor-button-text'
    ).forEach(function (textElement) {
      if (textElement.dataset.animationReady === 'true') {
        return;
      }

      var originalText = textElement.textContent;

      if (!originalText.trim()) {
        return;
      }

      textElement.dataset.animationReady = 'true';

      textElement.setAttribute(
        'aria-label',
        originalText.trim()
      );

      textElement.textContent = '';

      Array.from(originalText.trim()).forEach(function (character, index) {
        var letter = document.createElement('span');

        letter.className = 'btn-letter';

        letter.style.setProperty('--i', index);

        letter.textContent =
          character === ' ' ? '\u00A0' : character;

        letter.setAttribute('aria-hidden', 'true');

        letter.dataset.letter =
          character === ' ' ? '\u00A0' : character;

        textElement.appendChild(letter);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initButtonTextAnimation
    );
  } else {
    initButtonTextAnimation();
  }

  // Support dynamically loaded / mutated buttons
  var btnObserver = new MutationObserver(function () {
    initButtonTextAnimation();
  });

  btnObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

})();

