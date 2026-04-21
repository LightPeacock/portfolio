// Enhanced 3D Website JavaScript - C.L. Narayanan Portfolio

// Gallery management for 3D product images
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-img');

// Initialize gallery if images exist  
if (galleryImages.length > 0) {
    initializeGallery();
}

function initializeGallery() {
    // Set first image as active
    galleryImages[0].classList.add('active');
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Add touch/swipe support for mobile
    addTouchSupport();
    
    // Auto-advance gallery every 5 seconds (optional)
    // setInterval(() => {
    //     changeImage(1);
    // }, 5000);
}

function changeImage(direction) {
    if (galleryImages.length === 0) return;
    
    // Remove active class from current image
    galleryImages[currentImageIndex].classList.remove('active');
    
    // Calculate new index with wrapping
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    
    // Add active class to new image with fade effect
    galleryImages[currentImageIndex].classList.add('active');
    
    // Update image counter if exists
    updateImageCounter();
    
    // Trigger custom event for analytics
    triggerGalleryEvent('image_change', currentImageIndex);
}

function updateImageCounter() {
    const counter = document.querySelector('.image-counter');
    if (counter && galleryImages.length > 0) {
        counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
}

function handleKeyboardNavigation(e) {
    if (galleryImages.length === 0) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            changeImage(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeImage(1);
            break;
        case 'Home':
            e.preventDefault();
            jumpToImage(0);
            break;
        case 'End':
            e.preventDefault();
            jumpToImage(galleryImages.length - 1);
            break;
    }
}

function jumpToImage(index) {
    if (index < 0 || index >= galleryImages.length) return;
    
    galleryImages[currentImageIndex].classList.remove('active');
    currentImageIndex = index;
    galleryImages[currentImageIndex].classList.add('active');
    updateImageCounter();
}

function addTouchSupport() {
    let startX = 0;
    let startY = 0;
    const gallery = document.querySelector('.images-container');
    
    if (!gallery) return;
    
    gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    gallery.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    changeImage(1); // Swipe left - next image
                } else {
                    changeImage(-1); // Swipe right - previous image
                }
            }
        }
        
        // Reset
        startX = 0;
        startY = 0;
    }, { passive: true });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Image lazy loading with intersection observer
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        }
    });
});

// Enhanced contact form with better validation
function enhanceContactForm() {
    const contactButtons = document.querySelectorAll('.btn[href^="mailto:"], .btn[href^="https://wa.me/"]');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const type = this.href.includes('mailto:') ? 'email' : 'whatsapp';
            triggerContactEvent(type);
        });
    });
}

// Analytics and event tracking
function triggerGalleryEvent(action, imageIndex) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: '3d_project_gallery',
            event_label: `image_${imageIndex + 1}`,
            value: imageIndex
        });
    }
    
    // Custom event for other analytics platforms
    window.dispatchEvent(new CustomEvent('portfolioGalleryEvent', {
        detail: { action, imageIndex }
    }));
}

function triggerContactEvent(type) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_click', {
            event_category: '3d_project_contact',
            event_label: type,
            page_title: '3D Product Configurator'
        });
    }
}

// Progressive Web App support
function initPWASupport() {
    // Add to home screen prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button if desired
        const installButton = document.querySelector('.install-app-btn');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });
}

// Error handling for failed image loads
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.classList.add('error');
            
            // You could set a fallback image here
            // this.src = '/path/to/fallback-image.jpg';
            
            // Or hide the failed image
            this.style.display = 'none';
        });
        
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
}

// Copy project link to clipboard
function copyProjectLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Project link copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy link:', err);
            fallbackCopyToClipboard(url);
        });
    } else {
        fallbackCopyToClipboard(url);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Project link copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy link:', err);
        showNotification('Failed to copy link. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show temporary notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6366F1'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
function addNotificationStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        .image-card.loaded img {
            opacity: 1;
        }
        .image-card img {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .image-card img.error {
            display: none;
        }
    `;
    document.head.appendChild(styles);
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            
            // Send to analytics if available
            if (typeof gtag !== 'undefined' && loadTime > 0) {
                gtag('event', 'page_load_time', {
                    event_category: 'performance',
                    value: Math.round(loadTime),
                    custom_map: { metric1: 'load_time' }
                });
            }
        }, 0);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add notification styles
    addNotificationStyles();
    
    // Observe elements for animations
    const elementsToAnimate = document.querySelectorAll('.info-card, .technical-card, .alternative-card, .image-card');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // Observe images for lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Initialize other features
    enhanceContactForm();
    handleImageErrors();
    initPWASupport();
    initPerformanceMonitoring();
    
    // Add copy link functionality to share buttons if they exist
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            copyProjectLink();
        });
    });
    
    console.log('3D Project page loaded successfully! 🎨');
});

// Export functions for global use
window.changeImage = changeImage;
window.copyProjectLink = copyProjectLink;
window.showNotification = showNotification;