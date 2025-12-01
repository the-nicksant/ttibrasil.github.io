// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');

if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ===================================
// Header Scroll Effect
// ===================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" (for WhatsApp buttons)
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Intersection Observer for Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delay
            setTimeout(() => {
                entry.target.classList.add('animate');
            }, index * 100);

            // Unobserve after animation to prevent re-triggering
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    animateOnScroll.observe(card);
});

// Observe product categories
const productCategories = document.querySelectorAll('.product-category');
productCategories.forEach(category => {
    animateOnScroll.observe(category);
});

// Observe stats
const stats = document.querySelectorAll('.stat');
stats.forEach(stat => {
    animateOnScroll.observe(stat);
});

// ===================================
// Animate Section Titles
// ===================================
const sectionTitles = document.querySelectorAll('.section-title');
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';

            setTimeout(() => {
                entry.target.style.transition = 'all 0.8s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);

            titleObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

sectionTitles.forEach(title => {
    titleObserver.observe(title);
});

// ===================================
// Counter Animation for Stats
// ===================================
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format the number
        const value = Math.floor(current);
        if (element.textContent.includes('+')) {
            element.textContent = value + '+';
        } else {
            element.textContent = value;
        }
    }, 16);
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const text = statNumber.textContent;
                const hasPlus = text.includes('+');
                const number = parseInt(text.replace('+', ''));

                // Animate the counter
                animateCounter(statNumber, number, 1500);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

stats.forEach(stat => {
    statsObserver.observe(stat);
});

// ===================================
// Parallax Effect for Hero
// ===================================
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');

if (hero && heroImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        // Only apply parallax while hero is visible
        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ===================================
// Add Staggered Animation to Grid Items
// ===================================
const addStaggeredAnimation = (selector, delay = 100) => {
    const items = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Array.from(items).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'all 0.6s ease-out';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    items.forEach(item => observer.observe(item));
};

// Apply staggered animations
addStaggeredAnimation('.card-value', 150);
addStaggeredAnimation('.card-sector', 100);
addStaggeredAnimation('.card-differential', 150);

// ===================================
// Lazy Load Images
// ===================================
const images = document.querySelectorAll('img[src*="unsplash"]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease-in';

            img.onload = () => {
                img.style.opacity = '1';
            };

            // Force reload if already loaded
            if (img.complete) {
                img.style.opacity = '1';
            }

            imageObserver.unobserve(img);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

images.forEach(img => {
    imageObserver.observe(img);
});

// ===================================
// Add Hover Effect to Cards
// ===================================
const allCards = document.querySelectorAll('.card, .product-category');
allCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ===================================
// Scroll Progress Indicator (optional)
// ===================================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #0066CC, #0099FF)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease-out';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

// Uncomment to enable scroll progress indicator
// createScrollProgress();

// ===================================
// Form Validation (if needed in future)
// ===================================
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ===================================
// WhatsApp Button Handler
// ===================================
const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
whatsappButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Check if href is just "#" (placeholder)
        if (button.getAttribute('href') === '#') {
            e.preventDefault();
            // This will be updated when the client provides the WhatsApp number
            console.log('WhatsApp number needs to be configured');
            alert('Por favor, configure o número do WhatsApp no código.');
        }
    });
});

// ===================================
// Performance: Debounce Scroll Events
// ===================================
const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll handlers if needed
const debouncedScroll = debounce(() => {
    // Any additional scroll handlers can be placed here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');

    // Log to console
    console.log('TTI Brasil Landing Page loaded successfully');

    // Preload critical images
    const criticalImages = document.querySelectorAll('.hero-image');
    criticalImages.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
});

// ===================================
// Accessibility: Skip to Main Content
// ===================================
const createSkipLink = () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#valor';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #0066CC;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
};

// Uncomment to enable skip link for accessibility
// createSkipLink();

// ===================================
// Easter Egg: Console Message
// ===================================
console.log('%c TTI Brasil ', 'background: #0066CC; color: white; font-size: 20px; padding: 10px;');
console.log('%c Distribuição Autorizada de Componentes Eletrônicos ', 'font-size: 12px; color: #6B7280;');
