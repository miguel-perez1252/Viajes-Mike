// Viajes Mike - Interactive Client Logic

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCountdown();
    initInteractiveMap();
    initChatbot();
    initContactForm();
    initMouseAirplane();
});

/* ==========================================
   NAVBAR & SCROLL HANDLING
   ========================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        const sections = document.querySelectorAll('header, section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================
   MOBILE MENU TOGGLE
   ========================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }
}

/* ==========================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once visible to improve performance
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // Viewport
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* ==========================================
   PROMOTIONS COUNTDOWN TIMER
   ========================================== */
function initCountdown() {
    // Set promo end date: June 15, 2026 at midnight (local time)
    const countDate = new Date('June 15, 2026 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const gap = countDate - now;

        // Time calculations
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        // Display update
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl && hoursEl && minutesEl && secondsEl) {
            if (gap <= 0) {
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minutesEl.innerText = "00";
                secondsEl.innerText = "00";
                return;
            }

            daysEl.innerText = d < 10 ? '0' + d : d;
            hoursEl.innerText = h < 10 ? '0' + h : h;
            minutesEl.innerText = m < 10 ? '0' + m : m;
            secondsEl.innerText = s < 10 ? '0' + s : s;
        }
    }

    // Run every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ==========================================
   INTERACTIVE MAP OF DESTINATIONS
   ========================================== */
const destinationDetails = {
    paris: {
        title: "París, Francia",
        desc: "Disfruta del arte, la moda y el romanticismo en la histórica capital de Francia. Conoce la Torre Eiffel al atardecer y deléitate en bistrós premium.",
        price: "$1,450 USD",
        formVal: "paris"
    },
    cancun: {
        title: "Cancún, México",
        desc: "Playas caribeñas de agua turquesa cristalina, arrecifes de coral deslumbrantes y resorts todo incluido de clase mundial.",
        price: "$980 USD",
        formVal: "cancun"
    },
    tokyo: {
        title: "Tokio, Japón",
        desc: "Sumérgete en la metrópolis más futurista del mundo. Rascacielos iluminados por neón conviviendo con templos imperiales históricos.",
        price: "$1,790 USD",
        formVal: "tokyo"
    },
    santorini: {
        title: "Santorini, Grecia",
        desc: "Una joya del mar Egeo. Admira la arquitectura cicládica blanca y azul mientras observas atardeceres legendarios sobre la caldera.",
        price: "$1,250 USD",
        formVal: "santorini"
    },
    dubai: {
        title: "Dubái, Emiratos Árabes",
        desc: "El lujo extremo y la ingeniería futurista del desierto. Hoteles ultra-premium, islas artificiales y compras exclusivas.",
        price: "$1,899 USD",
        formVal: "dubai"
    }
};

function initInteractiveMap() {
    const pins = document.querySelectorAll('.map-pin');
    const tooltip = document.getElementById('map-tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipDesc = document.getElementById('tooltip-desc');
    const tooltipPrice = document.getElementById('tooltip-price');
    const tooltipBtn = document.getElementById('tooltip-btn');

    if (!tooltip) return;

    pins.forEach(pin => {
        pin.addEventListener('click', (e) => {
            const destKey = pin.getAttribute('data-destination');
            const data = destinationDetails[destKey];

            if (data) {
                // Populate tooltip details
                tooltipTitle.innerText = data.title;
                tooltipDesc.innerText = data.desc;
                tooltipPrice.innerText = data.price;
                tooltipBtn.setAttribute('onclick', `selectDestination('${data.formVal}')`);

                // Show tooltip
                tooltip.classList.add('active');
            }
        });
    });

    // Close tooltip if clicking outside map pins
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.map-pin') && !e.target.closest('#map-tooltip') && tooltip.classList.contains('active')) {
            tooltip.classList.remove('active');
        }
    });

    // Auto-select first destination (Paris) on load to show tooltip preview
    setTimeout(() => {
        if(tooltip && pins.length > 0) {
            pins[0].dispatchEvent(new Event('click'));
        }
    }, 1000);
}

/* ==========================================
   GLOBAL ACTIONS
   ========================================== */
window.selectDestination = function(destVal) {
    const select = document.getElementById('form-destination');
    if (select) {
        select.value = destVal;
    }
    // Scroll smoothly to contact section
    
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
};

