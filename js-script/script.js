// ==========================================
// SEARCH BAR TOGGLE & OUTSIDE CLICK
// ==========================================
function toggleSearch() {
    document.getElementById("searchBar").classList.toggle("active");
}

document.addEventListener("click", function(event) {
    const search = document.querySelector(".search-container");
    const dropdown = document.getElementById("searchBar");

    if (search && dropdown && !search.contains(event.target)) {
        dropdown.classList.remove("active");
    }
});

// ==========================================
// VIDEO BACKGROUND CONTROL (IntersectionObserver)
// ==========================================
const video = document.getElementById("myVideo");

if (video) {
    video.muted = true;
    
    video.play().catch(error => {
        console.log("Autoplay was prevented by browser policy:", error);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(e => console.log(e));
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(video);
}

// ==========================================
// NAVBAR DROPDOWNS (Products & Support)
// ==========================================
const dropdown1 = document.querySelector(".dropdown1");
const dropdown2 = document.querySelector(".dropdown2");
const dropdownHome = document.getElementById("dropdownHome");
const dropdownSupport = document.getElementById("dropdownSupport");

let hideTimeout;

function closeAllDropdowns() {
    if (dropdownHome) dropdownHome.classList.remove("open");
    if (dropdownSupport) dropdownSupport.classList.remove("open");
}

function cancelHide() {
    clearTimeout(hideTimeout);
}

function scheduleHide() {
    hideTimeout = setTimeout(() => {
        closeAllDropdowns();
    }, 150);
}

if (dropdown1 && dropdownHome) {
    dropdown1.addEventListener("mouseenter", () => {
        cancelHide();
        if (dropdownSupport) dropdownSupport.classList.remove("open");
        dropdownHome.classList.add("open");
    });
    dropdown1.addEventListener("mouseleave", scheduleHide);

    dropdownHome.addEventListener("mouseenter", cancelHide);
    dropdownHome.addEventListener("mouseleave", scheduleHide);
}

if (dropdown2 && dropdownSupport) {
    dropdown2.addEventListener("mouseenter", () => {
        cancelHide();
        if (dropdownHome) dropdownHome.classList.remove("open");
        dropdownSupport.classList.add("open");
    });
    dropdown2.addEventListener("mouseleave", scheduleHide);

    dropdownSupport.addEventListener("mouseenter", cancelHide);
    dropdownSupport.addEventListener("mouseleave", scheduleHide);
}

// Automatically close dropdown menus when scrolling
window.addEventListener("scroll", closeAllDropdowns);

// ==========================================
// CART DROPDOWN MENU TOGGLE & OUTSIDE CLICK
// ==========================================
function toggleCart() {
    const cartDropdown = document.getElementById("cartDropdown");
    if (cartDropdown) {
        cartDropdown.classList.toggle("active");
    }
}

// Close the cart dropdown when clicking outside of the cart container
document.addEventListener("click", function(event) {
    const cartContainer = document.querySelector(".cart-container");
    const cartDropdown = document.getElementById("cartDropdown");

    if (cartContainer && cartDropdown && !cartContainer.contains(event.target)) {
        cartDropdown.classList.remove("active");
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('.carousel-viewport');
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!viewport || !track || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let hasDragged = false;

  // Build pagination dots safely
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

  function getGap() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.gap || style.columnGap || 16) || 16;
  }

  function getBaseTranslate() {
    const viewportWidth = viewport.getBoundingClientRect().width;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = getGap();
    const centerOffset = (viewportWidth - slideWidth) / 2;
    return centerOffset - currentIndex * (slideWidth + gap);
  }

  function applyTranslate(value, instant = false) {
    if (instant) {
      track.style.transition = 'none';
    } else {
      track.style.transition = '';
    }
    track.style.transform = `translate3d(${value}px, 0, 0)`;
  }

  function updateCarousel(instant = false) {
    prevTranslate = getBaseTranslate();
    currentTranslate = prevTranslate;
    applyTranslate(currentTranslate, instant);

    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4500);
  }

  function goToSlide(index) {
    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    updateCarousel(false);
    resetAutoPlay();
  }

  // Pointer drag / swipe support
  track.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target.closest('button, a')) return;

    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    prevTranslate = getBaseTranslate();
    currentTranslate = prevTranslate;
    track.classList.add('dragging');
    clearInterval(autoPlayTimer);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 6) hasDragged = true;
    currentTranslate = prevTranslate + diff;
    applyTranslate(currentTranslate, true);
  });

  function finishDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');

    const movedBy = e.clientX - startX;
    const swipeThreshold = 60;

    if (movedBy < -swipeThreshold) {
      goToSlide(currentIndex + 1);
    } else if (movedBy > swipeThreshold) {
      goToSlide(currentIndex - 1);
    } else {
      updateCarousel(false);
      resetAutoPlay();
    }
  }

  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);

  // Clicking a non-active peeking slide centers it
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (!hasDragged && i !== currentIndex) {
        goToSlide(i);
      }
    });
  });

  window.addEventListener('resize', () => updateCarousel(true));
  window.addEventListener('load', () => updateCarousel(true));

  updateCarousel(true);
  resetAutoPlay();
});