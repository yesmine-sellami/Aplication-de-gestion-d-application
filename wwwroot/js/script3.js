document.addEventListener('DOMContentLoaded', function() {
    const openButton = document.getElementById('openButton');
    const visitorForm = document.getElementById('visitorForm');

    if (visitorForm) {
        visitorForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Pour éviter la soumission du formulaire par défaut

            const cin = document.getElementById('CIN').value;
            const nom = document.getElementById('Nom').value;
            const prénom = document.getElementById('Prénom').value;
            const société = document.getElementById('Société').value;
            const butVisite = document.getElementById('ButVisite').value;

            let isValid = true;

            // Réinitialiser les messages d'erreur
            document.getElementById('CINError').innerText = '';
            document.getElementById('NomError').innerText = '';
            document.getElementById('PrénomError').innerText = '';
            document.getElementById('SociétéError').innerText = '';
            document.getElementById('ButVisiteError').innerText = '';

            // Vérifier que tous les champs sont remplis
            if (!cin) {
                document.getElementById('CINError').innerText = 'Le champ CIN est obligatoire.';
                isValid = false;
            }
            if (!nom) {
                document.getElementById('NomError').innerText = 'Le champ Nom est obligatoire.';
                isValid = false;
            }
            if (!prénom) {
                document.getElementById('PrénomError').innerText = 'Le champ Prénom est obligatoire.';
                isValid = false;
            }
            if (!société) {
                document.getElementById('SociétéError').innerText = 'Le champ Société est obligatoire.';
                isValid = false;
            }
            if (!butVisite) {
                document.getElementById('ButVisiteError').innerText = 'Le champ But de la visite est obligatoire.';
                isValid = false;
            }

            if (isValid) {
                const visitor = {
                    CIN: cin,
                    Nom: nom,
                    Prénom: prénom,
                    Société: société,
                    ButVisite: butVisite
                };

                try {
                    const response = await fetch('/Form/Create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(visitor)
                    });

                    if (response.ok) {
                        document.getElementById('CIN').value = '';
                        document.getElementById('Nom').value = '';
                        document.getElementById('Prénom').value = '';
                        document.getElementById('Société').value = '';
                        document.getElementById('ButVisite').value = '';
                        const result = await response.json();
                        console.log('Visiteur traité avec succès:', result);
                    } else {
                        const errorText = await response.text();
                        console.error('Erreur lors du traitement:', errorText);
                    }
                } catch (error) {
                    console.error('Erreur lors du traitement:', error);
                }
            }
        });
    }

    function sendControlMessage(action) {
        const idclient = parseInt(sessionStorage.getItem('idclient'), 10);
        const iduser = parseInt(sessionStorage.getItem('iduser'), 10);
        const clientname = sessionStorage.getItem('clientname');
        const token = sessionStorage.getItem('token');
        
        let unicast, element, level, actionMessage;

        if (action === 'close') {
            unicast = "22";
            element = "22";
            level = "32767";
            actionMessage = "fermer";
        } else if (action === 'open') {
            unicast = "8";
            element = "8";
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
                   console.log( 'La porte est en train de se fermer.');
                } else if (action === 'open') {
                    console.log( 'La porte est en train de s\'ouvrir.');
                }
            }
        })
        .catch(error => {
            console.error(`Erreur lors de la requête de contrôle pour ${actionMessage}:`, error);
            const doorStatus = document.getElementById('doorStatus');
            
        });
    }

    if (openButton) {
        openButton.addEventListener('click', function() {
            console.log('Bouton ouvrir cliqué.');
            sendControlMessage('open');
        });
    }
});