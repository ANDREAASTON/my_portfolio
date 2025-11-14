/**
 * Navigation Module
 * Handles navigation functionality including mobile menu toggle,
 * smooth scrolling, and active link highlighting
 */

import { debounce, smoothScroll } from './utils.js';

export class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.navAnchors = document.querySelectorAll('.nav-links a');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveLink();
        this.setupStickyNavbar();
    }

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        if (!this.hamburger) return;

        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu when clicking a link
        this.navAnchors.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#navbar')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navLinks.classList.remove('active');
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        this.navAnchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Only prevent default if it's a local anchor
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        smoothScroll(targetElement, 80);
                    }
                }
            });
        });
    }

    /**
     * Setup active link highlighting on scroll
     */
    setupActiveLink() {
        const sections = document.querySelectorAll('section');
        
        const updateActiveLink = debounce(() => {
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 200) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            this.navAnchors.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }, 100);
        
        window.addEventListener('scroll', updateActiveLink);
    }

    /**
     * Setup sticky navbar on scroll
     */
    setupStickyNavbar() {
        const handleStickyNavbar = debounce(() => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('sticky');
            } else {
                this.navbar.classList.remove('sticky');
            }
        }, 50);
        
        window.addEventListener('scroll', handleStickyNavbar);
    }
}
