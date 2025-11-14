/**
 * Animations Module
 * Handles animations including skill bar animations and scroll-to-top button
 */

import { debounce } from './utils.js';

export class Animations {
    constructor() {
        this.scrollTopBtn = document.getElementById('scroll-top');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.skillsSection = document.getElementById('skills');
        
        this.init();
    }

    init() {
        this.setupScrollToTop();
        this.setupSkillBarAnimation();
    }

    /**
     * Setup scroll to top button functionality
     */
    setupScrollToTop() {
        if (!this.scrollTopBtn) return;

        const handleScroll = debounce(() => {
            if (window.scrollY > 300) {
                this.scrollTopBtn.classList.add('active');
            } else {
                this.scrollTopBtn.classList.remove('active');
            }
        }, 50);

        window.addEventListener('scroll', handleScroll);

        this.scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Setup skill bar animation on scroll
     */
    setupSkillBarAnimation() {
        if (this.skillBars.length === 0 || !this.skillsSection) return;

        const animateSkillBars = () => {
            this.skillBars.forEach(bar => {
                // Get width from data-width attribute or existing style
                let width = bar.getAttribute('data-width') || bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        };

        // Use Intersection Observer for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    animateSkillBars();
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.skillsSection);
    }

    /**
     * Animate element on scroll with IntersectionObserver
     * @param {String} selector - CSS selector for elements to animate
     * @param {String} className - Class to add when in view
     * @param {Object} options - IntersectionObserver options
     */
    static animateOnScroll(selector, className = 'in-view', options = {}) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        const defaultOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px',
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    observer.unobserve(entry.target);
                }
            });
        }, defaultOptions);

        elements.forEach(el => observer.observe(el));
    }
}
