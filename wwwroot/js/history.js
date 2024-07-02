document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.closeButton');

    buttons.forEach(button => {
        button.addEventListener('click', async function() {
            const cin = this.getAttribute('data-cin');

            try {
                const response = await fetch('/Form/SaveExitTime', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ CIN: cin }) // Envoyer un objet JSON avec le CIN
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Heure de sortie enregistrée avec succès:', result);
                    const responseControl = document.getElementById('responseControl');
                
                } else {
                    const errorText = await response.text(); // Utiliser .text() au lieu de .json()
                    console.error('Erreur lors de l\'enregistrement de l\'heure de sortie:', errorText);
                    const responseControl = document.getElementById('responseControl');
                   
                }
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement de l\'heure de sortie:', error);
                const responseControl = document.getElementById('responseControl');
               
            }
        });
    });

    function sendControlMessage(action) {
        const idclient = parseInt(sessionStorage.getItem('idclient'), 10);
        const iduser = parseInt(sessionStorage.getItem('iduser'), 10);
        const clientname = sessionStorage.getItem('clientname');
        const token = sessionStorage.getItem('token');

        let unicast, element, level, actionMessage;

        if (action === 'close') {
            unicast = "8"; // Valeur spécifique pour la fermeture
            element = "8"; // Valeur spécifique pour la fermeture
            level = "32767";
            actionMessage = "fermer";
        } else if (action === 'open') {
            unicast = "22"; // Valeur spécifique pour l'ouverture
            element = "22"; // Valeur spécifique pour l'ouverture
            level = "32767";
            actionMessage = "ouvrir";
        }

        console.log(`Préparation de la requête de contrôle pour "${actionMessage}"...`);
        console.log(`Informations récupérées depuis sessionStorage : idclient=${idclient}, iduser=${iduser}, clientname=${clientname}, token=${token}`);
        console.log(`Détails de la requête : unicast=${unicast}, element=${element}, level=${level}`);

        fetch('https://iot.waveon.tn/WS_WAVEON/sendSecureMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idclient: idclient,
                iduser: iduser,
                clientname: clientname,
                token: token,
                unicast: unicast,
                element: element,
                level: level,
                topic: "",
                message: ""
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La requête a échoué: ' + response.statusText);
            }
            return response.json(); // Assure-toi de parser la réponse JSON
        })
        .then(data => {
            console.log(`Réponse de la requête de contrôle reçue.`);

            const doorStatus = document.getElementById('doorStatus');
            if (doorStatus) {
                if (action === 'close') {
                    console.log('La porte est en train de se fermer.');
                } else if (action === 'open') {
                    doorStatus.innerText = 'La porte est en train de s\'ouvrir.';
                }
            }
        })
        .catch(error => {
            console.error(`Erreur lors de la requête de contrôle pour ${actionMessage}:`, error);
            const doorStatus = document.getElementById('doorStatus');
            if (doorStatus) {
                doorStatus.innerText = `Erreur lors de la requête de contrôle pour ${actionMessage}: ${error.message}`;
            }
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Bouton fermer cliqué.');
            sendControlMessage('close');
        });
    });
});
