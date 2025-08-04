// Enhanced JavaScript for C.L. Narayanan Portfolio
// New initialization for SDK v4
emailjs.init({
    publicKey: 'DXjuxo2U7ysdz2fA5'
});


// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contact-form');
const backToTopBtn = document.getElementById('back-to-top');
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('char-count');

// Mobile Navigation Toggle
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after clicking
            if (hamburger.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Add/remove navbar background
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (scrollY > 300) {
        backToTopBtn?.classList.add('show');
    } else {
        backToTopBtn?.classList.remove('show');
    }
});

// Back to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Character counter for message textarea
if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        // Change color based on character limit
        if (currentLength > 450) {
            charCount.style.color = '#EF4444'; // Red
        } else if (currentLength > 400) {
            charCount.style.color = '#F59E0B'; // Orange
        } else {
            charCount.style.color = '#94A3B8'; // Default gray
        }
    });
}

// Enhanced Contact Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const formStatus = document.getElementById('form-status');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            from_name: formData.get('from_name'),
            from_email: formData.get('from_email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validation
        if (!data.from_name || !data.from_email || !data.subject || !data.message) {
            showFormStatus('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(data.from_email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formStatus.className = 'form-status';
        formStatus.textContent = '';
        
        try {
            // Updated send method for SDK v4
const result = await emailjs.send(
    'service_a3zpc2r', // Your service ID
    'template_lpsv7it', // Your template ID
    {
        from_name: data.from_name,
        from_email: data.from_email,
        subject: `Portfolio Contact: ${data.subject}`,
        message: `From: ${data.from_name} (${data.from_email})\n\nSubject: ${data.subject}\n\nMessage:\n${data.message}`
    }
);
            
            showFormStatus('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
            this.reset();
            
            // Reset character counter
            if (charCount) {
                charCount.textContent = '0';
                charCount.style.color = '#94A3B8';
            }
            
            // Track successful form submission (if you have analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: 'portfolio_contact_form'
                });
            }
            
        } catch (error) {
            console.error('Email sending failed:', error);
            showFormStatus('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Form status helper function
function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 3D Project Gallery Functionality
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-img');

function changeImage(direction) {
    if (galleryImages.length === 0) return;
    
    // Remove active class from current image
    galleryImages[currentImageIndex].classList.remove('active');
    
    // Calculate new index
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    
    // Add active class to new image
    galleryImages[currentImageIndex].classList.add('active');
}

// Auto-advance gallery every 5 seconds
if (galleryImages.length > 1) {
    setInterval(() => {
        changeImage(1);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.project-card, .timeline-item, .detail-card, .contact-method');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Enhanced WhatsApp integration
function openWhatsApp(message = '') {
    const phoneNumber = '919867629595';
    const defaultMessage = encodeURIComponent(message || 'Hello C.L. Narayanan, I found your portfolio and would like to connect!');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    // Track WhatsApp click (if you have analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'contact',
            event_label: 'whatsapp_click'
        });
    }
}

// Theme preference detection
function detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // You can add theme switching logic here if needed
    darkModeMediaQuery.addEventListener('change', (e) => {
        // Handle theme change if you implement light/dark mode toggle
        console.log('Color scheme changed to:', e.matches ? 'dark' : 'light');
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && hamburger.classList.contains('active')) {
        toggleMenu();
    }
    
    // Home key scrolls to top
    if (e.key === 'Home' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        scrollToTop();
    }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Error handling for failed resource loads
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Failed to load image:', e.target.src);
        // You could set a fallback image here
        // e.target.src = 'path/to/fallback-image.jpg';
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you create a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(registrationError => {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Copy email to clipboard functionality
function copyEmail(email) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            showTemporaryToast('Email copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy email:', err);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showTemporaryToast('Email copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy email:', err);
        }
        document.body.removeChild(textArea);
    }
}

// Show temporary toast notification
function showTemporaryToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--success-color);
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        z-index: 10000;
        animation: slideInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add CSS for toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInUp {
        from { opacity: 0; transform: translateX(-50%) translateY(100%); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes slideOutDown {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(100%); }
    }
`;
document.head.appendChild(toastStyles);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    detectColorScheme();
    
    // Add click listeners to email elements for copying
    document.querySelectorAll('[data-email]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            copyEmail(element.dataset.email || element.textContent);
        });
    });
    
    console.log('Portfolio loaded successfully! 🚀');
});

// Export functions for global use
window.toggleMenu = toggleMenu;
window.scrollToTop = scrollToTop;
window.changeImage = changeImage;
window.openWhatsApp = openWhatsApp;
window.copyEmail = copyEmail;