# Étoile Filante — site du spectacle pour enfants

Site vitrine en **HTML / CSS / JavaScript "vanilla"** (aucune dépendance, aucun outil de build).
Rapide, responsive, accessible, optimisé pour le référencement.

---

## 1. Lancer le site en local

### Le plus simple
Double-cliquez sur **`index.html`** : le site s'ouvre dans votre navigateur.
(Les polices viennent de Google Fonts ; sans connexion, une police système de secours est utilisée.)

### Recommandé (comportement identique à la mise en ligne)
Ouvrez un terminal dans le dossier du projet et lancez un petit serveur local :

```bash
# Python 3 (déjà présent sur la plupart des machines)
python -m http.server 8000
```
```bash
# ou avec Node.js
npx serve .
```

Puis ouvrez **http://localhost:8000**.

### Mettre en ligne
Envoyez **tout le contenu du dossier** (en gardant la structure) sur n'importe quel
hébergement statique : OVH, Infomaniak, Netlify, GitHub Pages, Vercel, o2switch…
Aucune configuration serveur n'est nécessaire.

---

## 2. Fichiers créés

```
spectaclezoé/
├── index.html               Accueil (carrousel + présentation + univers + atouts + 3 actus)
├── actualites.html          Liste de toutes les actualités (grille responsive)
├── presentation.html        Le spectacle en détail (histoire, personnages, équipe, infos pratiques)
├── galerie.html             Galerie photo + lightbox
├── contact.html             Coordonnées + formulaire + emplacement carte Google Maps
├── mentions-legales.html    Modèle à compléter
├── confidentialite.html     Modèle à compléter (RGPD)
├── robots.txt               Indexation moteurs de recherche
├── sitemap.xml              Plan du site pour Google (à mettre à jour avec votre domaine)
├── README.md                Ce fichier
│
├── css/
│   └── style.css            TOUTE la mise en forme, commentée par sections
│
├── js/
│   ├── main.js              En-tête, menu mobile, apparition au scroll, parallaxe
│   ├── carousel.js          Carrousel « pages de livre » (effet de page qui se tourne en 3D)
│   ├── lightbox.js          Galerie : agrandissement des photos
│   ├── articles.js          ← LISTE DES ARTICLES (voir §5) + génération des cartes
│   └── contact.js           Validation du formulaire de contact
│
├── articles/
│   ├── _modele-article.html Gabarit à dupliquer pour créer un nouvel article
│   ├── premiere-la-residence-landeronde.html
│   └── avant-premiere-ecole-lucs-sur-boulogne.html
│
└── assets/
    ├── icons/favicon.svg
    └── images/              Toutes les images d'EXEMPLE (voir §3)
```

---

## 3. Où placer vos vraies photos

Toutes les images sont dans **`assets/images/`**. Ce sont pour l'instant des visuels
d'exemple colorés portant la mention « PHOTO EXEMPLE — À REMPLACER ».

**Méthode la plus simple : gardez exactement les mêmes noms de fichiers.**
Remplacez le fichier `.svg` par votre photo (idéalement en `.jpg` ou `.webp`), puis
mettez à jour l'extension dans le HTML si besoin (`.svg` → `.jpg`).

