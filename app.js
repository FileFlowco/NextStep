document.addEventListener("DOMContentLoaded", () => {

  /* ================================
     SPLIT REVEAL ANIMATIONS (APPLE STYLE)
  ================================= */

  const revealElements = document.querySelectorAll(".fade");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 120}ms`;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -80px 0px"
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ================================
     NAV BAR BLUR
  ================================= */

  const nav = document.querySelector(".nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }
  });

  /* ================================
     PINNED HERO + PREMIUM PARALLAX
  ================================= */

  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image");

  function updateHero() {
    if (!hero || !heroImage) return;

    const rect = hero.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.bottom < 0 || rect.top > windowHeight) return;

    const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
    const clamped = Math.min(Math.max(progress, 0), 1);

    const translateY = (clamped - 0.5) * -80;
    const scale = 1 + clamped * 0.05;
    const opacity = 0.9 + clamped * 0.1;

    heroImage.style.transform = `translateY(${translateY}px) scale(${scale})`;
    heroImage.style.opacity = opacity;
  }

  window.addEventListener("scroll", () => {
    requestAnimationFrame(updateHero);
  });

  updateHero();

  /* ================================
     CINEMATIC VIDEO SCALE (APPLE STYLE)
  ================================= */

  const productVideo = document.querySelector(".product-video");

  function updateVideo() {
    if (!productVideo) return;

    const rect = productVideo.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const progress = 1 - rect.top / windowHeight;
      const scale = 1 + Math.min(progress * 0.06, 0.06);

      productVideo.style.transform = `scale(${scale})`;
    }
  }

  window.addEventListener("scroll", () => {
    requestAnimationFrame(updateVideo);
  });

  /* ================================
     FORCE MOBILE AUTOPLAY (PERFECT FIX)
  ================================= */

  if (productVideo) {

    // Required for iOS
    productVideo.muted = true;
    productVideo.playsInline = true;
    productVideo.setAttribute("webkit-playsinline", "true");

    const tryPlay = () => {
      const playPromise = productVideo.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    // Try immediately
    tryPlay();

    // Retry on first interaction (iOS requirement)
    const unlock = () => {
      tryPlay();
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      document.removeEventListener("scroll", unlock);
    };

    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("scroll", unlock, { once: true });
  }

});
