[README.md](https://github.com/user-attachments/files/24968776/README.md)
# Henry-Tech Network Solutions - Site Web Complet

Ce projet contient le site web complet avec backend pour Henry-Tech Network Solutions.

## Structure du Projet

```
henry-tech-website/
├── backend/           # Serveur Node.js/Express
│   ├── .env.example   # Exemple de configuration
│   ├── .gitignore     # Fichiers à ignorer par Git
│   ├── package.json   # Dépendances Node.js
│   └── server.js      # Code du serveur
├── frontend/          # Site web HTML/CSS/JS
│   └── index.html     # Page principale
└── README.md          # Ce fichier
```

## Prérequis

- Node.js installé (https://nodejs.org)
- Un compte Gmail
- Connexion Internet

## Installation Étape par Étape

### 1. Configuration Gmail (Obligatoire pour les emails)

1. Allez sur https://myaccount.google.com
2. Cliquez sur "Sécurité"
3. Activez la "Vérification en 2 étapes" (si ce n'est pas déjà fait)
4. Cherchez "Mots de passe d'application" (App Passwords)
5. Générez un nouveau mot de passe d'application
6. Notez ce mot de passe (16 caractères sans espaces)

### 2. Installation du Backend

Ouvrez un terminal (Invite de commandes) et exécutez :

```bash
cd backend
npm install
```

### 3. Configuration du Backend

1. Copiez le fichier `.env.example` et renommez-le `.env`
2. Ouvrez le fichier `.env` avec un éditeur de texte
3. Remplacez :
   - `votre-email@gmail.com` par votre vraie adresse Gmail
   - `votre-mot-de-passe-app-16-caracteres` par le mot de passe d'application généré à l'étape 1

### 4. Lancement du Backend

Dans le terminal, toujours dans le dossier `backend` :

```bash
npm start
```

Vous devriez voir : `Serveur Henry-Tech démarré sur le port 3000`

**Laissez ce terminal ouvert !**

### 5. Test du Site Web

1. Ouvrez le fichier `frontend/index.html` dans votre navigateur
2. Remplissez le formulaire d'inscription
3. Cliquez sur "ENVOYER"
4. Vérifiez que vous recevez les emails

## Déploiement en Production (mettre en ligne)

Pour mettre le site en ligne, vous devez :

1. Déployer le backend sur Railway, Render, ou Heroku
2. Mettre à jour l'URL dans `frontend/index.html` (ligne : `const API_URL = '...'`)
3. Déployer le frontend sur Netlify, Vercel, ou GitHub Pages

## Fonctionnalités

- ✅ Site web responsive (mobile et desktop)
- ✅ Formulaire d'inscription avec validation
- ✅ Envoi automatique d'emails à henrkabeya26@gmail.com
- ✅ Email de confirmation au client
- ✅ Protection anti-spam (5 tentatives max par heure)
- ✅ Bouton WhatsApp intégré
- ✅ Design professionnel

## Support

En cas de problème :
1. Vérifiez que le backend est bien lancé
2. Vérifiez votre configuration Gmail
3. Consultez les logs dans le terminal

**Contact :** henrkabeya26@gmail.com
