# 📱 PROXI-PHONE Vitré — Site Web Officiel

> **Site vitrine & plateforme de conversion pour l'atelier de réparation de smartphones, tablettes et ordinateurs à Vitré (35500).**

---

## 📌 Présentation du Projet

**PROXI-PHONE** est un atelier indépendant spécialisé dans la réparation express d'appareils mobiles et le dépannage informatique, situé en plein cœur du centre historique de Vitré (**26 Rue de la Poterie, 35500 Vitré**).

Ce site web a été conçu avec une approche **Mobile-First**, ultra-performante et optimisée pour la conversion locale. Il offre aux clients une expérience fluide pour consulter les tarifs, connaître les pannes prises en charge, vérifier la disponibilité des accessoires et demander un devis gratuit en ligne.

---

## 🚀 Caractéristiques & Fonctionnalités Clés

### 1. 🕒 Statut & Horaires en Temps Réel
* **Calculateur automatique d'ouverture** : le statut s'actualise en direct dans l'en-tête et les fiches de contact (*« Ouvert • Ferme à 12h00 »*, *« Ouvert • Ferme à 18h00 »*, *« Fermé • Ouvre demain à 10h00 »*, etc.).
* **Prise en compte des créneaux doubles** (Mardi au Samedi : 10h–12h / 15h–18h).
* **Mise en valeur du jour actuel** : la ligne du jour est automatiquement surlignée dans les tableaux d'horaires de chaque page.

### 2. 📲 Expérience Utilisateur & Navigation Mobile
* **Menu déroulant tactile** : navigation principale avec sous-menus thématiques clairs (*Accueil*, *Services*, *Boutique*).
* **Barre d'action fixe mobile (Sticky CTA)** : accès instantané en 1 clic pour téléphoner directement à l'atelier (`06 37 98 13 88`) ou lancer l'itinéraire GPS Google Maps.
* **100% Responsive & Zéro débordement** : structure testée et validée sur toutes les résolutions mobiles (de 320 px à plus de 1920 px) avec défilement vertical fluide sans dérive latérale.
* **Bouton de retour en haut** discret et accessible.

### 3. 🎨 Identité Visuelle & Iconographie Sur-Mesure
* **Charte graphique professionnelle** : alliance du Bleu Royal (`#0d47a1`, `#082b66`) et d'un Jaune Ambré chaleureux (`#f59e0b`).
* **Intégration du logo officiel** en plusieurs déclinaisons adaptées aux formats d'écrans (compact pour header, haute lisibilité pour le footer et badges d'atelier).
* **Palette de pictogrammes personnalisés (1:1)** : 60 pictogrammes carrés haute définition intégrés sans aucune bande blanche pour illustrer chaque type de panne et d'accessoire.

### 4. 📝 Devis Gratuit & Interactif
* Formulaire de demande de devis dynamique ([devis.html](devis.html)).
* Sélecteur visuel d'équipements (*Smartphone*, *Tablette / iPad*, *PC Portable*, *PC Fixe / Mac*).
* Liste déroulante des pannes fréquentes et champs de contact avec validation immédiate côté client.
* Encart direct avec numéro de téléphone pour les urgences.

