// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupSkipLinks();
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Skip to main content
            if (e.key === 'Tab' && e.altKey) {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Escape key to close modals/menus
            if (e.key === 'Escape') {
                this.closeAllModals();
            }

            // Arrow keys for navigation
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.handleArrowNavigation(e);
            }
        });
    }

    // Focus Management
    setupFocusManagement() {
        // Trap focus in modals
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        });

        // Focus indicators
        document.addEventListener('focusin', (e) => {
            e.target.classList.add('focus-visible');
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }

    // Screen Reader Support
    setupScreenReaderSupport() {
        // Live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Announce changes
        this.announce = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };

        // Form validation announcements
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    this.announce('Formulário contém erros. Por favor, corrija os campos destacados.');
                }
            });
        });
    }

    // Skip Links
    setupSkipLinks() {
        const skipLinks = [
            { href: '#main-content', text: 'Pular para o conteúdo principal' },
            { href: '#navigation', text: 'Pular para a navegação' },
            { href: '#footer', text: 'Pular para o rodapé' }
        ];

        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = link.text;
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
                transition: top 0.3s;
            `;

            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });

            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });

            document.body.appendChild(skipLink);
        });
    }

    // Utility Methods
    changeFontSize(delta) {
        const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
        const newSize = Math.max(12, Math.min(24, currentSize + delta));
        document.body.style.fontSize = newSize + 'px';
        
        const message = delta > 0 ? 'Tamanho da fonte aumentado' : 'Tamanho da fonte diminuído';
        this.announce(message);
    }

    closeAllModals() {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    handleArrowNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
            focusableElements[prevIndex].focus();
        }
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
});

// Export for use in other scripts
window.AccessibilityManager = AccessibilityManager; 