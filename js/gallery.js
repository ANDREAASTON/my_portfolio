/**
 * Gallery Module
 * Handles gallery functionality including like button interactions
 */

export class Gallery {
    constructor() {
        this.galleries = document.querySelectorAll('.gallery, .gallery-grid');
        this.init();
    }

    init() {
        if (this.galleries.length === 0) return;
        
        this.galleries.forEach(gallery => {
            this.setupGalleryListeners(gallery);
        });
        
        // Load persisted likes from localStorage
        this.loadLikes();
    }

    /**
     * Setup event listeners for gallery items
     * @param {Element} gallery - The gallery container
     */
    setupGalleryListeners(gallery) {
        gallery.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (!likeBtn) return;
            
            this.toggleLike(likeBtn);
        });
    }

    /**
     * Toggle like status for an image
     * @param {Element} btn - The like button element
     */
    toggleLike(btn) {
        const countSpan = btn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent, 10) || 0;
        const imgElement = btn.closest('.gallery-item').querySelector('img');
        const imageKey = this.getImageKey(imgElement);
        
        if (!btn.classList.contains('liked')) {
            count++;
            btn.classList.add('liked');
            this.saveLike(imageKey, count);
        } else {
            count--;
            btn.classList.remove('liked');
            this.removeLike(imageKey);
        }
        
        countSpan.textContent = count;
    }

    /**
     * Generate a unique key for an image
     * @param {Element} img - The image element
     * @returns {String} - Unique key
     */
    getImageKey(img) {
        return img.src + '_' + img.alt;
    }

    /**
     * Save like to localStorage
     * @param {String} key - Image key
     * @param {Number} count - Like count
     */
    saveLike(key, count) {
        const likes = JSON.parse(localStorage.getItem('portfolio_likes') || '{}');
        likes[key] = { count, timestamp: Date.now() };
        localStorage.setItem('portfolio_likes', JSON.stringify(likes));
    }

    /**
     * Remove like from localStorage
     * @param {String} key - Image key
     */
    removeLike(key) {
        const likes = JSON.parse(localStorage.getItem('portfolio_likes') || '{}');
        delete likes[key];
        localStorage.setItem('portfolio_likes', JSON.stringify(likes));
    }

    /**
     * Load persisted likes from localStorage
     */
    loadLikes() {
        const likes = JSON.parse(localStorage.getItem('portfolio_likes') || '{}');
        
        document.querySelectorAll('.gallery-item').forEach(item => {
            const img = item.querySelector('img');
            const btn = item.querySelector('.like-btn');
            const countSpan = btn.querySelector('.like-count');
            const key = this.getImageKey(img);
            
            if (likes[key]) {
                btn.classList.add('liked');
                countSpan.textContent = likes[key].count;
            }
        });
    }
}
