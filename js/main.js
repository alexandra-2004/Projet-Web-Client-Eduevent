
document.addEventListener('DOMContentLoaded', function() {
// menu mobil
    console.log('✅ main.js chaje!');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('show');
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('show')) {
                if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    navLinks.classList.remove('show');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            }
        });
    }

    window.toggleFaq = function(element) {

        const faqItem = element.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = element.querySelector('i');
        
        const isActive = faqItem.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const ans = item.querySelector('.faq-answer');
                const icn = item.querySelector('.faq-question i');
                if (ans) {
                    ans.style.display = 'none';
                    ans.style.maxHeight = '0';
                }
                if (icn) {
                    icn.className = 'fas fa-chevron-down';
                }
            }
        });
        
    
        if (isActive) {
            faqItem.classList.remove('active');
            answer.style.display = 'none';
            answer.style.maxHeight = '0';
            if (icon) {
                icon.className = 'fas fa-chevron-down';
            }
        } else {
            faqItem.classList.add('active');
            answer.style.display = 'block';
            answer.style.maxHeight = answer.scrollHeight + 'px';
            if (icon) {
                icon.className = 'fas fa-chevron-up';
            }
        }
    };

    document.querySelectorAll('.faq-item').forEach(item => {
        const answer = item.querySelector('.faq-answer');
        if (answer) {
            answer.style.display = 'none';
            answer.style.maxHeight = '0';
        }
    });

    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletterEmail.value.trim();

            if (!email) {
                newsletterFeedback.textContent = '⚠️ Veuillez entrer une adresse e-mail.';
                newsletterFeedback.style.color = '#f59e0b';
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                newsletterFeedback.textContent = '⚠️ Adresse e-mail invalide.';
                newsletterFeedback.style.color = '#ef4444';
                return;
            }

            newsletterFeedback.textContent = '✅ Merci ! Vous êtes abonné(e) à la newsletter.';
            newsletterFeedback.style.color = '#22c55e';
            newsletterForm.reset();
            setTimeout(() => {
                newsletterFeedback.textContent = '';
            }, 5000);
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !subject || !message) {
                alert('⚠️ Tous les champs sont obligatoires.');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('⚠️ Veuillez entrer une adresse e-mail valide.');
                return;
            }

            alert('✅ Votre message a été envoyé avec succès !');
            contactForm.reset();
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    console.log('✅ tout fonksyonalite aktive!');
});