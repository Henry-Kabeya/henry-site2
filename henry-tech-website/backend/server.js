const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting pour éviter le spam (5 requêtes par heure par IP)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, 
  message: {
    success: false,
    message: 'Trop de tentatives. Veuillez réessayer dans une heure.'
  }
});

// Configuration du transporteur email (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Mot de passe d'application Gmail
  }
});

// Validation des données
const validationRules = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('postnom').trim().notEmpty().withMessage('Le post-nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('telephone').matches(/^\+?[\d\s-]+$/).withMessage('Numéro de téléphone invalide'),
  body('formation').notEmpty().withMessage('Veuillez choisir une formation')
];

// Route pour l'inscription
app.post('/api/inscription', limiter, validationRules, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const {
      nom,
      postnom,
      prenom,
      lieuNaissance,
      dateNaissance,
      province,
      formation,
      email,
      telephone
    } = req.body;

    // Mapping des formations pour affichage lisible
    const formationsMap = {
      'videosurveillance': 'Installation des systèmes de surveillance',
      'reseaux': 'Création de réseaux professionnels pour PME',
      'maintenance': 'Maintenance Informatique',
      'os': 'Installation OS et mise à jour logiciels',
      'ccna': 'Formation CCNA',
      'bureautique': 'Bureautique (Word, Excel, PowerPoint...)'
    };

    // Email à l'administrateur (Henry)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'henrkabeya26@gmail.com',
      subject: `Nouvelle inscription - ${nom} ${prenom}`,
      html: `
        <h2>Nouvelle demande d'inscription reçue</h2>
        <table border="1" cellpadding="10" style="border-collapse: collapse; font-family: Arial;">
          <tr style="background-color: #f0f0f0;">
            <td><strong>Champ</strong></td>
            <td><strong>Valeur</strong></td>
          </tr>
          <tr><td><strong>NOM</strong></td><td>${nom}</td></tr>
          <tr><td><strong>POST NOM</strong></td><td>${postnom}</td></tr>
          <tr><td><strong>PRÉNOM</strong></td><td>${prenom}</td></tr>
          <tr><td><strong>LIEU DE NAISSANCE</strong></td><td>${lieuNaissance}</td></tr>
          <tr><td><strong>DATE DE NAISSANCE</strong></td><td>${dateNaissance}</td></tr>
          <tr><td><strong>PROVINCE</strong></td><td>${province}</td></tr>
          <tr><td><strong>FORMATION CHOISIE</strong></td><td style="color: #1e3a8a; font-weight: bold;">${formationsMap[formation] || formation}</td></tr>
          <tr><td><strong>E-MAIL</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td><strong>TÉLÉPHONE</strong></td><td><a href="tel:${telephone}">${telephone}</a></td></tr>
        </table>
        <p style="margin-top: 20px; color: #666;"><em>Ce message a été envoyé automatiquement depuis le site Henry-Tech Network Solutions.</em></p>
      `
    };

    // Email de confirmation au client
    const clientMailOptions = {
      from: `"Henry-Tech Network Solutions" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirmation de votre inscription - Henry-Tech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Bonjour ${prenom} ${nom},</h2>
          <p>Nous avons bien reçu votre demande d'inscription pour la formation :</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <strong>${formationsMap[formation] || formation}</strong>
          </div>
          <p>Nous allons étudier votre demande et vous contacterons très prochainement au numéro <strong>${telephone}</strong> pour finaliser votre inscription.</p>
          <h3 style="color: #1e3a8a; margin-top: 30px;">Récapitulatif de vos informations :</h3>
          <ul style="line-height: 1.8;">
            <li><strong>Nom complet :</strong> ${nom} ${postnom} ${prenom}</li>
            <li><strong>Email :</strong> ${email}</li>
            <li><strong>Téléphone :</strong> ${telephone}</li>
            <li><strong>Province :</strong> ${province}</li>
          </ul>
          <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <p style="margin: 0;"><strong>Besoin d'aide ?</strong></p>
            <p style="margin: 5px 0 0 0;">Contactez-nous par WhatsApp : +243 970 710 710</p>
            <p style="margin: 5px 0 0 0;">Email : henrkabeya26@gmail.com</p>
          </div>
          <p style="margin-top: 30px; color: #666; font-size: 0.9em;">Cordialement,<br><strong>L'équipe Henry-Tech Network Solutions</strong><br><em>La fiabilité au cœur du réseau</em></p>
        </div>
      `
    };

    // Envoyer les deux emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(clientMailOptions);

    res.status(200).json({
      success: true,
      message: 'Inscription envoyée avec succès ! Vérifiez votre email pour la confirmation.'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du formulaire. Veuillez réessayer.'
    });
  }
});

// Route de santé pour vérifier si le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });
}

app.listen(PORT, () => {
  console.log(`Serveur Henry-Tech démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});
