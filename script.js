gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
});

// Presentation Container Scroll Logic
const slides = document.querySelectorAll('.slide');
const progressBar = document.querySelector('.progress-bar');

// Initialize GSAP Animations for each slide
slides.forEach((slide) => {
    const staggers = slide.querySelectorAll('.stagger');

    // Slide entry animation
    ScrollTrigger.create({
        trigger: slide,
        start: "top 85%",
        onEnter: () => {
            gsap.to(staggers, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            });
            slide.classList.add('active');

            // Special sequence animation for Slide 9 flow
            if (slide.id === 'slide-9') {
                const nodes = slide.querySelectorAll('.flow-node');
                const arrows = slide.querySelectorAll('.flow-arrow');
                const flowTimeline = gsap.timeline({ delay: 0.8 });

                nodes.forEach((node, index) => {
                    flowTimeline.to(node, {
                        borderColor: '#147A44',
                        backgroundColor: 'rgba(20, 122, 68, 0.25)',
                        color: '#F5F5DC',
                        duration: 0.6,
                        onStart: () => {
                            node.classList.add('pulse');
                        }
                    });

                    if (arrows[index]) {
                        flowTimeline.to(arrows[index], {
                            color: '#147A44',
                            opacity: 1,
                            duration: 0.3
                        });
                    }
                });
            }
        },
        once: true
    });
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

// Hover effects for interactive elements
const interactiveElements = document.querySelectorAll('.grid-item, .step, .query-card, table tr, .flow-node, .gold-box');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 3, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
    });
});
