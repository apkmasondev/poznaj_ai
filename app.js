document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeSparks = 0;

    
    // 1. Obserwator do łagodnego pojawiania się przystanków na osi czasu
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
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
            
            // Particle trail (Ogon cząsteczek świetlnych wzdłuż linii)
            if (pathFill.dataset.lastFill !== undefined) {
                const last = parseFloat(pathFill.dataset.lastFill);
                const diff = fillPercentage - last;
                
                // Track active particles in outer scope
                const MAX_SPARKS = 30;

                if (diff > 0 && fillPercentage < 100 && activeSparks < MAX_SPARKS) {
                    const particleCount = Math.min(6, Math.ceil(diff * 1.5));
                    
                    for(let i=0; i<particleCount; i++) {
                        if (activeSparks >= MAX_SPARKS) break;
                        activeSparks++;
                        
                        const sparkle = document.createElement('div');
                        sparkle.className = 'particle-spark';
                        
                        // Pozycja wzdłuż nowo narysowanego fragmentu linii
                        const yPos = fillPercentage - (Math.random() * diff);
                        sparkle.style.top = `${yPos}%`;
                        
                        // Losowy rozmiar (od 2 do 6 pikseli)
                        const size = 2 + Math.random() * 4;
                        sparkle.style.width = `${size}px`;
                        sparkle.style.height = `${size}px`;
                        
                        // Zasięg rozrzutu - cząsteczki lecą w różne strony, także lekko do góry
                        const tx = (Math.random() - 0.5) * 120; 
                        const ty = (Math.random() - 0.5) * 100 + 30; 
                        sparkle.style.setProperty('--tx', `${tx}px`);
                        sparkle.style.setProperty('--ty', `${ty}px`);
                        
                        // Losowy czas życia by cząsteczki nie znikały równocześnie
                        const duration = 1200 + Math.random() * 1800;
                        sparkle.style.animationDuration = `${duration}ms`;
                        
                        pathFill.parentElement.appendChild(sparkle);
                        setTimeout(() => {
                            sparkle.remove();
                            activeSparks--;
                        }, duration);
                    }
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

        let isScrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!isScrollTicking) {
                window.requestAnimationFrame(() => {
                    updateTimeline();
                    isScrollTicking = false;
                });
                isScrollTicking = true;
            }
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

    // 4. Animowany efekt pisania w Hero (Typewriter) z synchronizacją Bloba
    const typeWriterEl = document.getElementById('hero-typewriter');
    const heroBlob = document.querySelector('.hero-blob-bg');
    
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
        
        const heroChatBubble = document.querySelector('.hero-chat-bubble');
        // Inicjalnie "myśli" przed startem
        if (heroChatBubble) heroChatBubble.classList.add('is-waiting');

        function type() {
            if (heroChatBubble) heroChatBubble.classList.remove('is-waiting');
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typeWriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Losowa szybkość z delikatnymi przerwami
            let baseSpeed = isDeleting ? 25 : 45;
            let typingSpeed = baseSpeed + (Math.random() * 30);
            
            // Synchronizacja Bloba z pisaniem
            if (heroBlob) {
                const progress = charIndex / currentPhrase.length;

                // Animacja oddychania powiązana z postępem pisania/usuwania (0.5 do 1.0)
                heroBlob.style.setProperty('--shrink-scale', 0.5 + (0.5 * progress));

                if (isDeleting) {
                    heroBlob.classList.add('is-deleting');
                } else {
                    heroBlob.classList.remove('is-deleting');
                }

                if (!isDeleting && charIndex > 0 && charIndex < currentPhrase.length) {
                    // Kiedy "myśli" i pisze
                    heroBlob.classList.add('is-thinking');
                    if (heroChatBubble) heroChatBubble.classList.add('is-typing');
                    
                    // Magiczny rozbłysk: losowa intensywność od 0 do 1.0 przy każdym uderzeniu klawisza!
                    heroBlob.style.setProperty('--flare-intensity', Math.random().toFixed(2));

                    // Symulacja zacięcia się przy pisaniu na klawiaturze 10% szans
                    if(Math.random() > 0.9) typingSpeed += 100;
                } else {
                    heroBlob.classList.remove('is-thinking');
                    if (heroChatBubble) heroChatBubble.classList.remove('is-typing');
                    heroBlob.style.setProperty('--flare-intensity', 0);
                }
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2500; // Pause at end of phrase
                isDeleting = true;
                if (heroBlob) heroBlob.classList.remove('is-thinking');
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 1500; // Dłuższa pauza żeby pokazać kropki "myślenia"
                if (heroChatBubble) heroChatBubble.classList.add('is-waiting');
                if (heroBlob) heroBlob.classList.remove('is-thinking');
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
            let isTiltTicking = false;
            card.addEventListener('mousemove', e => {
                if (!isTiltTicking) {
                    window.requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        
                        const rotateX = ((y - centerY) / centerY) * -10; 
                        const rotateY = ((x - centerX) / centerX) * 10;
                        
                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                        isTiltTicking = false;
                    });
                    isTiltTicking = true;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // 6. Przełącznik motywu (Dark/Light mode)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {

        themeToggle.addEventListener('click', () => {
            let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 7. Interaktywny slider promptów (Cross-Fade)
    const promptSliderInputs = document.querySelectorAll('.prompt-slider-input');
    promptSliderInputs.forEach(input => {
        const sliderContainer = input.closest('.prompt-fade-slider');
        const badPanel = sliderContainer.querySelector('.bad-panel');
        const goodPanel = sliderContainer.querySelector('.good-panel');
        
        const updateSlider = () => {
            if (sliderContainer) {
                const val = input.value;
                // Zmienna dla samego UI track/thumb
                sliderContainer.style.setProperty('--slider-val', val);
                
                // Modyfikacja widoczności paneli bezpośrednio (foolproof)
                if (badPanel) {
                    badPanel.style.opacity = 1 - (val / 100);
                    badPanel.style.transform = `translateX(${(val / 100) * -15}px)`;
                }
                if (goodPanel) {
                    goodPanel.style.opacity = val / 100;
                    goodPanel.style.transform = `translateX(${(1 - (val / 100)) * 15}px)`;
                }
            }
        };

        input.addEventListener('input', updateSlider);
        updateSlider(); // Inicjalizacja
    });

    // 8. Dynamiczny blask na okrągłych ilustracjach (Hover glow)
    if (!prefersReducedMotion) {
        const roundImages = document.querySelectorAll('.step-round-img');
        roundImages.forEach(img => {
            // Tworzymy kontener, który ułatwi nałożenie poświaty i animację 3D
            const container = document.createElement('div');
            container.className = 'img-interactive-container';
            
            // Wstawiamy kontener przed obrazkiem, a potem przenosimy obrazek do środka
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);
            
            // Tworzymy element poświaty
            const glow = document.createElement('div');
            glow.className = 'img-glow-overlay';
            container.appendChild(glow);

            // Nasłuchiwanie myszki (z rAF throttle)
            let isGlowTicking = false;
            container.addEventListener('mousemove', (e) => {
                if (!isGlowTicking) {
                    window.requestAnimationFrame(() => {
                        const rect = container.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        glow.style.setProperty('--img-mouse-x', `${x}px`);
                        glow.style.setProperty('--img-mouse-y', `${y}px`);
                        isGlowTicking = false;
                    });
                    isGlowTicking = true;
                }
            });
        });
    }

    // 9. Ciągłe iskrzenie Węzła Startowego (Magiczna Fontanna)
    if (!prefersReducedMotion) {
        const pathFillEl = document.querySelector('.story-line-fill');
        if (pathFillEl) {
            let fountainInterval = null;
            
            const spawnFountainSparks = () => {
                if (pathFillEl.dataset.lastFill && parseFloat(pathFillEl.dataset.lastFill) > 0) {
                    const MAX_SPARKS = 30;
                    
                    const particleCount = Math.random() > 0.5 ? 2 : 1;
                    for (let i = 0; i < particleCount; i++) {
                        if (activeSparks >= MAX_SPARKS) break;
                        activeSparks++;
                        
                        const sparkle = document.createElement('div');
                        sparkle.className = 'particle-spark';
                        
                        sparkle.style.top = `0%`;
                        const size = 3 + Math.random() * 5;
                        sparkle.style.width = `${size}px`;
                        sparkle.style.height = `${size}px`;
                        
                        const tx = (Math.random() - 0.5) * 160; 
                        const ty = Math.random() * 200 + 40; 
                        sparkle.style.setProperty('--tx', `${tx}px`);
                        sparkle.style.setProperty('--ty', `${ty}px`);
                        
                        const duration = 1200 + Math.random() * 1500;
                        sparkle.style.animationDuration = `${duration}ms`;
                        
                        pathFillEl.parentElement.appendChild(sparkle);
                        setTimeout(() => {
                            sparkle.remove();
                            activeSparks--;
                        }, duration);
                    }
                }
            };
            
            const startObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!fountainInterval) {
                            fountainInterval = setInterval(spawnFountainSparks, 300);
                        }
                    } else {
                        if (fountainInterval) {
                            clearInterval(fountainInterval);
                            fountainInterval = null;
                        }
                    }
                });
            }, { threshold: 0.1 });
            
            // Obserwujemy sam kontener żeby włączać fontannę jak góra jest widoczna
            const timelineContainer = document.querySelector('.story-line-wrapper');
            if (timelineContainer) startObserver.observe(timelineContainer);
        }
    }
});
