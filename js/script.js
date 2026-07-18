(function () {
    'use strict';

    // ===========================
    // DOM Elements
    // ===========================
    const header = document.getElementById('header');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const scrollTopBtn = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('section[id]');

    // ===========================
    // Mobile Navigation
    // ===========================
    burger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('active');
        burger.classList.toggle('active');
        burger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('active');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // ===========================
    // Active Nav Link on Scroll
    // ===========================
    function updateActiveLink() {
        var scrollY = window.scrollY + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===========================
    // Scroll-to-Top Button
    // ===========================
    function updateScrollTopBtn() {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===========================
    // Scroll Animations (Intersection Observer)
    // ===========================
    var fadeEls = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        var fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(function (el) {
            fadeObserver.observe(el);
        });
    } else {
        fadeEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ===========================
    // Service Card Accordions
    // ===========================
    var serviceBtns = document.querySelectorAll('.service-card__btn');
    serviceBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute('data-target');
            var details = document.getElementById(targetId);
            if (!details) return;

            var isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Close all other details
            serviceBtns.forEach(function (otherBtn) {
                if (otherBtn !== btn) {
                    var otherId = otherBtn.getAttribute('data-target');
                    var otherDetails = document.getElementById(otherId);
                    if (otherDetails) {
                        otherDetails.hidden = true;
                        otherBtn.setAttribute('aria-expanded', 'false');
                        otherBtn.textContent = 'Узнать больше';
                    }
                }
            });

            if (isExpanded) {
                details.hidden = true;
                btn.setAttribute('aria-expanded', 'false');
                btn.textContent = 'Узнать больше';
            } else {
                details.hidden = false;
                btn.setAttribute('aria-expanded', 'true');
                btn.textContent = 'Свернуть';
            }
        });
    });

    // ===========================
    // Reviews Carousel
    // ===========================
    var track = document.querySelector('.reviews__track');
    var cards = document.querySelectorAll('.review-card');
    var prevBtn = document.querySelector('.reviews__btn--prev');
    var nextBtn = document.querySelector('.reviews__btn--next');
    var dotsContainer = document.getElementById('reviewsDots');
    var currentSlide = 0;
    var totalSlides = cards.length;
    var autoplayInterval;

    // Create dots
    for (var i = 0; i < totalSlides; i++) {
        var dot = document.createElement('button');
        dot.classList.add('reviews__dot');
        dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', (function (index) {
            return function () {
                goToSlide(index);
            };
        })(i));
        dotsContainer.appendChild(dot);
    }

    var dots = document.querySelectorAll('.reviews__dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        dots.forEach(function (d, j) {
            d.classList.toggle('active', j === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function () {
            prevSlide();
            resetAutoplay();
        });
        nextBtn.addEventListener('click', function () {
            nextSlide();
            resetAutoplay();
        });
    }

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // Touch/Swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        }, { passive: true });
    }

    // ===========================
    // FAQ Accordion
    // ===========================
    var faqQuestions = document.querySelectorAll('.faq__question');
    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            var answer = question.nextElementSibling;
            var isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other FAQ items
            faqQuestions.forEach(function (q) {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.hidden = true;
                }
            });

            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.hidden = true;
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
            }
        });
    });

    // ===========================
    // Subscribe Form
    // ===========================
    var form = document.getElementById('subscribeForm');
    var emailInput = document.getElementById('emailInput');
    var privacyCheck = document.getElementById('privacyCheck');
    var subscribeBtn = document.getElementById('subscribeBtn');
    var subscribeError = document.getElementById('subscribeError');
    var subscribeSuccess = document.getElementById('subscribeSuccess');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function checkFormValidity() {
        var emailValid = validateEmail(emailInput.value.trim());
        var privacyValid = privacyCheck.checked;
        subscribeBtn.disabled = !(emailValid && privacyValid);

        if (emailInput.value && !emailValid) {
            emailInput.classList.add('error');
            subscribeError.textContent = 'Введите корректный email';
        } else {
            emailInput.classList.remove('error');
            subscribeError.textContent = '';
        }
    }

    emailInput.addEventListener('input', checkFormValidity);
    privacyCheck.addEventListener('change', checkFormValidity);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (subscribeBtn.disabled) return;

        form.hidden = true;
        subscribeSuccess.hidden = false;
    });

    // ===========================
    // Scroll Events (throttled)
    // ===========================
    var scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                updateActiveLink();
                updateScrollTopBtn();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Initial calls
    updateActiveLink();
    updateScrollTopBtn();

})();