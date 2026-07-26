document.addEventListener('DOMContentLoaded', function() {
    // Eleman kontènè yo
    const registerContainer = document.getElementById('register-container');
    const profileContainer = document.getElementById('profile-container');
    const editContainer = document.getElementById('edit-container');

    // Eleman Pwofil
    const profilePic = document.getElementById('profile-pic');
    const displayFullname = document.getElementById('display-fullname');
    const displayEmail = document.getElementById('display-email');
    const displayFaculte = document.getElementById('display-faculte');
    const displayNiveau = document.getElementById('display-niveau');

    // Bouton aksyon pwofil
    const editBtn = document.getElementById('edit-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // Fòmilè Inskripsyon
    const regForm = document.getElementById('register-form');
    const regFileInput = document.getElementById('reg-photo');
    const regFileName = document.getElementById('reg-file-name');

    // Fòmilè Modifikasyon
    const editForm = document.getElementById('edit-form');
    const editFileInput = document.getElementById('edit-photo');
    const editFileName = document.getElementById('edit-file-name');

    // ----- 1. AJILISANS NON FICHYE -----
    regFileInput.addEventListener('change', () => {
        regFileName.textContent = regFileInput.files[0] ? regFileInput.files[0].name : "Aucun fichier";
    });
    editFileInput.addEventListener('change', () => {
        editFileName.textContent = editFileInput.files[0] ? editFileInput.files[0].name : "Conserver la photo actuelle";
    });

    // ----- 2. TCHÈKE SI DEJA KONEKTE -----
    function checkLoggedIn() {
        const userData = localStorage.getItem('eduEventUser');
        if (userData) {
            showProfile(JSON.parse(userData));
        }
    }

    // ----- 3. ENSKRIPSYON (Kreye Kont) -----
    regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = getRegData();
        if (!data) return;

        const reader = new FileReader();
        reader.readAsDataURL(regFileInput.files[0]);
        reader.onload = function() {
            const student = { ...data, photo: reader.result, inscrit: [] };
            localStorage.setItem('eduEventUser', JSON.stringify(student));
            showProfile(student);
        };
    });

    // Fonksyon pou pran done enskripsyon
    function getRegData() {
        const nom = document.getElementById('reg-nom').value.trim();
        const prenom = document.getElementById('reg-prenom').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const faculte = document.getElementById('reg-faculte').value;
        const niveau = document.getElementById('reg-niveau').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (!nom || !prenom || !email || !faculte || !niveau || !password || !confirm) return alert("Remplissez tous les champs !");
        if (!email.includes('@')) return alert("Email invalide !");
        if (password.length < 6) return alert("Mot de passe min 6 caractères !");
        if (password !== confirm) return alert("Les mots de passe ne correspondent pas !");
        if (!regFileInput.files[0]) return alert("Choisissez une photo !");

        return { nom, prenom, email, faculte, niveau, password };
    }

    // ----- 4. AFICHAGE PWOFIL LA -----
    function showProfile(user) {
        registerContainer.style.display = 'none';
        editContainer.style.display = 'none';
        profileContainer.style.display = 'block';

        displayFullname.textContent = user.nom + " " + user.prenom;
        displayEmail.textContent = user.email;
        displayFaculte.textContent = "Faculté: " + user.faculte;
        displayNiveau.textContent = "Niveau: " + user.niveau;
        profilePic.src = user.photo;
    }

    // ----- 5. OUVRI FÒMILÈ MODIFIKASYON -----
    editBtn.addEventListener('click', function() {
        const user = JSON.parse(localStorage.getItem('eduEventUser'));
        
        // Ranpli fòmilè a ak done aktyèl yo
        document.getElementById('edit-nom').value = user.nom;
        document.getElementById('edit-prenom').value = user.prenom;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-faculte').value = user.faculte;
        document.getElementById('edit-niveau').value = user.niveau;
        document.getElementById('edit-password').value = ""; // Vide modpas pou sekirite

        profileContainer.style.display = 'none';
        editContainer.style.display = 'block';
    });

    // ----- 6. ANILE MODIFIKASYON -----
    cancelEditBtn.addEventListener('click', function() {
        const user = JSON.parse(localStorage.getItem('eduEventUser'));
        showProfile(user); // Retounen nan pwofil
    });

    // ----- 7. SOVE MODIFIKASYON YO -----
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let user = JSON.parse(localStorage.getItem('eduEventUser'));

        // Rekipere nouvo done yo
        user.nom = document.getElementById('edit-nom').value.trim();
        user.prenom = document.getElementById('edit-prenom').value.trim();
        user.email = document.getElementById('edit-email').value.trim();
        user.faculte = document.getElementById('edit-faculte').value;
        user.niveau = document.getElementById('edit-niveau').value;
        
        const newPass = document.getElementById('edit-password').value;
        if(newPass.length > 0) {
            if(newPass.length < 6) return alert("Nouvo modpas la dwe gen 6 karaktè!");
            user.password = newPass;
        }

        // Tcheke si yo te chwazi yon nouvo foto
        if(editFileInput.files && editFileInput.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(editFileInput.files[0]);
            reader.onload = function() {
                user.photo = reader.result;
                saveAndReloadProfile(user);
            };
        } else {
            saveAndReloadProfile(user);
        }
    });

    // Fonksyon pou mete ajou ak rafrechi pwofil la
    function saveAndReloadProfile(user) {
        localStorage.setItem('eduEventUser', JSON.stringify(user));
        alert("modification effectuee!");
        showProfile(user);
    }

    // ----- 8. DEKONEKSYON -----
    logoutBtn.addEventListener('click', function() {
        if(confirm("Voulez-vous vraiment vous déconnecter ?")) {
            localStorage.removeItem('eduEventUser');
            location.reload();
        }
    });

    checkLoggedIn();
});