| Emplacement dans le site        | Fichiers à remplacer                          | Dimensions conseillées |
|---------------------------------|----------------------------------------------|------------------------|
| Carrousel d'accueil (5 photos)  | `hero-01.svg` … `hero-05.svg`                 | 1600 × 900 px (paysage)|
| Galerie (15 photos)             | `galerie-01.svg` … `galerie-15.svg`          | 1200 × 900 px          |
| Cartes d'actualités             | `article-01.svg` … `article-06.svg`          | 1200 × 800 px          |
| Personnages                     | `perso-01.svg` … `perso-04.svg`              | 800 × 1000 px (portrait)|
| Univers (page d'accueil)        | `univers.svg`                                | 1400 × 900 px          |
| Équipe artistique               | `equipe-01.svg` … `equipe-04.svg`            | 800 × 800 px (carré)   |
| Partage réseaux sociaux / Google| `og-image.svg`                               | 1200 × 630 px          |
| Logo (JSON-LD / partage)        | `assets/images/logo-memoria.png`              | PNG carré, fond transparent |
| Logo (en-tête / pied de page)   | `assets/icons/logo-mark.png`                  | PNG carré, fond transparent |

**Conseils performance :** exportez vos photos en **JPEG qualité ~80 %** ou **WebP**,
largeur max 1600 px, poids visé < 300 Ko. Le `loading="lazy"` est déjà en place partout
sauf sur la 1re image du carrousel (chargée en priorité, normal).

**Texte alternatif :** pensez à modifier l'attribut `alt="..."` de chaque `<img>`
pour décrire la vraie photo (important pour le SEO et l'accessibilité).

---

## 4. Où modifier les textes

| Contenu                                   | Fichier                     |
|-------------------------------------------|-----------------------------|
| Nom du spectacle, accroche, résumé, univers, personnages, atouts | `index.html` |
| Histoire complète, personnages, équipe, durée, âge, infos pratiques | `presentation.html` |
| Légendes des photos de la galerie          | `galerie.html` (attribut `data-caption` + `<span class="gallery__cap">`) |
| Légendes du carrousel                       | `index.html` (attribut `data-caption` de chaque `<li>`) |
| Téléphone, e-mail, adresse, horaires, réseaux sociaux | `contact.html` (et le pied de page de chaque page) |
| Mentions légales / confidentialité         | `mentions-legales.html`, `confidentialite.html` |
| Couleurs, typographies, arrondis, ombres   | `css/style.css`, section **1. VARIABLES & THÈME** (tout en haut) |

Les liens **Facebook / Instagram / YouTube** sont des `https://www.facebook.com/` etc.
à remplacer par vos vraies URL (présents dans le pied de page de chaque page et sur `contact.html`).

### Carte Google Maps
Dans `contact.html`, cherchez `POUR AFFICHER LA CARTE`. Sur Google Maps :
*Partager → Intégrer une carte → Copier le HTML*, collez l'`<iframe>` à l'emplacement
indiqué et supprimez le bloc `<div class="map-wrap__placeholder">`.

### Formulaire de contact
Le formulaire **valide les champs** puis affiche un message de confirmation, mais
**n'envoie rien** pour l'instant. Pour recevoir les demandes par e-mail, le plus simple :
créez un compte sur **Formspree** (gratuit), puis dans `contact.html` remplacez
`https://formspree.io/f/VOTRE_ID` par votre URL et supprimez la ligne
`<script src="js/contact.js" defer></script>` (ou adaptez `sendForm()` dans `js/contact.js`).

---

## 5. Ajouter un nouvel article

Deux étapes.

### Étape 1 — déclarer l'article
Ouvrez **`js/articles.js`** et ajoutez un bloc **tout en haut** du tableau `window.ARTICLES`
(le plus récent en premier) :

```js
{
  slug: "mon-nouvel-article",           // servira de nom de fichier
  title: "Titre de mon article",
  date: "2026-09-15",                   // format AAAA-MM-JJ
  category: "Tournée",
  image: "assets/images/article-07.svg",// ajoutez l'image dans assets/images/
  alt: "Description de l'image",
  excerpt: "Résumé court affiché sur la carte."
},
```

Les cartes se mettent à jour **automatiquement** sur la page d'accueil (3 dernières)
et sur `actualites.html` (toutes).

### Étape 2 — créer la page de l'article
1. Dupliquez **`articles/_modele-article.html`**
2. Renommez la copie **`articles/mon-nouvel-article.html`** (le même `slug` qu'à l'étape 1)
3. Ouvrez-la et remplacez : le `<title>`, la description, la date, la catégorie,
   l'image, le `<h1>` et le corps de l'article (zone `article__body`).
4. Pensez à ajouter la nouvelle URL dans `sitemap.xml`.

C'est tout : le lien « Lire l'article » pointera automatiquement vers cette page.

---

## 6. Ce qui est déjà en place

- **Header** fixe translucide, menu **hamburger animé** sur mobile, lien actif surligné.
- **Carrousel hero** : effet de **page de livre qui se tourne** (perspective 3D, ombre portée,
  image suivante dévoilée derrière), boutons ◄ ►, pastilles, défilement automatique,
  pause au survol / au focus / onglet caché, **swipe** tactile, flèches clavier.
- **Galerie** en grille + **lightbox** (agrandissement, précédent/suivant, fermeture,
  swipe mobile, touches ← → et Échap, verrouillage du défilement).
- **Animations au scroll** discrètes (apparition, léger décalage vertical, parallaxe légère).
- **`prefers-reduced-motion`** respecté partout (animations neutralisées si l'utilisateur
  a désactivé les effets dans son système).
- **Responsive** testé pour ordinateur, portable, tablette et smartphone.
- **SEO** : `<title>` et meta description par page, Open Graph / Twitter Card, hiérarchie
  H1/H2/H3, `alt` sur les images, **données structurées** JSON-LD (`TheaterEvent`,
  `Organization`, `NewsArticle`), `sitemap.xml`, `robots.txt`, URLs propres.
- **Performance** : zéro bibliothèque JS, CSS et JS légers, `loading="lazy"`,
  `defer` sur les scripts, images vectorielles d'exemple très légères.

> ⚠️ Avant mise en ligne : remplacez partout le domaine d'exemple
> `https://www.etoile-filante-spectacle.fr` (dans les balises `<link rel="canonical">`,
> Open Graph, `sitemap.xml` et `robots.txt`) par votre vrai nom de domaine.