### 5. 🔍 Référencement Naturel & SEO Local
* **Microdonnées Schema.org (JSON-LD)** configurées pour Google (type `LocalBusiness`, adresse physique, géolocalisation, plage d'horaires complète).
* Balises Open Graph & Twitter Cards pour un partage optimal sur les réseaux sociaux.
* Structure sémantique HTML5 soignée (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).

---

## 📂 Structure des Pages

| Page | Fichier | Description |
| :--- | :--- | :--- |
| **Accueil** | [`index.html`](index.html) | Vue d'ensemble, pannes courantes, engagements atelier, aperçu des accessoires, avis clients Google et plan d'accès. |
| **Services & Réparations** | [`services.html`](services.html) | Détail des interventions : écrans, batteries, connecteurs, désoxydation, microsoudure, tablettes et maintenance PC/Mac. |
| **Boutique & Accessoires** | [`accessoires.html`](accessoires.html) | Gammes disponibles immédiatement en rayon (verres trempés 9H avec pose offerte en boutique, coques antichoc, câbles, chargeurs, supports). |
| **Tarifs & Devis** | [`devis.html`](devis.html) | Formulaire interactif de demande de devis en ligne et rappel des engagements qualité. |
| **Contact & Accès** | [`contact.html`](contact.html) | Coordonnées directes, horaires détaillés, plan interactif Google Maps et formulaire de message fonctionnel. |

---

## 📁 Arborescence du Projet

```text
site web Proxi_Phone/V1 la meilleur/
├── index.html                  # Page d'accueil principale
├── services.html               # Page des prestations de réparation
├── accessoires.html            # Page boutique et protections
├── devis.html                  # Formulaire de devis en ligne
├── contact.html                # Informations d'accès et horaires
├── send-mail.php               # Script PHP autonome d'envoi du formulaire de contact (OVH)
├── README.md                   # Documentation du projet
│
└── assets/
    ├── css/
    │   └── style.css           # Feuille de style unique et responsive (Vanilla CSS)
    ├── js/
    │   └── main.js             # Logique applicative (horaires en direct, menu mobile, envoi AJAX contact)
    ├── logo/                   # Déclinaisons officielles du logo PROXI-PHONE
    │   ├── logo-compact-horizontal.png
    │   ├── logo-icone-engrenage.png
    │   └── ...
    └── pictogrammes/           # Pictogrammes utilisés (carrés 1:1)
        ├── picto-ecran-casse.png
        ├── picto-batterie.png
        ├── ...
        └── bibliotheque/       # Pictogrammes disponibles non utilisés pour l'instant

_sources/                       # Palettes d'origine (hors déploiement)
.agents/skills/proxi-phone-site/  # Skill assistant IA + scripts/verify.js (contrôle automatique)
```

---

## 🛠️ Technologies Utilisées

* **HTML5 Sémantique** : balisage moderne, accessible et optimisé SEO.
* **CSS3 Vanilla** :
  * Variables CSS (`:root`) pour une gestion centralisée de la charte.
  * Flexbox & CSS Grid adaptatifs.
  * Transitions matérielles douces et animations d'interaction.
  * Zéro framework externe (aucun Bootstrap ou Tailwind nécessaire, garantissant légèreté et contrôle total).
* **JavaScript ES6+ (Vanilla JS)** :
  * Horloge dynamique de calcul des plages d'ouverture hebdomadaires.
  * Gestion du menu burger mobile accessible (`aria-expanded`).
  * Envoi dynamique en AJAX (`fetch`) du formulaire de contact avec gestion des retours utilisateur.
* **PHP (send-mail.php)** : script d'envoi d'e-mails léger, sécurisé (pot de miel anti-spam honeypot, validation regex, encodage UTF-8) compatible avec l'hébergement mutualisé OVH (Start 100M).

---

## 💡 Hébergement & Déploiement

Le site est ultra-léger (~7,2 Mo au total, dont ~5 Mo de logos et pictogrammes haute qualité), ce qui est **100% compatible avec l'offre OVH Start 100M** (100 Mo inclus avec le nom de domaine).

* **Déploiement OVH** :
  1. Se connecter en SFTP / FTP avec FileZilla aux identifiants fournis par OVH.
  2. Déposer l'ensemble des fichiers à la racine du dossier `www/` :
     * `index.html`, `services.html`, `accessoires.html`, `devis.html`, `contact.html`
     * `send-mail.php`
     * Le dossier `assets/`
  3. Le formulaire de contact envoie automatiquement les messages vers `sas-proxiphone@outlook.com`.

---

## 📞 Informations de l'Atelier

* **Enseigne** : PROXI-PHONE
* **Adresse** : 26 Rue de la Poterie, 35500 Vitré
* **Téléphone direct** : [06 37 98 13 88](tel:0637981388)
* **Email** : [sas-proxiphone@outlook.com](mailto:sas-proxiphone@outlook.com)
* **Horaires d'ouverture** :
  * Mardi à Samedi : 10h00 – 12h00 / 15h00 – 18h00
  * Lundi & Dimanche : Fermé
