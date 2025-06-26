// IA Insight - Main JavaScript File
// Funcionalidades: Menu mobile, Dark Mode, Validação de formulários, Microanimações

// Configurações globais
const CONFIG = {
    animationDelay: 100,
    scrollThreshold: 0.1,
    mobileBreakpoint: 768,
    darkModeKey: 'ia-insight-dark-mode',
    smoothScrollDuration: 800
};

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', function() {
    setupDarkMode();
    setupMobileMenu();
    setupScrollAnimations();
    setupSmoothScrolling();
    setupFormValidation();
    setupLoadingAnimations();
    setupPerformanceOptimizations();
    setupBackToTopVisibility();
});

// ===== COMPONENTES PRINCIPAIS =====

function initializeComponents() {
    console.log('🚀 IA Insight - Componentes inicializados');
}

// ===== DARK MODE AVANÇADO =====

function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem(CONFIG.darkModeKey) === 'true' || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        updateDarkModeIcon();
    }
    
    // Observar mudanças no sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(CONFIG.darkModeKey)) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            updateDarkModeIcon();
        }
    });
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(CONFIG.darkModeKey, isDark);
    updateDarkModeIcon();
    
    // Animação de transição
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateDarkModeIcon() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const isDark = document.documentElement.classList.contains('dark');
    const icon = darkModeToggle.querySelector('svg');
    
    if (isDark) {
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        `;
    } else {
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        `;
    }
}

// ===== MENU MOBILE MELHORADO =====

function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('translate-x-0');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Fechar ao clicar no overlay
        if (overlay) {
            overlay.addEventListener('click', closeMobileMenu);
        }
        
        // Fechar ao clicar em links do menu
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Fechar ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('translate-x-0')) {
                closeMobileMenu();
            }
        });
    }
}

function openMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        document.body.style.overflow = 'hidden';
    }
    
    if (overlay) {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('-translate-x-full');
        document.body.style.overflow = '';
    }
    
    if (overlay) {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
}

// ===== ANIMAÇÕES DE SCROLL AVANÇADAS =====

function setupScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.scrollThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animações específicas baseadas em classes
                if (entry.target.classList.contains('stagger-animation')) {
                    animateStaggerChildren(entry.target);
                }
                
                if (entry.target.classList.contains('fade-in-left')) {
                    entry.target.style.animation = 'fadeInLeft 0.8s ease-out forwards';
                }
                
                if (entry.target.classList.contains('fade-in-right')) {
                    entry.target.style.animation = 'fadeInRight 0.8s ease-out forwards';
                }
                
                if (entry.target.classList.contains('scale-in')) {
                    entry.target.style.animation = 'scaleIn 0.6s ease-out forwards';
                }
                
                // Parar de observar após animar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos com animações
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .stagger-animation, .fade-in-left, .fade-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));
}

function animateStaggerChildren(parent) {
    const children = parent.querySelectorAll('.stagger-child');
    children.forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animated');
        }, index * CONFIG.animationDelay);
    });
}

// ===== SCROLL SUAVE =====

function setupSmoothScrolling() {
    // Scroll suave só para âncoras internas
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajuste para header fixo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== VALIDAÇÃO DE FORMULÁRIOS =====

function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
            // Não impedir o envio se for válido, e não usar fetch/AJAX
        });
        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Limpar erro anterior
    clearFieldError(field);
    
    // Validação de campo obrigatório
    if (required && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    // Validações específicas por tipo
    if (value) {
        switch (type) {
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Digite um email válido');
                    return false;
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    showFieldError(field, 'Digite um telefone válido');
                    return false;
                }
                break;
        }
    }
    
    return true;
}

function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    // Remover mensagem de erro anterior
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Criar nova mensagem de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormError(message) {
    createToast(message, 'error');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\(\)\-\+]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    input.value = value;
}

// ===== ANIMAÇÕES DE CARREGAMENTO =====

function setupLoadingAnimations() {
    const loader = document.getElementById('loader');
    
    if (loader) {
        // Simular tempo de carregamento
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 1500);
    }
}

// ===== OTIMIZAÇÕES DE PERFORMANCE =====

function setupPerformanceOptimizations() {
    // Lazy loading de imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce para eventos de scroll
    const debouncedScrollHandler = debounce(() => {
        // Handlers de scroll otimizados
    }, 100);
    
    window.addEventListener('scroll', debouncedScrollHandler);
}

// ===== UTILITÁRIOS =====

function createToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    toast.classList.add(...colors[type].split(' '));
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EXPORTAR FUNÇÕES =====

window.IAInsight = {
    toggleDarkMode,
    createToast,
    debounce,
    throttle
};

function setupBackToTopVisibility() {
    const btnTopo = document.getElementById('btn-topo');
    if (!btnTopo) return;
    btnTopo.style.display = 'none'; // Oculto por padrão
    function checkScroll() {
        if (window.scrollY > 0) {
            btnTopo.style.display = 'flex';
        } else {
            btnTopo.style.display = 'none';
        }
    }
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    setTimeout(checkScroll, 500); // Checa após carregamento
}

