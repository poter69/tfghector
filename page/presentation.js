            const slides = document.querySelectorAll('.slide');
            const prevButton = document.getElementById('prev-slide');
            const nextButton = document.getElementById('next-slide');
            const dotsContainer = document.getElementById('dots-container');
            const navMenuLinks = document.querySelectorAll('.nav-menu-link');
            const slideshowContainer = document.getElementById('slideshow-container');
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle.querySelector('i');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            let currentSlide = 0;
            let scrollTimeout;
            let isScrollNavigationActive = true; 

            // Mobile menu toggle
            mobileMenuButton.addEventListener('click', () => {
                const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
                mobileMenuButton.setAttribute('aria-expanded', !expanded);
                mobileMenu.classList.toggle('hidden');
                mobileMenuButton.querySelectorAll('i').forEach(icon => icon.classList.toggle('hidden'));
            });


            function applyTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('tfg-theme', theme); 
                if (theme === 'light') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }

            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
            });

            const savedTheme = localStorage.getItem('tfg-theme');
            if (savedTheme) {
                applyTheme(savedTheme);
            } else {
                applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            }
             window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('tfg-theme')) { 
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });


            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            const dots = document.querySelectorAll('.dot');

            function updateSlides() {
                slides.forEach((slide, index) => {
                    const isActive = index === currentSlide;
                    slide.classList.toggle('active', isActive);

                    if (isActive && slide.id === 'comparativa') {
                        setTimeout(() => { 
                            const bars = slide.querySelectorAll('.bar');
                            bars.forEach(bar => {
                                const targetHeight = bar.dataset.value + '%';
                                if (bar.offsetParent !== null) { 
                                    bar.style.height = '0%'; 
                                    bar.offsetHeight; 
                                    requestAnimationFrame(() => { 
                                        bar.style.height = targetHeight;
                                    });
                                }
                            });
                        }, 50); 
                    } else if (slide.id === 'comparativa') {
                       const bars = slide.querySelectorAll('.bar');
                       bars.forEach(bar => {
                           bar.style.height = '0%';
                       });
                    }
                });
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
                
                navMenuLinks.forEach(link => {
                    if (link.dataset.slide) {
                        link.classList.toggle('active-nav-link', parseInt(link.dataset.slide) === currentSlide);
                    }
                });
            }

            function goToSlide(slideIndex) {
                isScrollNavigationActive = false;
                currentSlide = slideIndex;
                if (currentSlide < 0) currentSlide = slides.length - 1;
                if (currentSlide >= slides.length) currentSlide = 0;
                updateSlides();
                setTimeout(() => {
                    isScrollNavigationActive = true;
                }, 900); 
            }

            prevButton.addEventListener('click', () => goToSlide(currentSlide - 1));
            nextButton.addEventListener('click', () => goToSlide(currentSlide + 1));
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
                else if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
            });

            navMenuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (link.dataset.slide) {
                        e.preventDefault();
                        goToSlide(parseInt(link.dataset.slide));
                         if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                            mobileMenuButton.setAttribute('aria-expanded', 'false');
                            mobileMenuButton.querySelector('.fa-bars').classList.remove('hidden');
                            mobileMenuButton.querySelector('.fa-times').classList.add('hidden');
                        }
                    }
                });
            });

            slideshowContainer.addEventListener('wheel', (e) => {
                if (!isScrollNavigationActive) return; 
                e.preventDefault(); 
                
                isScrollNavigationActive = false; 
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (e.deltaY < 0) {
                        goToSlide(currentSlide - 1);
                    } else if (e.deltaY > 0) {
                        goToSlide(currentSlide + 1);
                    }
                     setTimeout(() => { isScrollNavigationActive = true; }, 100);


                }, 50); 
            }, { passive: false });
            
            updateSlides(); 
        });