window.fillDestinationSelect = function() {
    const quickDest = document.getElementById('quick-dest');
    if(quickDest) {
        selectDestination(quickDest.value);
    }
};

/* ==========================================
   TOURIST CHATBOT WIDGET
   ========================================== */
function initChatbot() {
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const fabBadge = chatbotFab ? chatbotFab.querySelector('.fab-badge') : null;

    if (!chatbotFab || !chatbotWindow) return;

    // Toggle window
    chatbotFab.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
        if (fabBadge) {
            fabBadge.classList.add('hidden'); // Clear new message badge
        }
        // Focus input
        setTimeout(() => chatbotInput.focus(), 100);
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    // Send handlers
    chatbotSendBtn.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        // Append User Message
        appendMessage(text, 'user');
        chatbotInput.value = '';

        // Process Bot Answer
        setTimeout(() => {
            const reply = generateBotReply(text.toLowerCase());
            appendMessage(reply, 'system');
        }, 800);
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text;
        chatbotMessages.appendChild(msgDiv);
        
        // Auto-scroll messages
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Expose suggestions trigger globally
    window.askChatbot = function(text) {
        chatbotInput.value = text;
        sendMessage();
    };

    function generateBotReply(userInput) {
        if (userInput.includes('cancun') || userInput.includes('cancún')) {
            return `¡Cancún es de nuestras mejores ofertas! Actualmente tenemos la promoción de <strong>Viaje 2x1 a Cancún</strong> en el resort boutique Oasis Premium. ¿Quieres que te reservemos esta oferta? <br><br> <button class="suggestion-chip" onclick="selectDestination('cancun'); document.getElementById('chatbot-window').classList.add('hidden');">Sí, ¡reservar 2x1!</button>`;
        }
        if (userInput.includes('paris') || userInput.includes('parís')) {
            return `¡Ah, París! La ciudad del romance. Con Viajes Mike tienes <strong>30% de descuento en el Paquete Europa Soñada</strong>. Incluye hotel premium y traslados privados. <br><br> <button class="suggestion-chip" onclick="selectDestination('paris'); document.getElementById('chatbot-window').classList.add('hidden');">Ir a Reservar París</button>`;
        }
        if (userInput.includes('tokio') || userInput.includes('tokyo')) {
            return `Tokio es ideal para los amantes del futurismo y la cultura tradicional. Contamos con paquetes de 9 días con guías locales en español y visitas exclusivas al Monte Fuji. <br><br> <button class="suggestion-chip" onclick="selectDestination('tokyo'); document.getElementById('chatbot-window').classList.add('hidden');">Planificar viaje a Tokio</button>`;
        }
        if (userInput.includes('santorini')) {
            return `Santorini ofrece vistas espectaculares del mar Egeo. El paquete incluye hospedaje en villas de lujo con infinity pool y paseos en catamarán privado al atardecer. <br><br> <button class="suggestion-chip" onclick="selectDestination('santorini'); document.getElementById('chatbot-window').classList.add('hidden');">Ver Santorini</button>`;
        }
        if (userInput.includes('dubai') || userInput.includes('dubái')) {
            return `¡Nuestra <strong>Oferta de Verano a Dubái</strong> es imperdible! Incluye entrada gratis al Burj Khalifa y hospedaje en un hotel 5 estrellas. <br><br> <button class="suggestion-chip" onclick="selectDestination('dubai'); document.getElementById('chatbot-window').classList.add('hidden');">Reservar Dubái ahora</button>`;
        }
        if (userInput.includes('oferta') || userInput.includes('descuento') || userInput.includes('promocion') || userInput.includes('promoción')) {
            return `¡Tenemos promociones activas ahora mismo! <br>• <strong>30% de descuento</strong> a Europa <br>• <strong>Viaje 2x1</strong> a Cancún <br>• <strong>Oferta especial de Verano</strong> a Dubái. <br><br>¿Cuál de estos te interesa más?`;
        }
        if (userInput.includes('reservar') || userInput.includes('cómo reservar') || userInput.includes('reservas') || userInput.includes('contacto')) {
            return `Para reservar, simplemente completa nuestro <strong>Formulario de Contacto</strong> que se encuentra abajo en esta página. Uno de nuestros asesores premium te contactará de inmediato por correo o teléfono. <br><br><button class="suggestion-chip" onclick="document.getElementById('contacto').scrollIntoView({behavior: 'smooth'}); document.getElementById('chatbot-window').classList.add('hidden');">Ir al formulario de reservas</button>`;
        }
        
        return `Disculpa, no entendí bien la pregunta. ¿Te gustaría saber sobre nuestras promociones en <strong>París</strong>, el 2x1 a <strong>Cancún</strong>, o tal vez nuestra oferta a <strong>Dubái</strong>? ✈️`;
    }
}

