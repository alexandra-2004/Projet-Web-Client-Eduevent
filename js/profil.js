document.addEventListener('DOMContentLoaded', function() {

    const registerContainer = document.getElementById('register-container');
    const loginContainer = document.getElementById('login-container');
    const profileContainer = document.getElementById('profile-container');
    const editContainer = document.getElementById('edit-container');

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const editForm = document.getElementById('edit-form');

    const switchToLogin = document.getElementById('switch-to-login');
    const switchToRegister = document.getElementById('switch-to-register');
    const editBtn = document.getElementById('edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const logoutBtn = document.getElementById('logout-btn');


    function getCurrentUser() {
        const data = localStorage.getItem('eduevent_user');
        if (!data) return null;
        try { return JSON.parse(data); } catch { return null; }
    }

    function saveCurrentUser(user) {
        localStorage.setItem('eduevent_user', JSON.stringify(user));
    }

    function getProfileEvents() {
        const data = localStorage.getItem('eduevent_profile_events');
        if (!data) return [];
        try { return JSON.parse(data); } catch { return []; }
    }

    function saveProfileEvents(events) {
        localStorage.setItem('eduevent_profile_events', JSON.stringify(events));
    }

    function getPlacesRestantes(eventId) {
        const data = localStorage.getItem('eduevent_places');
        if (!data) return null;
        const places = JSON.parse(data);
        return places[eventId] !== undefined ? places[eventId] : null;
    }

    // AFICHE PROFIL

    function showProfile() {
        const user = getCurrentUser();

        // BUG FIX: on verifye si moun nan konekte tout bon (connected === true)
        // avan, sèl kondisyon an te "if (!user)" e sa te fè bouton
        // Déconnexion pa t janm mennen retounen sou fòm lan
        if (!user || !user.connected) {
            registerContainer.style.display = user ? 'none' : 'block';
            loginContainer.style.display = user ? 'block' : 'none';
            profileContainer.style.display = 'none';
            editContainer.style.display = 'none';
            return;
        }

        registerContainer.style.display = 'none';
        loginContainer.style.display = 'none';
        profileContainer.style.display = 'block';
        editContainer.style.display = 'none';

        // Mles infos

        document.getElementById('display-fullname').textContent = user.prenom + ' ' + user.nom;
        document.getElementById('display-email').innerHTML = '<i class="fas fa-envelope"></i> ' + user.email;
        document.getElementById('display-faculte').innerHTML = '<i class="fas fa-university"></i> <strong>Faculté:</strong> ' + user.faculte;
        document.getElementById('display-niveau').innerHTML = '<i class="fas fa-graduation-cap"></i> <strong>Niveau:</strong> ' + user.niveau;

        // im
        const profilePic = document.getElementById('profile-pic');
        if (user.photo) {
            profilePic.src = user.photo;
        } else {
            profilePic.src = 'images/default-avatar.png';
        }

        // Afichage
        afficherEvenements();
    }

function afficherEvenements() {
    const eventsList = document.getElementById('my-events-list');
    const eventIds = getProfileEvents();

    if (eventIds.length === 0) {
        eventsList.innerHTML = '<p class="empty-events">Aucun événement pour le moment.</p>';
        return;
    }

    // chajman des donnees

    fetch('data/evenements.json')
        .then(response => response.json())
        .then(allEvents => {
            const userEvents = allEvents.filter(e => eventIds.includes(e.id));

            if (userEvents.length === 0) {
                eventsList.innerHTML = '<p class="empty-events">Aucun événement pour le moment.</p>';
                return;
            }

            eventsList.innerHTML = userEvents.map(e => `
                <div class="event-item">
                    <a href="details.html?id=${e.id}" class="event-link">
                        <div class="event-item-info">
                            <h4>📌 ${e.titre}</h4>
                            <p><i class="fas fa-calendar-day"></i> ${e.date}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${e.lieu}</p>
                        </div>
                    </a>
                </div>
            `).join('');
        })
        .catch(() => {
            eventsList.innerHTML = '<p class="empty-events">Erreur lors du chargement des événements.</p>';
        });
}

    // INSCRIPTION

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nom = document.getElementById('reg-nom').value.trim();
            const prenom = document.getElementById('reg-prenom').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const faculte = document.getElementById('reg-faculte').value;
            const niveau = document.getElementById('reg-niveau').value;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            const photoInput = document.getElementById('reg-photo');
            const messageDiv = document.getElementById('reg-message');

            // Validation

            if (!nom || !prenom || !email || !faculte || !niveau || !password || !confirm) {
                messageDiv.textContent = '⚠️ Tous les champs sont obligatoires.';
                messageDiv.style.color = '#ef4444';
                return;
            }

            if (password.length < 6) {
                messageDiv.textContent = '⚠️ Le mot de passe doit avoir au moins 6 caractères.';
                messageDiv.style.color = '#ef4444';
                return;
            }

            if (password !== confirm) {
                messageDiv.textContent = '⚠️ Les mots de passe ne correspondent pas.';
                messageDiv.style.color = '#ef4444';
                return;
            }

            // Foto
            let photoData = null;
            if (photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoData = e.target.result;
                    creerUtilisateur(nom, prenom, email, faculte, niveau, password, photoData, messageDiv);
                };
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                creerUtilisateur(nom, prenom, email, faculte, niveau, password, null, messageDiv);
            }
        });
    }

    function creerUtilisateur(nom, prenom, email, faculte, niveau, password, photo, messageDiv) {
        // Verifye si email deja itilize
        const existing = getCurrentUser();
        if (existing && existing.email === email) {
            messageDiv.textContent = '⚠️ Cet email est déjà utilisé.';
            messageDiv.style.color = '#ef4444';
            return;
        }

        const user = {
            nom: nom,
            prenom: prenom,
            email: email,
            faculte: faculte,
            niveau: niveau,
            password: password,
            photo: photo,
            inscriptions: [],
            connected: true
        };

        saveCurrentUser(user);

        // BUG FIX: 'eduevent_profile_events' pa t atache a yon itilizatè
        // presi, kidonk yon nouvo kont te ka eritye evènman ansyen
        // itilizatè a. Nou videyifye lis la pou chak nouvo enskripsyon.
        saveProfileEvents([]);

        messageDiv.textContent = '✅ Inscription réussie ! Bienvenue ' + prenom + ' !';
        messageDiv.style.color = '#22c55e';

        setTimeout(() => {
            showProfile();
        }, 1000);
    }

    // CONNEXION

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const messageDiv = document.getElementById('login-message');

            if (!email || !password) {
                messageDiv.textContent = '⚠️ Veuillez remplir tous les champs.';
                messageDiv.style.color = '#ef4444';
                return;
            }

            const user = getCurrentUser();
            if (!user || user.email !== email || user.password !== password) {
                messageDiv.textContent = '❌ Email ou mot de passe incorrect.';
                messageDiv.style.color = '#ef4444';
                return;
            }

            user.connected = true;
            saveCurrentUser(user);
            messageDiv.textContent = '✅ Connexion réussie !';
            messageDiv.style.color = '#22c55e';

            setTimeout(() => {
                showProfile();
            }, 1000);
        });
    }

    // MODIFICATION PROFIL

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const user = getCurrentUser();
            if (!user) return;

            document.getElementById('edit-nom').value = user.nom || '';
            document.getElementById('edit-prenom').value = user.prenom || '';
            document.getElementById('edit-email').value = user.email || '';
            document.getElementById('edit-faculte').value = user.faculte || '';
            document.getElementById('edit-niveau').value = user.niveau || '';
            document.getElementById('edit-password').value = '';

            profileContainer.style.display = 'none';
            editContainer.style.display = 'block';
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            showProfile();
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const user = getCurrentUser();
            if (!user) return;

            const nom = document.getElementById('edit-nom').value.trim();
            const prenom = document.getElementById('edit-prenom').value.trim();
            const email = document.getElementById('edit-email').value.trim();
            const faculte = document.getElementById('edit-faculte').value;
            const niveau = document.getElementById('edit-niveau').value;
            const password = document.getElementById('edit-password').value;
            const photoInput = document.getElementById('edit-photo');
            const messageDiv = document.getElementById('edit-message');

            if (!nom || !prenom || !email || !faculte || !niveau) {
                messageDiv.textContent = '⚠️ Tous les champs sont obligatoires.';
                messageDiv.style.color = '#ef4444';
                return;
            }

            user.nom = nom;
            user.prenom = prenom;
            user.email = email;
            user.faculte = faculte;
            user.niveau = niveau;

            if (password.length >= 6) {
                user.password = password;
            }

            if (photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    user.photo = e.target.result;
                    saveCurrentUser(user);
                    messageDiv.textContent = '✅ Profil modifié avec succès !';
                    messageDiv.style.color = '#22c55e';
                    setTimeout(() => showProfile(), 1000);
                };
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                saveCurrentUser(user);
                messageDiv.textContent = '✅ Profil modifié avec succès !';
                messageDiv.style.color = '#22c55e';
                setTimeout(() => showProfile(), 1000);
            }
        });
    }

    // DECONNEXION

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            const user = getCurrentUser();
            if (user) {
                user.connected = false;
                saveCurrentUser(user);
            }
            showProfile();
        });
    }


    // fomule gestion

    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
            profileContainer.style.display = 'none';
            editContainer.style.display = 'none';
        });
    }

    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            registerContainer.style.display = 'block';
            loginContainer.style.display = 'none';
            profileContainer.style.display = 'none';
            editContainer.style.display = 'none';
        });
    }

    // BUG FIX: afichaj non fichye foto a lè moun chwazi youn
    // (pa t gen okenn "listener" sou input yo avan, kidonk tèks la
    // te toujou rete sou "Aucun fichier")
    const regPhotoInput = document.getElementById('reg-photo');
    const regFileName = document.getElementById('reg-file-name');
    if (regPhotoInput && regFileName) {
        regPhotoInput.addEventListener('change', function() {
            if (regPhotoInput.files && regPhotoInput.files[0]) {
                regFileName.textContent = regPhotoInput.files[0].name;
            } else {
                regFileName.textContent = 'Aucun fichier';
            }
        });
    }

    const editPhotoInput = document.getElementById('edit-photo');
    const editFileName = document.getElementById('edit-file-name');
    if (editPhotoInput && editFileName) {
        editPhotoInput.addEventListener('change', function() {
            if (editPhotoInput.files && editPhotoInput.files[0]) {
                editFileName.textContent = editPhotoInput.files[0].name;
            } else {
                editFileName.textContent = 'Conserver la photo actuelle';
            }
        });
    }

    // mobil gestion
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }


    showProfile();

    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect) {
        loginContainer.style.display = 'block';
        registerContainer.style.display = 'none';
        profileContainer.style.display = 'none';
        editContainer.style.display = 'none';
    }

    console.log('✅ profil.js chargé — tout fonctionne !');
});
