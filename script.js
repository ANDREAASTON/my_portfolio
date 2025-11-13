document.addEventListener('DOMContentLoaded', function() {

    // Like button logic for all galleries
    document.querySelectorAll('.gallery, .gallery-grid').forEach(gallery => {
        gallery.addEventListener('click', function(e) {
            if (e.target.classList.contains('like-btn') || e.target.closest('.like-btn')) {
                const btn = e.target.closest('.like-btn');
                const countSpan = btn.querySelector('.like-count');
                let count = parseInt(countSpan.textContent, 10) || 0;
                if (!btn.classList.contains('liked')) {
                    count++;
                    btn.classList.add('liked');
                } else {
                    count--;
                    btn.classList.remove('liked');
                }
                countSpan.textContent = count;
            }
        });
    });
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky navigation
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Active section highlighting in navigation
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // EmailJS integration for contact form
  const contactForm = document.getElementById('contact-form');
  const thankYouMessage = document.getElementById('thank-you');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      emailjs.sendForm("service_lxyb7lz", "template_9gjod4x", contactForm)
        .then(() => {
          // Show thank you message
          contactForm.style.display = 'none';
          thankYouMessage.style.display = 'block';

          // Reset form after 5 seconds
          setTimeout(() => {
            contactForm.style.display = 'grid'; // Or 'block' based on your CSS
            thankYouMessage.style.display = 'none';
            contactForm.reset();
          }, 5000);
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          alert("❌ Failed to send message. Please try again.");
        });
    });
  }


    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
    
    // Intersection Observer for skill bars animation
    const skillsSection = document.getElementById('skills');
    
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(skillsSection);
    }
    // Set video playback rate for smart bin video
    const video = document.getElementById("smartbinVideo");
    video.playbackRate = 0.5;


});

