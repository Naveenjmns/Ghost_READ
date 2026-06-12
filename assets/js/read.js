/**
 * READ Ghost Theme — Main JavaScript
 * Handles: preloader, scroll animations, mobile nav,
 *          progress bar, quote rotation, newsletter UX
 */

(function () {
    'use strict';

    /* ── Helpers ────────────────────────────────────────── */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ── Preloader ──────────────────────────────────────── */
    const preloader = $('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 600);
        });
        document.body.style.overflow = 'hidden';
    }

    /* ── Header Date ────────────────────────────────────── */
    const dateEl = $('#header-date-text');
    if (dateEl) {
        const now = new Date();
        const opts = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', opts);
    }

    /* ── Edition Volume ─────────────────────────────────── */
    const editionEl = $('#edition-vol');
    if (editionEl) {
        const year = new Date().getFullYear();
        const startYear = 2020;
        const vol = year - startYear + 1;
        editionEl.textContent = `Vol. ${vol}`;
    }

    /* ── Scroll Progress Bar ────────────────────────────── */
    const progressBar = $('#progress-bar');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${Math.min(100, progress)}%`;
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    /* ── Sticky Header Shadow ───────────────────────────── */
    const siteHeader = $('#site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ── Mobile Navigation ──────────────────────────────── */
    const navToggle = $('#nav-toggle');
    const mobileMenu = $('#mobile-menu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open', isOpen);
            mobileMenu.setAttribute('aria-hidden', String(!isOpen));
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close on mobile link click
        $$('a', mobileMenu).forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('is-open');
                mobileMenu.classList.remove('is-open');
                mobileMenu.setAttribute('aria-hidden', 'true');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ── Scroll Reveal Animations ───────────────────────── */
    const animatedEls = $$('[data-animate]');

    if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    let delay = 0;
                    if (el.dataset.delayIndex) {
                        const index = parseInt(el.dataset.delayIndex, 10) || 0;
                        const step = el.dataset.delayStep ? parseInt(el.dataset.delayStep, 10) : 80;
                        delay = index * step;
                    } else if (el.dataset.delay) {
                        delay = parseInt(el.dataset.delay, 10) || 0;
                    }
                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        animatedEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: just show them
        animatedEls.forEach(el => el.classList.add('is-visible'));
    }

    /* ── Rotating Quotes ────────────────────────────────── */
    const quotes = [
        {
            text: "To create a society where every person has the right to a good standard of living and human dignity.",
            author: "READ Core Vision"
        },
        {
            text: "Education is the most powerful weapon which you can use to change the world.",
            author: "Nelson Mandela"
        },
        {
            text: "Where the mind is without fear and the head is held high, where knowledge is free...",
            author: "Rabindranath Tagore"
        },
        {
            text: "Human dignity is the same for all human beings. When we respect others, we respect ourselves.",
            author: "READ Advocacy"
        },
        {
            text: "Empowering a woman is empowering a community, a society, and a nation.",
            author: "READ Focus"
        },
        {
            text: "The true measure of any society lies in how it treats its most vulnerable members.",
            author: "Mahatma Gandhi"
        }
    ];

    const quoteEl = $('#rotating-quote');
    const authorEl = $('.quote-author');

    if (quoteEl && authorEl && quotes.length > 0) {
        let currentIndex = 0;

        const cycleQuote = () => {
            quoteEl.style.opacity = '0';
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % quotes.length;
                quoteEl.textContent = quotes[currentIndex].text;
                authorEl.textContent = `— ${quotes[currentIndex].author}`;
                quoteEl.style.opacity = '1';
            }, 400);
        };

        quoteEl.style.transition = 'opacity 0.4s ease';
        setInterval(cycleQuote, 7000);
    }

    /* ── Copy Link Button ───────────────────────────────── */
    const copyBtn = $('#copy-link-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> <span>Copied!</span>`;
                copyBtn.style.color = 'var(--clr-gold)';
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.style.color = '';
                }, 2000);
            } catch {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = window.location.href;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
        });
    }

    /* ── Newsletter Form UX ─────────────────────────────── */
    const newsletterForms = $$('[data-members-form="subscribe"]');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                const btnText = btn.querySelector('.btn-text');
                if (btnText) {
                    btnText.textContent = 'Subscribing…';
                } else {
                    btn.textContent = 'Subscribing…';
                }
            }
        });

        // Ghost member subscription events
        form.addEventListener('ghost:success', () => {
            const successEl = form.querySelector('.newsletter-success');
            const formGroup = form.querySelector('.newsletter-form-group');
            const btn = form.querySelector('button[type="submit"]');
            const fineText = form.querySelector('.newsletter-fine');
            if (successEl) {
                if (formGroup) formGroup.style.display = 'none';
                if (btn) btn.style.display = 'none';
                if (fineText) fineText.style.display = 'none';
                successEl.style.display = 'flex';
            }
        });
    });

    /* ── Smooth scroll for anchor links ─────────────────── */
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = anchor.getAttribute('href');
            if (target === '#') return;
            const targetEl = document.querySelector(target);
            if (targetEl) {
                e.preventDefault();
                const headerH = siteHeader ? siteHeader.offsetHeight : 0;
                const targetY = targetEl.getBoundingClientRect().top + window.scrollY - headerH - 16;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
        });
    });

    /* ── Reading Progress for Post Pages ────────────────── */
    const postContent = $('.post-content');
    if (postContent && progressBar) {
        // Already handled by the global progress bar above — no extra needed
    }

    /* ── Active nav link highlighting ───────────────────── */
    const currentPath = window.location.pathname;
    $$('.nav-list li a, .mobile-nav-list li a').forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === currentPath || (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
            link.classList.add('nav-current');
        }
    });

    /* ── Lazy image loading polyfill ────────────────────── */
    $$('img[loading="lazy"]').forEach(img => {
        if ('loading' in HTMLImageElement.prototype) return;
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.src = e.target.dataset.src || e.target.src;
                        io.unobserve(e.target);
                    }
                });
            });
            io.observe(img);
        }
    });

    /* ── Theme Mood Switcher Logic ──────────────────────── */
    const moodSwitcher = $('#theme-mood-switcher');
    if (moodSwitcher) {
        const moodBtns = $$('.theme-mood-btn', moodSwitcher);
        
        const setMood = (mood) => {
            moodBtns.forEach(btn => {
                if (btn.dataset.preset === mood) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            if (mood === 'light-blue') {
                document.documentElement.removeAttribute('data-theme-mood');
            } else {
                document.documentElement.setAttribute('data-theme-mood', mood);
            }
            
            localStorage.setItem('ghost-theme-mood', mood);
        };
        
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                setMood(preset);
            });
        });
        
        const savedMood = localStorage.getItem('ghost-theme-mood') || 'light-blue';
        setMood(savedMood);
    }

    /* ── Stats Count-Up Animation ─────────────────────── */
    const counters = $$('.count-up');
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const countUp = (el) => {
            const target = parseInt(el.dataset.target, 10) || 0;
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (easeOutQuad)
                const easeProgress = progress * (2 - progress);
                
                const currentValue = Math.floor(easeProgress * target);
                el.textContent = currentValue.toLocaleString('en-US');

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    el.textContent = target.toLocaleString('en-US');
                }
            };

            requestAnimationFrame(updateCount);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        counters.forEach(counter => statsObserver.observe(counter));
    } else {
        // Fallback
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10) || 0;
            counter.textContent = target.toLocaleString('en-US');
        });
    }

})();
