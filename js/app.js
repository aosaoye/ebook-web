/**
 * Modern Minimalist Ebook Landing Page
 * Pure Vanilla JavaScript: Smooth Transitions, Scrollspy, Animations, Interactions
 */

const API_URL = "https://n8q456xvr5.execute-api.us-east-1.amazonaws.com/dev/contact"

document.addEventListener('DOMContentLoaded', () => {

  const _form = document.querySelector('.ebook-download-form');

  if(!_form) return;

  _form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById("ebook-form-name").value;
    const email = document.getElementById("ebook-form-email").value;
    const payload = {name, email}
    console.log("Sending payload", payload)

    try {
      const response = fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const result = await response;

      if(!(await response).ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }


      alert(result.message)

      _form.reset();

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  } )


  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Smooth Scrolling for Anchor Links & Mobile Menu Auto-close
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navbarCollapse = document.getElementById('navbarNav');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile navbar if open
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          } else {
            navbarCollapse.classList.remove('show');
          }
        }
      }
    });
  });

  // 3. Scrollspy for Active Navigation Link
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.navbar-nav .nav-link');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 5. Interactive Chapter Preview Tabs
  const chapterBtns = document.querySelectorAll('.chapter-nav-btn');
  const chapterPanes = document.querySelectorAll('.chapter-pane');

  chapterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPaneId = btn.getAttribute('data-chapter-target');

      chapterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      chapterPanes.forEach(pane => {
        if (pane.id === targetPaneId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // 6. Format Selector Pills (PDF / ePub / MOBI)
  const formatPills = document.querySelectorAll('.format-pill');
  formatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      formatPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // 7. Download Form Submission with Smooth Toast & Loading Feedback
  const form = document.querySelector('.ebook-download-form');
  const toast = document.getElementById('toastFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const nameInput = form.querySelector('input[name="ebook-form-name"]');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Procesando descarga...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <i class="bi bi-check-circle-fill me-2 text-white"></i>
          ¡Descarga lista!
        `;

        // Show toast
        if (toast) {
          const userName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Lector';
          toast.querySelector('.toast-msg').textContent = `¡Gracias ${userName}! Revisa tu correo con el enlace de descarga.`;
          toast.classList.add('show');

          setTimeout(() => {
            toast.classList.remove('show');
            submitBtn.innerHTML = originalText;
            form.reset();
          }, 4500);
        }
      }, 1000);
    });
  }

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
