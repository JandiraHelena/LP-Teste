// ========================================
// Navegação e Menu Mobile
// ========================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');

// Toggle menu mobile
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========================================
// Smooth Scroll
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
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

// ========================================
// Formulário de Contato
// ========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Capturar dados do formulário
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Validação básica
        if (!data.name || !data.email || !data.phone || !data.service || !data.message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Desabilitar botão durante envio
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Enviando...</span>';
        
        try {
            // Aqui você integraria com seu backend ou serviço de email
            // Exemplo com mailto (solução simples para demonstração)
            const subject = encodeURIComponent(`Contato: ${data.service}`);
            const body = encodeURIComponent(
                `Nome: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Telefone: ${data.phone}\n` +
                `Empresa: ${data.company || 'Não informado'}\n` +
                `Serviço de Interesse: ${data.service}\n\n` +
                `Mensagem:\n${data.message}`
            );
            
            // IMPORTANTE: Substituir com sua integração real
            // Opções: EmailJS, Formspree, seu próprio backend, etc.
            
            // Simulação de envio (remover em produção)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Abrir cliente de email (fallback)
            window.location.href = `mailto:contato@netpro.com.br?subject=${subject}&body=${body}`;
            
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// ========================================
// Sistema de Notificações
// ========================================
function showNotification(message, type = 'info') {
    // Remover notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="notification__message">${message}</span>
        </div>
        <button class="notification__close">✕</button>
    `;
    
    // Adicionar estilos inline (já que não estão no CSS)
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Fechar ao clicar no X
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        margin-left: 1rem;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Adicionar animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification__icon {
        font-size: 1.2rem;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// ========================================
// Scroll Reveal Animation
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elementos para animar
const animatedElements = document.querySelectorAll(`
    .service__card,
    .portfolio__card,
    .differential__card,
    .testimonial__card
`);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ========================================
// Contador Animado para Stats
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observar stats para animar quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumber = entry.target.querySelector('.stat__number');
            if (statNumber) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(number)) {
                    statNumber.textContent = '0';
                    animateCounter(statNumber, number);
                    // Adicionar sufixo se houver
                    if (text.includes('+')) {
                        setTimeout(() => {
                            statNumber.textContent = number + '+';
                        }, 2000);
                    } else if (text.includes('%')) {
                        setTimeout(() => {
                            statNumber.textContent = number + '%';
                        }, 2000);
                    }
                }
            }
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ========================================
// Máscara de Telefone
// ========================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });
}

// ========================================
// Active Link Navigation
// ========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ========================================
// Lazy Loading para Imagens (caso adicione)
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Performance: Debounce para Scroll
// ========================================
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedHighlight = debounce(highlightNavigation, 10);
window.addEventListener('scroll', debouncedHighlight);

// ========================================
// Loading State
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Adicionar animação de entrada
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s ease-out';
    }
});

// ========================================
// Console Message (Easter Egg)
// ========================================
console.log('%c🚀 NetPro Solutions', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cProcurando por desenvolvedores talentosos?', 'font-size: 14px; color: #94a3b8;');
console.log('%cEntre em contato: contato@netpro.com.br', 'font-size: 12px; color: #cbd5e1;');

// ========================================
// Integrações Opcionais (Comentadas)
// ========================================

/*
// Google Analytics (Descomentar e adicionar seu ID)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
*/

/*
// Facebook Pixel (Descomentar e adicionar seu ID)
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
*/

/*
// WhatsApp Float Button (Opcional)
function createWhatsAppButton() {
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/5521999999999?text=Olá! Vim do site e gostaria de solicitar um orçamento.';
    whatsappBtn.target = '_blank';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.innerHTML = '💬';
    whatsappBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #25d366;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        z-index: 999;
        transition: all 0.3s ease;
    `;
    
    whatsappBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
    });
    
    document.body.appendChild(whatsappBtn);
}

// Descomentar para ativar
// createWhatsAppButton();
*/

// ========================================
// Export para uso em outros scripts
// ========================================
window.NetProApp = {
    showNotification,
    animateCounter
};
