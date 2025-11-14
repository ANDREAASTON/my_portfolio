/**
 * Utility Functions
 * Common helper functions used across the application
 */

/**
 * Debounce function to throttle event handlers
 * @param {Function} func - The function to debounce
 * @param {Number} wait - The wait time in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
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

/**
 * Throttle function to limit function execution
 * @param {Function} func - The function to throttle
 * @param {Number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Smoothly scroll to an element
 * @param {Element} element - The element to scroll to
 * @param {Number} offset - Optional offset from the top
 * @param {Number} duration - Duration of the scroll animation
 */
export function smoothScroll(element, offset = 80, duration = 300) {
    if (!element) return;
    
    const start = window.scrollY;
    const target = element.offsetTop - offset;
    const distance = target - start;
    let startTime = null;

    const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const scroll = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, start + distance * easeInOutQuad(progress));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(scroll);
        }
    };

    requestAnimationFrame(scroll);
}

/**
 * Check if element is in viewport
 * @param {Element} element - The element to check
 * @returns {Boolean} - True if element is visible
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - The element
 * @param {String} event - The event name
 * @param {Function} handler - The event handler
 * @returns {Function} - Function to remove the listener
 */
export function addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    return () => {
        element.removeEventListener(event, handler);
    };
}

/**
 * Store data in localStorage with expiration
 * @param {String} key - The storage key
 * @param {Any} value - The value to store
 * @param {Number} hours - Hours until expiration (optional)
 */
export function setStorage(key, value, hours = null) {
    const data = {
        value: value,
        timestamp: Date.now(),
        expires: hours ? Date.now() + (hours * 60 * 60 * 1000) : null
    };
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Get data from localStorage with expiration check
 * @param {String} key - The storage key
 * @returns {Any} - The stored value or null
 */
export function getStorage(key) {
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    const { value, expires } = JSON.parse(data);
    
    if (expires && Date.now() > expires) {
        localStorage.removeItem(key);
        return null;
    }
    
    return value;
}

/**
 * Remove data from localStorage
 * @param {String} key - The storage key
 */
export function removeStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Format date to readable string
 * @param {Date} date - The date to format
 * @param {String} format - The format pattern
 * @returns {String} - Formatted date
 */
export function formatDate(date, format = 'MM/DD/YYYY') {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    
    return format
        .replace('MM', month)
        .replace('DD', day)
        .replace('YYYY', year);
}

/**
 * Clone an object deeply
 * @param {Object} obj - The object to clone
 * @returns {Object} - Deep cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const cloned = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
}
