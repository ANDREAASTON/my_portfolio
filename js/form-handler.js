/**
 * Form Handler Module
 * Handles contact form submission and validation
 */

export class FormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.thankYouMessage = document.getElementById('thank-you');
        this.formData = {
            serviceId: 'service_lxyb7lz',
            templateId: 'template_9gjod4x'
        };
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupFormSubmission();
        this.setupFormValidation();
    }

    /**
     * Setup form submission handler
     */
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate form
            if (!this.validateForm()) {
                return;
            }

            try {
                await this.sendEmail();
                this.showSuccessMessage();
                this.form.reset();
            } catch (error) {
                console.error('Error sending email:', error);
                this.showErrorMessage();
            }
        });
    }

    /**
     * Setup real-time form validation
     */
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    /**
     * Validate entire form
     * @returns {Boolean} - True if form is valid
     */
    validateForm() {
        const fields = ['name', 'email', 'message'];
        let isValid = true;

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate individual field
     * @param {Element} field - The input field to validate
     * @returns {Boolean} - True if field is valid
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Remove previous error states
        field.classList.remove('error');

        switch (field.id) {
            case 'email':
                isValid = this.isValidEmail(value);
                break;
            case 'name':
            case 'message':
                isValid = value.length > 0;
                break;
        }

        if (!isValid) {
            field.classList.add('error');
        }

        return isValid;
    }

    /**
     * Validate email format
     * @param {String} email - The email to validate
     * @returns {Boolean} - True if email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Send email using EmailJS
     * @returns {Promise} - EmailJS promise
     */
    sendEmail() {
        if (typeof emailjs === 'undefined') {
            return Promise.reject(new Error('EmailJS is not loaded'));
        }

        return emailjs.sendForm(
            this.formData.serviceId,
            this.formData.templateId,
            this.form
        );
    }

    /**
     * Show success message
     */
    showSuccessMessage() {
        this.form.style.display = 'none';
        this.thankYouMessage.style.display = 'block';

        // Reset form after 5 seconds
        setTimeout(() => {
            this.form.style.display = 'grid';
            this.thankYouMessage.style.display = 'none';
        }, 5000);
    }

    /**
     * Show error message
     */
    showErrorMessage() {
        const message = 'Failed to send message. Please try again later.';
        alert('❌ ' + message);
    }

    /**
     * Get form data as object
     * @returns {Object} - Form data
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        return data;
    }
}
