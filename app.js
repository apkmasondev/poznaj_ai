document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Obserwator do łagodnego pojawiania się przystanków na osi czasu
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (prefersReducedMotion) {
                    entry.target.classList.add('is-active');
                }
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-step');
    
    if (!prefersReducedMotion) {
        hiddenElements.forEach(el => observer.observe(el));
    } else {
        hiddenElements.forEach(el => {
            el.classList.add('is-visible');
            el.classList.add('is-active');
        });
    }

    // 2. Obsługa rysowania przerywanej ścieżki na podstawie scrolla
    const storySection = document.querySelector('.story-container');
    const pathFill = document.querySelector('.story-line-fill');
    const steps = document.querySelectorAll('.story-step');

    if (storySection && pathFill && !prefersReducedMotion) {
        
        const updateTimeline = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            const rect = storySection.getBoundingClientRect();
            const sectionTop = scrollY + rect.top; 
            const viewportCenter = scrollY + (windowHeight / 2);
            
            let fillPercentage = ((viewportCenter - sectionTop) / rect.height) * 100;
            fillPercentage = Math.max(0, Math.min(100, fillPercentage));
            
            // Magiczne iskierki pojawiające się wzdłuż linii
            if (pathFill.dataset.lastFill !== undefined) {
                const last = parseFloat(pathFill.dataset.lastFill);
                if (fillPercentage > last && fillPercentage < 100 && Math.random() > 0.4) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.top = `${fillPercentage}%`;
                    sparkle.style.left = '0px'; // Centrujemy na linii (jest width 100% z 6px kontenera)
                    
                    const tx = (Math.random() - 0.5) * 80; 
                    const ty = (Math.random() - 0.5) * 80 + 20; // Lekko w dół
                    sparkle.style.setProperty('--tx', `${tx}px`);
                    sparkle.style.setProperty('--ty', `${ty}px`);
                    
                    pathFill.parentElement.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 1500);
                }
            }
            pathFill.dataset.lastFill = fillPercentage;

            pathFill.style.height = `${fillPercentage}%`;

            steps.forEach(step => {
                const marker = step.querySelector('.step-marker');
                if(!marker) return;
                
                const markerRect = marker.getBoundingClientRect();
                const markerCenter = scrollY + markerRect.top + (markerRect.height / 2);
                
                if (viewportCenter > markerCenter - 30) {
                    step.classList.add('is-active');
                } else {
                    step.classList.remove('is-active');
                }
            });
        };

        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateTimeline);
        }, { passive: true });
        
        updateTimeline();
    } else if (prefersReducedMotion && pathFill) {
        pathFill.style.height = '100%';
    }

    // 3. Śledzenie myszki (Mouse Spotlight & Parallax dla plam świetlnych)
    if (!prefersReducedMotion) {
        const blobs = document.querySelectorAll('.blob');
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;

        const mouseSpotlight = document.querySelector('.mouse-spotlight');
        const blobMouse = document.querySelector('.blob-mouse');

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isMoving) {
                window.requestAnimationFrame(() => {
                    // Optymalizacja: aktualizujemy zmienne tylko na docelowych elementach, 
                    // unikając style recalculation na całym :root
                    if (mouseSpotlight) {
                        mouseSpotlight.style.setProperty('--mouse-x', `${mouseX}px`);
                        mouseSpotlight.style.setProperty('--mouse-y', `${mouseY}px`);
                    }
                    if (blobMouse) {
                        blobMouse.style.setProperty('--mouse-x', `${mouseX}px`);
                        blobMouse.style.setProperty('--mouse-y', `${mouseY}px`);
                    }

                    // Parallax dla dryfujących plam tła (blobs)
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
                    const percentX = (mouseX / windowWidth) - 0.5; // Zakres od -0.5 do 0.5
                    const percentY = (mouseY / windowHeight) - 0.5;

                    blobs.forEach((blob, idx) => {
                        // Każda kolejna plama reaguje z różną siłą dla efektu głębi
                        const depthMultiplier = (idx + 1) * 20; 
                        blob.style.translate = `${percentX * depthMultiplier}px ${percentY * depthMultiplier}px`;
                    });

                    isMoving = false;
                });
                isMoving = true;
            }
        });
    }

    // 4. Animowany efekt pisania w Hero (Typewriter)
    const typeWriterEl = document.getElementById('hero-typewriter');
    if (typeWriterEl && !prefersReducedMotion) {
        const phrases = [
            "W czym mogę pomóc?",
            "Formuła do Excela?",
            "Napiszmy tego maila.",
            "Co dzisiaj na obiad?"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typeWriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 30 : 60;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2500; // Pause at end of phrase
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next phrase
            }
            
            setTimeout(type, typingSpeed);
        }
        
        setTimeout(type, 1500); // Start delay
    } else if (typeWriterEl && prefersReducedMotion) {
        typeWriterEl.textContent = "W czym mogę Ci dzisiaj pomóc?";
    }

    // 5. 3D Tilt na kartach CTA
    if (!prefersReducedMotion) {
        const tiltCards = document.querySelectorAll('.cta-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Obliczanie rotacji (max 10 stopni w każdym kierunku)
                const rotateX = ((y - centerY) / centerY) * -10; 
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none'; // Wyłączamy transition podczas ruchu
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                // Przywracamy transition przy opuszczaniu
                card.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease'; // Krótka animacja przy wejściu kursora
            });
        });
    }

    // 6. Przełącznik motywu (Dark/Light mode)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Przywróć zapisany motyw
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        themeToggle.addEventListener('click', () => {
            let currentTheme = document.documentElement.getAttribute('data-theme');
            if (!currentTheme) {
                currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});
