function sendLoginRequest(email, password) {
    return fetch('https://iot.waveon.tn/WS_WAVEON/LoginWebGuestService/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La requête a échoué: ' + response.statusText);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erreur lors de la requête de connexion:', error);
        throw error; // Re-lancer l'erreur pour la gérer dans le code appelant
    });
}

// Écouter l'événement de soumission du formulaire de connexion
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    sendLoginRequest(email, password)
    .then(data => {
        console.log('Réponse de connexion reçue :', data);

        if (data.token) {
            console.log('Connexion réussie !');
            document.getElementById('response').innerText = `Connexion réussie !`;

            // Enregistrer les informations dans sessionStorage
            sessionStorage.setItem('idclient', data.idclient);
            sessionStorage.setItem('iduser', data.iduser);
            sessionStorage.setItem('clientname', data.clientname);
            sessionStorage.setItem('token', data.token);

            // Rediriger vers la page de contrôle
            window.location.href = "/Form/Create";
        } else if (data.clientname === "don't exist") {
            console.log('Utilisateur non trouvé.');
            document.getElementById('response').innerText = "Erreur : Utilisateur non trouvé.";
        } else if (!data.email || !data.idclient) {
            console.log('Authentification échouée.');
            document.getElementById('response').innerText = "Erreur : Authentification échouée.";
        } else {
            console.log('Erreur inconnue.');
            document.getElementById('response').innerText = "Erreur inconnue.";
        }
    })
    .catch(error => {
        console.error('Erreur lors de la connexion :', error);
        document.getElementById('response').innerText = `Erreur lors de la connexion: ${error.message}`;
    });
});
