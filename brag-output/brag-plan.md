# Plan de la vidéo : הצהרת הפקדות

**Projet** : `dak302/atsharat-hafkadot`, une app web pour les משקי ת"ש. Elle lit le עו"ש, le משק choisit les lignes, le soldat écrit les explications par un lien WhatsApp, et l'app produit le formulaire officiel.

**Angle** : la promesse du titre de `about.html`, « בלי לפענח כתב יד ». On montre le parcours réel de bout en bout, en 4 étapes, avec les noms d'étapes de l'app elle-même (`STEPS` dans `src/lib/ui.tsx`).

**Réglages** : vertical 1080×1920, 30 i/s, 25 s, ton soigné, sans voix off et sans sous-titres. Musique « Happy Beats / Business Moves Vol. 10 » (Sascha Ende, CC BY 4.0), 110 BPM, première pulsation à 0,267 s, une pulsation toutes les 0,5455 s. Bruitages discrets (Kenney).

**Identité** : celle du `DESIGN.md`. Fond `#f7f7f8`, cartes blanches, un seul violet `#5b34b0`, texte `#2b2b33`, polices Assistant et IBM Plex Mono. Pas de dégradé, pas de halo, pas d'emoji.

**Données** : entièrement fictives. Le relevé `osh-sep-oct.pdf` a été généré pour la vidéo, le soldat s'appelle « ישראל ישראלי » (le texte d'exemple de l'app), son מספר אישי est 1234567, et les trois explications sont des exemples. Aucune vraie personne ni aucun vrai compte.

**Écrans** : la vraie app, lancée en local et pilotée dans un navigateur. On voit les vrais écrans capturés à chaque étape : lecture du PDF et tampon « מאומת », sélection des lignes avec les indices, écran du soldat avec la saisie, formulaire נספח ו'.

## Storyboard (chaque coupe tombe sur une pulsation)

| # | Temps | Étape affichée | Texte (repris du projet) | À l'écran |
|---|---|---|---|---|
| 1 | 0,00 – 3,54 | — | « הצהרת הפקדות לסיוע כלכלי ולתשמ"ש, » / « בלי לפענח כתב יד » (h1 de `about.html`) | Le formulaire officiel rempli, en gros plan sur les explications tapées |
| 2 | 3,54 – 8,45 | 1 · העלאת עו"ש | « כל שורה נבדקת מול עמודת היתרה » (README) | Dépôt du PDF → « הקובץ נקרא ואומת » → bilan avec le tampon « מאומת » |
| 3 | 8,45 – 13,36 | 2 · בחירת שורות | « המשק בוחר בעצמו » / « שורות שעומדות בכללי הנוהל מקבלות רמז » (README) | Trois touches qui cochent trois lignes signalées par un indice |
| 4 | 13,36 – 18,82 | 3 · אצל החייל | « ההצהרה עוברת לחייל וחזרה בתוך קישור בוואטסאפ » / « החייל יכול לכתוב רק הסבר » (README) | Écran du soldat : cadenas, saisie de l'explication, coche verte, « סיימת, נשאר רק לשלוח למשק » |
| 5 | 18,82 – 22,09 | 5 · הפקת PDF | « ומפיקה את הטופס הרשמי » / « נספח ו' לסיוע כלכלי, נספח ג' לתשמ"ש » (README) | Le formulaire נספח ו' rempli, panoramique lent |
| 6 | 22,09 – 25,00 | — | « הצהרת הפקדות » | Icône de l'app et nom, la musique s'éteint en fondu |

## Son

- La musique démarre sur la première image. Elle est un peu baissée sous les touches et s'éteint en fondu sur la dernière seconde.
- Les bruitages sont calés sur la grille des pulsations, sous la musique : un clic doux à chaque touche, un « bong » chaud à chaque validation (fichier vérifié, envoi au משק), et de légers tic-tac pendant la frappe.
