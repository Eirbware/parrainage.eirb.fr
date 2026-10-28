## Présentation
Ce projet a été écrit pour la soirée de parrainage de l'Enseirb-Matmeca.
Il permet de pouvoir, simplement, déployer un service contenant : 
    - un frontend qui permet de choisir la filière de la personne ayant acheté quelque chose.
    - Un backend, qui contient un système de login CAS, afin que seuls les personnes autorisés puissent ajouter des points aux filières.
    - Une api qui permet de connecter un jeu vidéo (utile pour GCC) aux résultats des achats.

## Déploiement
Afin de lancer ce service: 
    - cloner le répo actuel, 
    - remplir le fichier *process.env* situé dans le répertoire /backend. Dans celui-ci, vous devez entrer l'url du frontend, le *CLIENT_ID* ainsi que le *CLIENT_SECRET* pour OIDC (rapprochez-vous de Eirbware si vous ne disposez pas de ces informations). Vous devez générer un hash pour les cookies de session (de préférence quelque chose en SHA256). 
    - entrer les logins EirbConnect des personnes autorisées à changer les points.
    - lancer *docker compose up --build*.

## Notes
    - En local, vous pouvez mettre en *FRONTEND_IP* http://localhost:8080' et acceder au projet à l'adresse 'http://localhost'.
    - En prod, vous pouvez directement modifier les fichiers *perms.json* et *data.json* sans avoir à rentrer dans le docker, ces fichiers sont directement mappés pour être update dans le docker.

## API
    - La route */api/getData* permet d'avoir les valeurs des sommes cumulées pour chaque filière. Utile pour l'intégration du jeu vidéo de GCC.

## Outro
Ce projet a été écrit en quelques jours, le code n'est pas parfait mais il est fonctionnel et suffisant pour son utilisation actuelle.
