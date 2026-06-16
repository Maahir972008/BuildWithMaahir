 
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Animate progress bars on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.skill-progress-bar');
                    bars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => bar.style.width = width, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('#skills').forEach(section => observer.observe(section));

        // Dynamic copyright year
        document.getElementById('currentYear').innerText = new Date().getFullYear();

        // Back to Top rotating border
        const backBtn = document.getElementById('backToTop');
        function updateScrollProgress() {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 360;
            if (backBtn) {
                backBtn.style.setProperty('--scroll-angle', scrolled + 'deg');
            }
        }
        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress();
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Form submission toast
        const form = document.querySelector('.contact-form');
        const toast = document.getElementById('formToast');
        const toastMessageSpan = document.getElementById('toastMessage');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const nameInput = document.getElementById('clientName');
                const clientName = nameInput ? nameInput.value.trim() : '';
                const formData = new FormData(form);
                const submitBtn = form.querySelector('.submit-btn');
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
                submitBtn.disabled = true;
                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        const thankYouText = clientName 
                            ? `Thanks ${clientName}! We'll reach out soon.` 
                            : `Thanks! We'll reach out soon.`;
                        toastMessageSpan.innerText = thankYouText;
                        toast.classList.add('show');
                        form.reset();
                        setTimeout(() => toast.classList.remove('show'), 4000);
                    } else {
                        const errorToast = document.createElement('div');
                        errorToast.className = 'custom-toast';
                        errorToast.style.borderLeftColor = '#ff6b6b';
                        errorToast.style.background = 'rgba(40, 20, 25, 0.95)';
                        errorToast.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Something went wrong. Please try again.';
                        document.body.appendChild(errorToast);
                        setTimeout(() => errorToast.classList.add('show'), 10);
                        setTimeout(() => errorToast.classList.remove('show'), 4000);
                        setTimeout(() => errorToast.remove(), 5000);
                    }
                } catch (err) {
                    const errorToast = document.createElement('div');
                    errorToast.className = 'custom-toast';
                    errorToast.style.borderLeftColor = '#ff6b6b';
                    errorToast.style.background = 'rgba(40, 20, 25, 0.95)';
                    errorToast.innerHTML = '<i class="fas fa-wifi"></i> Network error. Check your connection.';
                    document.body.appendChild(errorToast);
                    setTimeout(() => errorToast.classList.add('show'), 10);
                    setTimeout(() => errorToast.classList.remove('show'), 4000);
                    setTimeout(() => errorToast.remove(), 5000);
                } finally {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }
            });
        }

        // ========== FAST, NON-STOP COLOR SHIFTING WORDS (SILVER ↔ GOLD) + GLITTER SPLASH ==========
        (function() {
            const canvas = document.getElementById('codeCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let width, height, columns, words, yPositions, speeds;
            let particles = [];
            
            const wordBank = [
                'const', 'let', 'function', 'return', 'if', 'else', 'for', 'while',
                'class', 'new', 'this', 'fetch', 'await', 'async', 'map', 'filter',
                'useState', 'useEffect', 'props', 'state', 'react', 'node', 'python',
                'docker', 'kubernetes', 'html', 'div', 'span', '&&', '||', '===',
                'true', 'false', 'null', 'import', 'export', 'default', 'try', 'catch',
                'express', 'mongoose', 'sql', 'nosql', 'git', 'commit', 'npm', 'yarn'
            ];
            
            function resizeCanvas() {
                const hero = document.querySelector('.hero');
                if (!hero) return;
                width = hero.clientWidth;
                height = hero.clientHeight;
                canvas.width = width;
                canvas.height = height;
                const fontSize = Math.max(22, Math.min(42, width / 26));
                canvas.style.fontSize = fontSize + 'px';
                columns = Math.floor(width / (fontSize * 1.3));
                yPositions = Array(columns).fill().map(() => Math.random() * -height);
                words = Array(columns).fill().map(() => wordBank[Math.floor(Math.random() * wordBank.length)]);
                speeds = Array(columns).fill().map(() => 0.7 + Math.random() * 0.6);
            }
            
            // Fast color oscillation: returns a color cycling between silver and gold
            let time = 0;
            function getFastColor(columnIndex) {
                const value = (Math.sin(time * 0.02 + columnIndex * 0.5) + 1) / 2;
                const silver = {r:192, g:192, b:192};
                const gold = {r:212, g:175, b:55};
                const r = Math.round(silver.r + (gold.r - silver.r) * value);
                const g = Math.round(silver.g + (gold.g - silver.g) * value);
                const b = Math.round(silver.b + (gold.b - silver.b) * value);
                return `rgb(${r}, ${g}, ${b})`;
            }
            
            function createGlitterBurst(x, y) {
                const count = 20;
                for (let i = 0; i < count; i++) {
                    particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 5,
                        vy: (Math.random() - 1) * 5 - 1,
                        life: 1.0,
                        size: 2 + Math.random() * 4,
                        color: `hsl(${45 + Math.random() * 25}, 100%, 65%)`
                    });
                }
                for (let i = 0; i < 12; i++) {
                    particles.push({
                        x: x + (Math.random() - 0.5) * 18,
                        y: y + (Math.random() - 0.5) * 18,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 1) * 3,
                        life: 0.7 + Math.random() * 0.5,
                        size: 1 + Math.random() * 2.5,
                        color: `hsl(${50 + Math.random() * 30}, 100%, 75%)`
                    });
                }
            }
            
            function draw() {
                if (!ctx) return;
                ctx.clearRect(0, 0, width, height);
                
                const fontSize = Math.max(22, Math.min(42, width / 26));
                ctx.font = `${fontSize}px "Fira Code", "Cascadia Code", monospace`;
                ctx.shadowBlur = 0;
                
                time++;
                
                for (let i = 0; i < columns; i++) {
                    const y = yPositions[i];
                    const word = words[i];
                    const x = i * (fontSize * 1.3);
                    
                    ctx.fillStyle = getFastColor(i);
                    ctx.fillText(word, x, y);
                    
                    yPositions[i] += speeds[i];
                    
                    if (yPositions[i] >= height - 8 && yPositions[i] - speeds[i] < height - 8) {
                        createGlitterBurst(x + fontSize * 0.5, height - 5);
                        yPositions[i] = -Math.random() * 80 - 20;
                        words[i] = wordBank[Math.floor(Math.random() * wordBank.length)];
                        speeds[i] = 0.7 + Math.random() * 0.6;
                    }
                }
                
                for (let i = particles.length-1; i >= 0; i--) {
                    const p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.12;
                    p.life -= 0.02;
                    if (p.life <= 0 || p.y > height + 60 || p.x < -60 || p.x > width + 60) {
                        particles.splice(i,1);
                        continue;
                    }
                    ctx.globalAlpha = p.life * 0.9;
                    ctx.fillStyle = p.color;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = '#ffcc44';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    if (p.size > 2.5 && p.life > 0.6) {
                        ctx.beginPath();
                        ctx.moveTo(p.x - p.size*0.8, p.y);
                        ctx.lineTo(p.x + p.size*0.8, p.y);
                        ctx.moveTo(p.x, p.y - p.size*0.8);
                        ctx.lineTo(p.x, p.y + p.size*0.8);
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = '#fff9c4';
                        ctx.stroke();
                    }
                }
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            }
            
            window.addEventListener('resize', () => { resizeCanvas(); });
            resizeCanvas();
            let interval = setInterval(draw, 50);
            
            const hero = document.querySelector('.hero');
            if (hero) {
                const heroObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!interval) interval = setInterval(draw, 50);
                        } else {
                            if (interval) { clearInterval(interval); interval = null; }
                        }
                    });
                }, { threshold: 0.1 });
                heroObserver.observe(hero);
            }
        })();

        // ========== HAMBURGER MENU TOGGLE ==========
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
            // Close menu when a link is clicked
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
            // Close menu if clicking outside (optional)
            document.addEventListener('click', (event) => {
                if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                    navLinks.classList.remove('active');
                }
            });
        }
    