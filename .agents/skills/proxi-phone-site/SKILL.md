---
name: proxi-phone-site
description: Connaissance condensée du site vitrine PROXI-PHONE Vitré (HTML/CSS/JS vanilla, 5 pages). À utiliser pour TOUTE modification, ajout, correction responsive ou vérification de ce site, afin d'éviter de relire les gros fichiers (style.css ~2000 lignes, index.html ~850 lignes).
---

# PROXI-PHONE Vitré — guide du projet

Racine du site = dossier contenant `index.html` (workspace `V1 la meilleur`). Travailler UNIQUEMENT ici. Pas de framework, pas de build, pas de git : on édite les fichiers directement.

## Règles d'économie de tokens (à suivre en priorité)
1. **Ne jamais lire en entier** `assets/css/style.css`, `index.html`, `services.html`. Localiser d'abord : `Select-String -Path assets\css\style.css -Pattern 'nom-classe' -Context 3` ou lister les sections CSS (bannières `/* === TITRE === */`) avec `Select-String -Pattern '^   [A-Z]'`, puis `view_file` sur une plage de ~40 lignes.
2. Éditer par petits blocs (`replace_file_content`) ; ne pas réécrire un fichier.
3. Un changement de navigation/footer/horaires se répète dans les **5 pages** : le faire avec un petit script node (remplacement global) plutôt que 5 lectures.
4. Ne pas relire ce que ce skill décrit déjà. Ne pas lister `assets/pictogrammes` (voir mapping ci-dessous).
5. Valider avec `node .agents/skills/proxi-phone-site/scripts/verify.js` (sortie courte `OK/KO` par page et par largeur), pas avec des captures.

## Identité & contenu métier
- Enseigne **PROXI-PHONE**, 26 Rue de la Poterie, 35500 Vitré — tél. `06 37 98 13 88` (`tel:0637981388`) — email : `sas-proxiphone@outlook.com`.
- Horaires : lundi & dimanche fermé ; **mardi au samedi 10h–12h & 15h–18h** (plus de nocturne à 19h). Définis dans `initStoreStatus()` (`schedule`, dimanche=0) ET écrits en dur dans `contact.html` (tableau `.hours-table`, `data-day`) et JSON-LD de `index.html` : modifier les 3 endroits ensemble.
- Pièces & consommables : pas de garantie contractuelle sur les consommables d'usure (notamment batteries). Remplacer les termes de garantie par « pièces testées & certifiées » ou « intervention soignée ». Plus de mention de « film hydrogel » (remplacé par verres trempés 9H).
- Formulaire de contact (`contact.html`) : géré via AJAX `fetch('send-mail.php')` avec fallback direct téléphone/email (`sas-proxiphone@outlook.com`).
- Barre bleue du haut (`.topbar`) : adresse + statut d'ouverture, **centrés, SANS numéro de téléphone** (choix client).

## Fichiers
```
index / services / accessoires / devis / contact .html
assets/css/style.css        feuille unique (variables, composants, media queries en fin de fichier)
assets/js/main.js           chargé avec defer ; init au DOMContentLoaded
assets/logo/                TOUS les logos : NE JAMAIS SUPPRIMER (choix client)
assets/images/store-preview.png
assets/pictogrammes/        pictos UTILISÉS (PNG carrés 1:1)
assets/pictogrammes/bibliotheque/   pictos disponibles non utilisés (à déplacer ici/là au besoin)
_sources/                   palettes JPG d'origine (hors déploiement)
.agents/skills/proxi-phone-site/    ce skill
```
Structure commune de chaque page : `.topbar` → `header.site-header` (logo + `ul.nav-links` avec menus déroulants `.has-dropdown` + `.header-cta-group` avec bouton appel + `.menu-toggle`) → contenu → `footer.site-footer` → `.mobile-sticky-bar` (appel + itinéraire, visible < 768px) → bouton `.scroll-top-btn` → `<script src="assets/js/main.js" defer>`.

