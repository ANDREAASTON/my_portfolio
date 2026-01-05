// site.ui.js
document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Sticky navbar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('sticky', window.scrollY > 100);
        });
    }

    // Scroll to top
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('active', window.scrollY > 300);
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Active section highlighting
    const sections = document.querySelectorAll('section');
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                if (pageYOffset >= section.offsetTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        });
    }

    // Skills animation
    const skillBars = document.querySelectorAll(".skill-progress");
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute("data-width");
            bar.style.width = width;
            const percent = bar.querySelector(".skill-percent");
            if (percent) {
                percent.textContent = width;
                percent.style.opacity = 1;
                percent.style.left = width;
            }
        });
    }
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        observer.observe(skillsSection);
    }

    // Video playback speed
    const video = document.getElementById("smartbinVideo");
    if (video) video.playbackRate = 0.5;

    // Course search
    const searchInput = document.getElementById('courseSearchInput');
    const categoryCards = document.querySelectorAll('.category-card');
    if (searchInput && categoryCards.length > 0) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            categoryCards.forEach(card => {
                let hasVisible = false;
                const courseItems = card.querySelectorAll('li');
                courseItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(searchTerm) ? 'block' : 'none';
                    if (text.includes(searchTerm)) hasVisible = true;
                });
                card.style.display = hasVisible || searchTerm === '' ? 'block' : 'none';
            });
        });
    }

    // EmailJS contact form
    const contactForm = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('thank-you');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            emailjs.sendForm("service_lxyb7lz", "template_9gjod4x", contactForm)
                .then(() => {
                    contactForm.style.display = 'none';
                    thankYouMessage.style.display = 'block';
                    setTimeout(() => {
                        contactForm.style.display = 'grid';
                        thankYouMessage.style.display = 'none';
                        contactForm.reset();
                    }, 5000);
                })
                .catch(err => {
                    console.error("EmailJS Error:", err);
                    alert("Failed to send message. Try again.");
                });
        });
    }

}); // END DOMContentLoaded
