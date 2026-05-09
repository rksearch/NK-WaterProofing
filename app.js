// NK Waterproofing Website JavaScript

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartSummary = document.getElementById('cartSummary');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const blogReadMoreButtons = document.querySelectorAll('.blog-read-more');

// Shopping cart state
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initProductFiltering();
    initShoppingCart();
    initFormValidation();
    initScrollAnimations();
    initBlogFunctionality();
});

// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Product filtering functionality
function initProductFiltering() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            filterProducts(filter);
        });
    });
}

function filterProducts(category) {
    productCards.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// Shopping cart functionality
function initShoppingCart() {
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            addToCart(productName, productPrice);
            updateCartDisplay();
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = 'var(--color-success)';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
            }, 1000);
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartSummary.classList.remove('active');
        return;
    }
    
    cartSummary.classList.add('active');
    
    // Update cart items
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>
                $${itemTotal.toFixed(2)}
                <button onclick="removeFromCart('${item.name}')" style="margin-left: 10px; color: var(--color-error); background: none; border: none; cursor: pointer;">×</button>
            </span>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Form validation functionality
function initFormValidation() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simulate form submission
            showSuccessMessage();
            contactForm.reset();
        }
    });
    
    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm() {
    let isValid = true;
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate phone if provided
    const phoneField = document.getElementById('phone');
    if (phoneField.value && !validatePhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    
    // Clear previous error
    clearFieldError(field);
    
    // Required field validation
    if (field.required && !fieldValue) {
        showFieldError(field, `${capitalize(fieldName)} is required`);
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && fieldValue) {
        if (!validateEmail(fieldValue)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Name validation
    if (fieldName === 'name' && fieldValue) {
        if (fieldValue.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long');
            return false;
        }
    }
    
    // Message validation
    if (fieldName === 'message' && fieldValue) {
        if (fieldValue.length < 10) {
            showFieldError(field, 'Message must be at least 10 characters long');
            return false;
        }
    }
    
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function showSuccessMessage() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--color-success);
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 10000;
            text-align: center;
            animation: fadeIn 0.3s ease-in-out;
        ">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
            <h3 style="margin: 0 0 10px 0;">Message Sent Successfully!</h3>
            <p style="margin: 0;">We'll get back to you within 24 hours.</p>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .product-card,
        .blog-card,
        .testimonial-card,
        .about-text,
        .about-image,
        .contact-info,
        .contact-form
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Blog functionality
function initBlogFunctionality() {
    blogReadMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const blogCard = this.closest('.blog-card');
            const blogTitle = blogCard.querySelector('h3').textContent;
            
            // Simulate opening blog post
            showBlogModal(blogTitle);
        });
    });
}

function showBlogModal(title) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s ease-in-out;
        " onclick="this.remove()">
            <div style="
                background: var(--color-surface);
                max-width: 800px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                border-radius: 12px;
                padding: 40px;
                position: relative;
            " onclick="event.stopPropagation()">
                <button onclick="this.closest('div').remove()" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--color-text-secondary);
                ">×</button>
                <h2 style="color: var(--color-primary); margin-bottom: 20px;">${title}</h2>
                <p style="color: var(--color-text-secondary); margin-bottom: 20px;">This is a preview of the blog post content. In a real implementation, this would load the full article content from your CMS or database.</p>
                <p style="line-height: 1.6; color: var(--color-text);">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p style="line-height: 1.6; color: var(--color-text); margin-top: 20px;">
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                </p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--color-border);">
                    <button class="btn btn--primary" onclick="this.closest('div').remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Utility function for smooth scrolling to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add CSS for fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(var(--color-surface), 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.backgroundColor = 'var(--color-surface)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Add smooth hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize counter animation
animateCounters();