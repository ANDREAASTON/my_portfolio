/**
 * Main Application File
 * Initializes all modules and application functionality
 */

import { Navigation } from './navigation.js';
import { Gallery } from './gallery.js';
import { Animations } from './animations.js';
import { FormHandler } from './form-handler.js';

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Portfolio Application...');

    // Initialize modules
    const navigation = new Navigation();
    const gallery = new Gallery();
    const animations = new Animations();
    const formHandler = new FormHandler();

    // Setup video playback
    setupVideoPlayback();

    console.log('Portfolio Application initialized successfully!');
});

/**
 * Setup video playback settings
 */
function setupVideoPlayback() {
    const videos = document.querySelectorAll('video[data-playback-rate]');
    
    videos.forEach(video => {
        const playbackRate = parseFloat(video.getAttribute('data-playback-rate'));
        if (!isNaN(playbackRate)) {
            video.playbackRate = playbackRate;
        }
    });

    // Default playback rate for smart bin video
    const smartBinVideo = document.getElementById('smartbinVideo');
    if (smartBinVideo) {
        smartBinVideo.playbackRate = 0.5;
    }
}

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
