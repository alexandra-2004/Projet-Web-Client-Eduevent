const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

fetch("data/evenements.json")
.then(response => response.json())
.then(evenements => {

const evenement = evenements.find(e => e.id == id);

document.getElementById("image").src = evenement.image;
document.getElementById("titre").textContent = evenement.titre;
document.getElementById("description").textContent = evenement.description;
document.getElementById("date").textContent = evenement.date;
document.getElementById("date2").textContent = evenement.date2;
document.getElementById("heure").textContent = evenement.heure;
document.getElementById("heure2").textContent = evenement.heure2;
document.getElementById("lieu").textContent = evenement.lieu;
document.getElementById("lieu2").textContent = evenement.lieu2;
document.getElementById("organisateur").textContent = evenement.organisateur;
document.getElementById("places").textContent = evenement.places;
document.getElementById("im1").src = evenement.im1;
document.getElementById("im2").src = evenement.im2;
document.getElementById("im3").src = evenement.im3;
document.getElementById("nom1").textContent = evenement.nom1;
document.getElementById("nom2").textContent = evenement.nom2;
document.getElementById("nom3").textContent = evenement.nom3;
document.getElementById("specialite1").textContent = evenement.specialite1;
document.getElementById("specialite2").textContent = evenement.specialite2;
document.getElementById("specialite3").textContent = evenement.specialite3;
gererInscription(evenement);

});

function gererInscription(evenement) {
    
    const eventId = evenement.id;
    const btnInscrire = document.getElementById('btn-inscrire');
    const placesElement = document.getElementById('places');
    let messageDiv = document.getElementById('registerMessage');
    if (!messageDiv && btnInscrire) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'registerMessage';
        messageDiv.style.marginTop = '12px';
        messageDiv.style.fontWeight = '600';
        messageDiv.style.textAlign = 'center';
        btnInscrire.parentNode.appendChild(messageDiv);
    }
    function getPlacesRestantes(id) {
        const data = localStorage.getItem('eduevent_places');
        if (!data) return null;
        const places = JSON.parse(data);
        return places[id] !== undefined ? places[id] : null;
    }
    
    function savePlacesRestantes(id, places) {
        const data = localStorage.getItem('eduevent_places');
        const allPlaces = data ? JSON.parse(data) : {};
        allPlaces[id] = places;
        localStorage.setItem('eduevent_places', JSON.stringify(allPlaces));
    }
    
    function getCurrentUser() {
        const userData = localStorage.getItem('eduevent_user');
        if (!userData) return null;
        try { return JSON.parse(userData); } catch { return null; }
    }
    
    function saveCurrentUser(user) {
        localStorage.setItem('eduevent_user', JSON.stringify(user));
    }
    
    function addEventToProfile(id) {
        const profileEvents = JSON.parse(localStorage.getItem('eduevent_profile_events') || '[]');
        if (!profileEvents.includes(parseInt(id))) {
            profileEvents.push(parseInt(id));
            localStorage.setItem('eduevent_profile_events', JSON.stringify(profileEvents));
        }
    }
    let placesRestantes = getPlacesRestantes(eventId);
    if (placesRestantes !== null) {
        placesElement.textContent = placesRestantes;
    } else {
        const htmlPlaces = parseInt(placesElement.textContent);
        if (!isNaN(htmlPlaces)) {
            savePlacesRestantes(eventId, htmlPlaces);
            placesRestantes = htmlPlaces;
        }
    }
    const user = getCurrentUser();
    const isRegistered = user && user.inscriptions && user.inscriptions.includes(parseInt(eventId));
    
    if (isRegistered) {
        btnInscrire.textContent = '✅ Déjà inscrit';
        btnInscrire.style.background = '#22c55e';
        btnInscrire.style.cursor = 'default';
        btnInscrire.disabled = true;
        if (messageDiv) {
            messageDiv.textContent = 'Vous êtes déjà inscrit à cet événement.';
            messageDiv.style.color = '#22c55e';
        }
    }
    if (placesRestantes <= 0) {
        btnInscrire.textContent = '❌ Complet';
        btnInscrire.style.background = '#ef4444';
        btnInscrire.disabled = true;
        btnInscrire.style.cursor = 'not-allowed';
        if (messageDiv) {
            messageDiv.textContent = 'Désolé, toutes les places sont occupées.';
            messageDiv.style.color = '#ef4444';
        }
    }
    
    btnInscrire.addEventListener('click', function() {
        if (this.disabled) return;
        const user = getCurrentUser();
        const isRegistered = user && user.inscriptions && user.inscriptions.includes(parseInt(eventId));
        
        if (isRegistered) {
            if (messageDiv) {
                messageDiv.textContent = 'Vous êtes déjà inscrit à cet événement.';
                messageDiv.style.color = '#22c55e';
            }
            return;
        }
        
        //  verifions la connexion
        if (!user) {
            if (messageDiv) {
                messageDiv.textContent = '🔐 Veuillez vous connecter pour vous inscrire.';
                messageDiv.style.color = '#f59e0b';
            }
            // Redirije vè profil.html
            setTimeout(() => {
                window.location.href = 'profil.html';
            }, 1500);
            return;
        }
    
        const currentPlaces = parseInt(placesElement.textContent);
        if (currentPlaces <= 0) {
            if (messageDiv) {
                messageDiv.textContent = '❌ Désolé, plus de places disponibles.';
                messageDiv.style.color = '#ef4444';
            }
            return;
        }
        
        const newPlaces = currentPlaces - 1;
        placesElement.textContent = newPlaces;
        savePlacesRestantes(eventId, newPlaces);
        const currentUser = getCurrentUser();
        if (currentUser) {
            if (!currentUser.inscriptions) currentUser.inscriptions = [];
            currentUser.inscriptions.push(parseInt(eventId));
            saveCurrentUser(currentUser);
        }

        addEventToProfile(eventId);
        if (messageDiv) {
            messageDiv.textContent = '✅ Inscription réussie ! Vous êtes inscrit(e).';
            messageDiv.style.color = '#22c55e';
        }
        btnInscrire.textContent = '✅ Inscrit';
        btnInscrire.style.background = '#22c55e';
        btnInscrire.disabled = true;
        btnInscrire.style.cursor = 'default';
        
        if (newPlaces <= 0) {
            btnInscrire.textContent = '❌ Complet';
            btnInscrire.style.background = '#ef4444';
            if (messageDiv) {
                messageDiv.textContent = '❌ Plus de places disponibles.';
                messageDiv.style.color = '#ef4444';
            }
        }
    });
}