## main.js (fonctions)
`initMobileMenu` (burger, ré-injecte l'icône en innerHTML : le clic utilise `stopPropagation` + `pointer-events:none` sur le svg — ne pas casser), `initStoreStatus` (badges `.status-badge.open|closed` + ligne `tr.today`), `initDevisForm` (devis.html, `escapeHtml`), `initScrollTop`, `highlightActiveNav`.

## Logos utilisés
Header : `logo-compact-horizontal.png` (img `.logo-header-img`, width/height 419x163). Footer : `logo-complet-blanc-web.png` (version allégée 440px de `logo-complet-blanc.png`). Favicon : `favicon.png`. Badge atelier : `logo-icone-engrenage.png`.

## Pictogrammes (dans `assets/pictogrammes/`, préfixe `picto-`)
Réparation : ecran-casse, batterie, connecteur-charge, deoxydation-eau, module-camera, haut-parleur-micro, vitre-arriere, microsoudure, diagnostic, reparation-tablette. Informatique : reparation-pc, disque-ssd, dalle-pc, clavier-pc, ventilateur-thermique, antivirus, reinstallation-os. Accessoires : film-hydrogel, verre-trempe, coque-antichoc, bloc-charge, cable-usb, casque-audio, cle-usb, support-voiture. Site : site-smartphone, site-express, site-localisation, site-contact, site-horaires, site-qualite, site-tarifs, site-technicien, site-garantie.
Format : `<img src="assets/pictogrammes/picto-xxx.png" alt="...">` dans un conteneur carré, CSS `object-fit: cover` (jamais `contain` → bandes blanches). Conteneurs : `.issue-card-icon`, `.feature-box-icon`, `.step-card-picto`, `.product-image-container` (110px), `.access-icon`.
**Exception client :** le sélecteur d'appareil de `devis.html` (`.device-picker-grid`) et la section Tarifs & devis utilisent des **SVG**, pas de pictos.

## CSS — conventions
- Breakpoints : `1024px` (grilles → 1-2 col.), `992px` (`.devis-grid` → 1 col.), `768px` (mobile : burger, sticky bar, paddings réduits), `480px` (petits écrans).
- Pas de grille/flex en `style=""` inline pour la mise en page : créer une classe (ex. `.devis-grid`, `.devis-sidebar-card`) pour pouvoir la rendre responsive.
- `.btn` autorise le retour à la ligne sur mobile (pas de `white-space: nowrap` global) ; `html, body { overflow-x: hidden }`.
- Grilles auto-fit : `minmax` ≤ 280px (sinon débordement à 320px, ex. `.reviews-grid`).
- Toute nouvelle image : `loading="lazy" decoding="async"` (sauf logo du header).

## Pièges déjà rencontrés
- Burger : cliquer sur l'icône ne marchait pas (événement document + innerHTML) → corrigé, vérifier avec `verify.js`.
- Page devis : grille 2 colonnes inline → page de 688px de large sur mobile → corrigé via `.devis-grid`.
- Fichiers HTML en UTF-8 sans BOM : écrire avec `fs.writeFileSync(p, h, 'utf8')`, ne pas passer par `Set-Content` PowerShell 5 (accents corrompus).
- Console Windows : `Select-String` affiche mal les accents (affichage seulement).

## Vérification (obligatoire avant de conclure)
`node .agents/skills/proxi-phone-site/scripts/verify.js` — 5 pages × 375/360/320px : images cassées, erreurs JS, débordement horizontal, vrai clic sur l'icône du burger, statut d'ouverture. Doit afficher « Tout est OK ».

## Déploiement & Releases GitHub
- Dépôt : `https://github.com/kylian-tht/site-proxi-phone` (Public)
- GitHub Pages activé sur branche `main` (racine `/`) : `https://kylian-tht.github.io/site-proxi-phone/`
- Pour publier une nouvelle release automatique :
  1. Commit et push git (`git add .`, `git commit -m "..."`, `git push origin main`)
  2. Appel API GitHub POST `/repos/kylian-tht/site-proxi-phone/releases` avec tag incrémenté (`v1.1.0`, etc.) et corps descriptif des nouveautés.