/* ==========================================
   CONTACT FORM VALIDATION & SUBMISSION
   ========================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const destination = document.getElementById('form-destination').value;
        const message = document.getElementById('form-message').value.trim();

        // Very basic validations
        if (!name || !email || !destination || !message) {
            feedback.innerText = "Por favor, completa todos los campos requeridos.";
            feedback.className = "form-feedback error";
            feedback.classList.remove('hidden');
            return;
        }

        // Simulating premium API dispatch
        feedback.innerText = "Procesando tu solicitud de viaje premium...";
        feedback.className = "form-feedback success";
        feedback.classList.remove('hidden');
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = "Enviando...";

        setTimeout(() => {
            feedback.innerHTML = `<h4>¡Gracias, ${name}!</h4><p>Tu solicitud para viajar a <strong>${destinationDetails[destination].title}</strong> ha sido recibida con éxito. Un concierge premium de Viajes Mike se pondrá en contacto contigo a la brevedad en tu dirección de correo: <strong>${email}</strong>.</p>`;
            feedback.className = "form-feedback success";
            
            // Clear inputs
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = "Enviar Solicitud";
            
            // Auto hide feedback after 10s
            setTimeout(() => {
                feedback.classList.add('hidden');
            }, 10000);
        }, 1800);
    });
}

/* ==========================================
   MOUSE AIRPLANE FOLLOWER
   ========================================== */
function initMouseAirplane() {
    const airplane = document.getElementById('mouse-airplane');
    if (!airplane) return;

    let mouseX = 0;
    let mouseY = 0;
    let planeX = 0;
    let planeY = 0;
    let angle = 0;
    let isFirstMove = true;
    let isMouseActive = false;
    let lastParticleTime = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseActive = true;
        airplane.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        airplane.classList.remove('visible');
        isMouseActive = false;
    });

    function createParticle(x, y, currentAngle) {
        const now = Date.now();
        if (now - lastParticleTime < 40) return; // limit rate of particle generation
        lastParticleTime = now;

        const particle = document.createElement('div');
        particle.className = 'plane-trail-particle';
        
        // Spawn slightly behind the plane
        const rad = currentAngle * Math.PI / 180;
        const tailX = x - Math.cos(rad) * 12;
        const tailY = y - Math.sin(rad) * 12;
        
        // Add minor random scatter for turbulence
        const scatterX = (Math.random() - 0.5) * 6;
        const scatterY = (Math.random() - 0.5) * 6;
        
        particle.style.left = `${tailX + scatterX}px`;
        particle.style.top = `${tailY + scatterY}px`;
        
        // Randomize initial size a bit
        const size = Math.random() * 4 + 4; // 4px to 8px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        document.body.appendChild(particle);
        
        // Remove from DOM after animation completes (matches CSS animation duration of 0.8s)
        setTimeout(() => {
            particle.remove();
        }, 800);
    }

    function tick() {
        if (isMouseActive) {
            const dx = mouseX - planeX;
            const dy = mouseY - planeY;
            
            if (isFirstMove) {
                planeX = mouseX;
                planeY = mouseY;
                isFirstMove = false;
            } else {
                // Lerp position for smooth lag effect
                planeX += dx * 0.08;
                planeY += dy * 0.08;
            }

            // Calculate rotation angle based on movement delta
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                let targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                // Normalize angle difference to prevent 360deg spin jumps
                let angleDiff = targetAngle - angle;
                if (angleDiff > 180) angleDiff -= 360;
                if (angleDiff < -180) angleDiff += 360;
                angle += angleDiff * 0.15; // Smooth rotation interpolation
            }

            airplane.style.transform = `translate3d(${planeX}px, ${planeY}px, 0) rotate(${angle}deg)`;
            
            // Spawn particles only when moving significantly
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                createParticle(planeX, planeY, angle);
            }
        }
        
        requestAnimationFrame(tick);
    }
    
    // Start loop
    requestAnimationFrame(tick);
}
