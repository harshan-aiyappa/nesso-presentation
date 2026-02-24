gsap.registerPlugin(ScrollTrigger);

// Custom Cursor & Micro-Interactions
const cursor = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('.grid-item, .step, .query-card, table tr, .flow-node, .gold-box, .closing, .brand-logo, li');

document.addEventListener('mousemove', (e) => {
    if (window.getComputedStyle(cursor).display === 'none') return;

    // Magnetic Effect Logic
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
    });

    // Parallax Background
    const moveX = (mouseX / window.innerWidth - 0.5) * 20;
    const moveY = (mouseY / window.innerHeight - 0.5) * 20;
    gsap.to('.background-mesh', {
        x: moveX,
        y: moveY,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Magnetic Elements
const magneticElements = document.querySelectorAll('.grid-item, .step, h1, .brand-logo');
magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const bounds = el.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        gsap.to(el, {
            x: deltaX * 0.15,
            y: deltaY * 0.15,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Interactive Cursor States
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Presentation Container Scroll Logic
const slides = document.querySelectorAll('.slide');
const progressBar = document.querySelector('.progress-bar');

// Initialize GSAP Animations for each slide
slides.forEach((slide) => {
    const staggers = slide.querySelectorAll('.stagger');

    // Create a timeline for each slide's animations
    const tl = gsap.timeline({ paused: true });

    // Staggered elements in slide
    if (staggers.length > 0) {
        tl.fromTo(staggers,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
            "-=0.4"
        );
    }
    tl.call(() => slide.classList.add('active'));


    // Slide entry animation
    ScrollTrigger.create({
        trigger: slide,
        start: "top 85%",
        onEnter: () => tl.play(),
        once: true
    });

    // Special sequence animation for Slide 9 flow
    if (slide.id === 'slide-9') {
        const nodes = slide.querySelectorAll('.flow-node');
        const arrows = slide.querySelectorAll('.flow-arrow');
        const closing = slide.querySelector('.closing');
        const flowTimeline = gsap.timeline({
            delay: 0.8,
            repeat: -1, // Make it loop indefinitely
            repeatDelay: 1 // Pause briefly before restarting the sequence
        });

        nodes.forEach((node, index) => {
            flowTimeline.to(node, {
                borderColor: '#147A44',
                backgroundColor: 'rgba(20, 122, 68, 0.3)',
                color: '#F5F5DC',
                duration: 0.6,
                onStart: () => {
                    node.classList.add('pulse');
                },
                onComplete: () => {
                    // Keep the pulse active but reset colors if needed or just let it loop
                }
            });

            if (arrows[index]) {
                flowTimeline.to(arrows[index], {
                    color: '#147A44',
                    opacity: 1,
                    duration: 0.3
                }, "-=0.2");
            }
        });

        // Final cinematic reveal for the closing line (once per loop or overall)
        // If we want it to stay gold, we can split it out of the repeat loop
        // But keeping it here punctuates the sequence.
        flowTimeline.to(closing, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            color: '#F9D616'
        }, "+=0.2");

        // Reset nodes at the end of the loop for the next run
        flowTimeline.to(nodes, {
            borderColor: 'rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            color: '#F5F5DC',
            duration: 0.5,
            onStart: () => {
                nodes.forEach(n => n.classList.remove('pulse'));
            }
        }, "+=2"); // Stay in the final "notified" state for 2 seconds
    }
});

// Progress Bar update
gsap.to(progressBar, {
    width: "100%",
    ease: "none",
    scrollTrigger: {
        trigger: "#presentation-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption');

        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;

        lightbox.classList.add('active');
        gsap.to(lightbox, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(lightboxImg, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" });
    });
});

const closeLightbox = () => {
    gsap.to(lightbox, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
            lightbox.classList.remove('active');
        }
    });
};

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Close Lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});
