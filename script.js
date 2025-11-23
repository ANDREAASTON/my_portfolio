document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
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
    }
    
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
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        });
    }
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
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
    }
    
    // Active section highlighting in navigation
    const sections = document.querySelectorAll('section');
    
    if (sections.length > 0) {
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
    }

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
    const skillBars = document.querySelectorAll(".skill-progress");

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute("data-width");

            // Animate the bar width
            bar.style.width = width;

            // Animate percentage moving along the bar
            const percent = bar.querySelector(".skill-percent");
            if (percent) {
                percent.textContent = width;      // show percentage text
                percent.style.opacity = 1;        // fade in
                percent.style.left = width;       // position at end of fill
            }
        });
    }

    // Intersection Observer for triggering animation
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

    // Set video playback rate for smart bin video
    const video = document.getElementById("smartbinVideo");
    if (video) {
        video.playbackRate = 0.5;
    }

    // Fullscreen Image Viewer with Swipe Support
    const images = Array.from(document.querySelectorAll(".masonry img"));
    const viewer = document.getElementById("fullscreenViewer");
    const viewerImg = document.getElementById("fullscreenImage");
    
    if (images.length > 0 && viewer && viewerImg) {
        let currentIndex = 0;

        // Open fullscreen
        images.forEach((img, index) => {
            img.addEventListener("click", () => {
                currentIndex = index;
                showImage();
                viewer.style.display = "flex";
            });
        });

        // Show current image
        function showImage() {
            viewerImg.src = images[currentIndex].src;
        }

        // Close when clicking background only
        viewer.addEventListener("click", (e) => {
            if (e.target === viewer) {
                viewer.style.display = "none";
            }
        });

        // Swipe handling
        let startX = 0;

        viewer.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        viewer.addEventListener("touchend", (e) => {
            let endX = e.changedTouches[0].clientX;
            let diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left → next
                    currentIndex = (currentIndex + 1) % images.length;
                } else {
                    // Swipe right → previous
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                }
                showImage();
            }
        });
    }

    // COURSE SEARCH FUNCTIONALITY
    console.log("🔧 Initializing course search...");
    
    const searchInput = document.getElementById('courseSearchInput');
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (searchInput && categoryCards.length > 0) {
        console.log("✅ Course search elements found!");
        
        function handleSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            console.log("🔍 Searching for:", searchTerm);
            
            categoryCards.forEach(card => {
                const courseItems = card.querySelectorAll('li');
                let hasVisibleCourses = false;
                
                courseItems.forEach(item => {
                    const courseText = item.textContent.toLowerCase();
                    const originalText = item.textContent;
                    
                    // Reset item
                    item.innerHTML = originalText;
                    item.style.display = 'block';
                    
                    if (searchTerm === '') {
                        hasVisibleCourses = true;
                    } else if (courseText.includes(searchTerm)) {
                        hasVisibleCourses = true;
                        const startIndex = courseText.indexOf(searchTerm);
                        const endIndex = startIndex + searchTerm.length;
                        
                        item.innerHTML = 
                            originalText.substring(0, startIndex) +
                            '<span class="highlight-match">' +
                            originalText.substring(startIndex, endIndex) +
                            '</span>' +
                            originalText.substring(endIndex);
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Show/hide category card
                card.style.display = hasVisibleCourses || searchTerm === '' ? 'block' : 'none';
            });
        }
        
        searchInput.addEventListener('input', handleSearch);
        console.log("🎯 Course search functionality ready!");
    } else {
        console.log("ℹ️ Course search elements not found (this is normal if not on courses page)");
    }
    

}); // END OF DOMCONTENTLOADED