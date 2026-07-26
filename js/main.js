        // --- MENU TOGGLE ---
        document.addEventListener('DOMContentLoaded', function() {
            const toggle = document.getElementById('menuToggle');
            const navLinks = document.getElementById('navLinks');
            if (toggle && navLinks) {
                toggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    navLinks.classList.toggle('show');
                });
            }
        });

        // --- BOUTON KOPYE ---
        document.addEventListener('DOMContentLoaded', function() {
            const copyBtn = document.getElementById('copyBtn');
            const textToCopy = document.getElementById('text-to-copy');
            const message = document.getElementById('copyMessage');

            if (copyBtn && textToCopy) {
                copyBtn.addEventListener('click', function() {
                    const text = textToCopy.textContent.trim();
                    // Metòd clipboard API
                    navigator.clipboard.writeText(text).then(function() {
                        message.textContent = '✅ Texte copié !';
                        message.style.color = '#22c55e';
                        setTimeout(() => {
                            message.textContent = '';
                        }, 3000);
                    }).catch(function() {
                        // Si clipboard API pa mache, metod alternatif
                        const textarea = document.createElement('textarea');
                        textarea.value = text;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        message.textContent = '✅ Texte copié !';
                        message.style.color = '#22c55e';
                        setTimeout(() => {
                            message.textContent = '';
                        }, 3000);
                    });
                });
            }
        });

        // --- FAQ TOGGLE ---
        function toggleFaq(element) {
            const item = element.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const icon = element.querySelector('i');

            // Fèmen tout lòt FAQ
            document.querySelectorAll('.faq-item').forEach(el => {
                if (el !== item) {
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').style.maxHeight = '0';
                    el.querySelector('.faq-answer').style.padding = '0 20px';
                    el.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle sa a
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '12px 20px';
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0 20px';
                icon.style.transform = 'rotate(0deg)';
            }
        }

        // --- FÒMILÈ KONTAK (validasyon) ---
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contactForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const name = document.getElementById('contactName').value.trim();
                    const email = document.getElementById('contactEmail').value.trim();
                    const subject = document.getElementById('contactSubject').value.trim();
                    const message = document.getElementById('contactMessage').value.trim();

                    // Validasyon simple
                    if (name === '' || email === '' || subject === '' || message === '') {
                        alert('⚠️ Tous les champs sont obligatoires.');
                        return;
                    }

                    // Validasyon email
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(email)) {
                        alert('⚠️ Veuillez entrer une adresse e-mail valide.');
                        return;
                    }

                    alert('✅ Votre message a été envoyé avec succès !');
                    form.reset();
                });
            }
        });