
// ===================================
// PRINT ADDRESS - MAIN JAVASCRIPT
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const pageLang = document.documentElement.lang || 'ar';
    const messages = pageLang.startsWith('en') ? {
        sending: 'Sending...',
        sent: 'Your message has been sent successfully! We will contact you soon.',
        error: 'An error occurred while sending. Please try again.',
        subscribed: (email) => `Thank you for subscribing! Email registered: ${email}`
    } : {
        sending: 'جاري الإرسال...',
        sent: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
        error: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.',
        subscribed: (email) => `شكراً لاشتراكك! تم تسجيل البريد: ${email}`
    };
    
    // === LOADER ===
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1500);
        });
    }
    
    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // === MOBILE MENU ===
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Dropdown toggle for mobile
        const hasDropdowns = navMenu.querySelectorAll('.has-dropdown');
        hasDropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.classList.toggle('active');
                }
            });
        });
    }
    
    // === SMOOTH SCROLL ===
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Clean section hashes from URLs after direct links such as index.html#portfolio.
    if (window.location.hash.length > 1) {
        const hashTarget = document.querySelector(window.location.hash);
        if (hashTarget) {
            setTimeout(() => {
                window.scrollTo({
                    top: hashTarget.offsetTop - 80,
                    behavior: 'auto'
                });
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }, 100);
        }
    }
    
    // === ACTIVE NAV LINK ===
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // === AOS ANIMATION ===
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }
    
    // === COUNTER ANIMATION ===
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // === PORTFOLIO FILTER ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // === PORTFOLIO GALLERY ===
    const galleryItems = document.querySelectorAll('.portfolio-item');

    if (galleryItems.length) {
        const galleryLabels = pageLang.startsWith('en') ? {
            close: 'Close gallery',
            previous: 'Previous image',
            next: 'Next image',
            openImage: 'Open image',
            counter: (current, total) => `${current} / ${total}`,
            fallbackTitle: 'Project Gallery'
        } : {
            close: '\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0645\u0639\u0631\u0636',
            previous: '\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629',
            next: '\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629',
            openImage: '\u0641\u062a\u062d \u0627\u0644\u0635\u0648\u0631\u0629',
            counter: (current, total) => `${current} / ${total}`,
            fallbackTitle: '\u0645\u0639\u0631\u0636 \u0627\u0644\u0645\u0634\u0631\u0648\u0639'
        };

        const modal = document.createElement('div');
        modal.className = 'portfolio-gallery-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="gallery-backdrop" data-gallery-close></div>
            <div class="gallery-dialog" role="dialog" aria-modal="true" aria-labelledby="galleryTitle">
                <button class="gallery-close" type="button" data-gallery-close aria-label="${galleryLabels.close}">
                    <i class="fas fa-times"></i>
                </button>
                <div class="gallery-header">
                    <span class="gallery-category"></span>
                    <h3 id="galleryTitle"></h3>
                    <p class="gallery-desc"></p>
                </div>
                <div class="gallery-viewer">
                    <button class="gallery-nav gallery-prev" type="button" aria-label="${galleryLabels.previous}">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <a class="gallery-main-link" href="#" target="_blank" rel="noopener" aria-label="${galleryLabels.openImage}">
                        <img class="gallery-main-img" src="" alt="">
                    </a>
                    <button class="gallery-nav gallery-next" type="button" aria-label="${galleryLabels.next}">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="gallery-footer">
                    <div class="gallery-thumbs"></div>
                    <span class="gallery-counter"></span>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const titleEl = modal.querySelector('#galleryTitle');
        const categoryEl = modal.querySelector('.gallery-category');
        const descEl = modal.querySelector('.gallery-desc');
        const mainLink = modal.querySelector('.gallery-main-link');
        const mainImg = modal.querySelector('.gallery-main-img');
        const thumbsEl = modal.querySelector('.gallery-thumbs');
        const counterEl = modal.querySelector('.gallery-counter');
        const prevBtn = modal.querySelector('.gallery-prev');
        const nextBtn = modal.querySelector('.gallery-next');
        let activeImages = [];
        let activeTitle = '';
        let activeIndex = 0;

        function readGalleryData(item) {
            const coverImg = item.querySelector('.portfolio-img img');
            const title = item.querySelector('.overlay-content h4')?.textContent.trim() || galleryLabels.fallbackTitle;
            const category = item.querySelector('.overlay-category')?.textContent.trim() || '';
            const desc = item.querySelector('.overlay-content p')?.textContent.trim() || '';
            const imageList = item.dataset.galleryImages
                ? item.dataset.galleryImages.split(',').map(src => src.trim()).filter(Boolean)
                : [];
            const pattern = item.dataset.galleryPattern;
            const count = parseInt(item.dataset.galleryCount || '0', 10);
            const pad = parseInt(item.dataset.galleryPad || '3', 10);
            const linkList = item.dataset.galleryLinks
                ? item.dataset.galleryLinks.split(',').map(src => src.trim())
                : [];

            if (pattern && count > 0) {
                for (let i = 1; i <= count; i++) {
                    imageList.push(pattern.replace('{n}', String(i).padStart(pad, '0')));
                }
            }

            if (!imageList.length && coverImg) {
                imageList.push(coverImg.getAttribute('src'));
            }

            return {
                title,
                category,
                desc,
                images: imageList.map((src, index) => ({
                    src,
                    href: linkList[index] || src,
                    alt: index === 0 && coverImg ? coverImg.getAttribute('alt') || title : title
                }))
            };
        }

        function renderGalleryImage(index) {
            activeIndex = (index + activeImages.length) % activeImages.length;
            const image = activeImages[activeIndex];
            mainImg.src = image.src;
            mainImg.alt = image.alt || activeTitle;
            mainLink.href = image.href || image.src;
            counterEl.textContent = galleryLabels.counter(activeIndex + 1, activeImages.length);
            prevBtn.hidden = activeImages.length < 2;
            nextBtn.hidden = activeImages.length < 2;

            thumbsEl.querySelectorAll('button').forEach((button, buttonIndex) => {
                button.classList.toggle('active', buttonIndex === activeIndex);
                button.setAttribute('aria-current', buttonIndex === activeIndex ? 'true' : 'false');
            });
        }

        function openGallery(item) {
            const gallery = readGalleryData(item);
            if (!gallery.images.length) return;

            activeImages = gallery.images;
            activeTitle = gallery.title;
            titleEl.textContent = gallery.title;
            categoryEl.textContent = gallery.category;
            descEl.textContent = gallery.desc;
            thumbsEl.innerHTML = '';

            gallery.images.forEach((image, index) => {
                const thumb = document.createElement('button');
                thumb.type = 'button';
                thumb.className = 'gallery-thumb';
                const thumbImg = document.createElement('img');
                thumbImg.src = image.src;
                thumbImg.alt = image.alt || gallery.title;
                thumb.appendChild(thumbImg);
                thumb.addEventListener('click', () => renderGalleryImage(index));
                thumbsEl.appendChild(thumb);
            });

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('gallery-open');
            renderGalleryImage(0);
            modal.querySelector('.gallery-close').focus();
        }

        function closeGallery() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('gallery-open');
            mainImg.removeAttribute('src');
            mainLink.setAttribute('href', '#');
        }

        galleryItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.addEventListener('click', (e) => {
                e.preventDefault();
                if (item.dataset.projectUrl) {
                    window.location.href = item.dataset.projectUrl;
                    return;
                }
                openGallery(item);
            });
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (item.dataset.projectUrl) {
                        window.location.href = item.dataset.projectUrl;
                        return;
                    }
                    openGallery(item);
                }
            });
        });

        modal.querySelectorAll('[data-gallery-close]').forEach(closeBtn => {
            closeBtn.addEventListener('click', closeGallery);
        });
        prevBtn.addEventListener('click', () => renderGalleryImage(activeIndex - 1));
        nextBtn.addEventListener('click', () => renderGalleryImage(activeIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') renderGalleryImage(activeIndex - 1);
            if (e.key === 'ArrowRight') renderGalleryImage(activeIndex + 1);
        });
    }
    
    // === CONTACT FORM ===
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('span');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            const originalText = btnText.textContent;
            
            // Show loading state
            btnText.textContent = messages.sending;
            btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            try {
                // Here you would normally send to a server
                // For now, we'll simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                alert(messages.sent);
                this.reset();
                
            } catch (error) {
                console.error('Error:', error);
                alert(messages.error);
            } finally {
                // Reset button state
                btnText.textContent = originalText;
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
            
            // Optional: Integrate with Formspree or similar service
            /*
            try {
                const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert(messages.sent);
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                alert(messages.error);
            }
            */
        });
    }
    
    // === NEWSLETTER FORM ===
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(messages.subscribed(email));
            this.reset();
        });
    }
    
    // === SCROLL TO TOP ===
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // === PARALLAX EFFECT ===
    const parallaxElements = document.querySelectorAll('.gradient-orb, .decorative-circle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // === LAZY LOADING IMAGES ===
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (!('loading' in HTMLImageElement.prototype)) {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // === ADD ANIMATION ON SCROLL ===
    const animateOnScroll = document.querySelectorAll('.service-card, .value-card, .portfolio-item');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateOnScroll.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
    
    // === MAGNETIC BUTTONS ===
    const magneticBtns = document.querySelectorAll('.btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
    
    // === TYPING EFFECT FOR HERO (Optional) ===
    // You can add a typing effect here if desired
    
    // === PERFORMANCE: Remove animations on low-end devices ===
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
    }
    
    // === CONSOLE MESSAGE ===
    console.log('%c🎨 Print Address Website', 'color: #64C7CC; font-size: 20px; font-weight: bold;');
    console.log('%cDesigned with ❤️ for excellence', 'color: #666; font-size: 12px;');
    
});

// === PAGE HIDE/SHOW FOR PERFORMANCE ===
let isPageVisible = true;

document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    
    if (isPageVisible) {
        // Page is visible - resume animations if needed
    } else {
        // Page is hidden - pause heavy animations if needed
    }
});

// === ERROR HANDLING ===
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
