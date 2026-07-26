const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

fetch("data/evenements.json")
.then(response => response.json())
.then(evenements =>{

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

});





