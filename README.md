README

1. Présentation
   Plateforme : React Native / Expo

But :

Afficher une liste de mots anglais traduits en français, classés par catégories (verbes, expressions, vocabulaire, etc.).
Permettre à l’utilisateur de rechercher dans la liste de mots.
Fournir un mode “flashcards” pour réviser et s’entraîner à retenir les mots.
Le projet suit la structure Expo Router, avec deux écrans principaux :

WordListScreen : liste de mots (groupés par catégorie) + barre de recherche.
FlashcardsScreen : présentation de tous les mots sous forme de cartes recto/verso.
L’application est conçue pour communiquer avec une API qui renvoie les données.

2. Fonctionnalités
   Catégories de mots : verbe, expression, vocabulaire, etc.
   Liste : vue en sections (une section par catégorie), avec possibilité de rechercher un mot (anglais ou français).
   Flashcards : vue de type quiz, permettant de retourner la carte pour voir la traduction (ou l’original).

3. Structure du projet
   bash
   Copier
   Modifier
   mon-appli-vocabulaire
   ├── app
   │ └── (tabs)
   │ ├── \_layout.tsx # Configuration des onglets (2 onglets : Liste + Flashcards)
   │ ├── word-list.tsx # Écran 1 : Liste des mots par catégorie + recherche
   │ └── flashcards.tsx # Écran 2 : Flashcards
   ├── components
   │ └── Flashcard.tsx # Composant individuel de carte recto/verso
   ├── data
   │ └── categories.ts # [Optionnel] Fichier de données statiques (peut être remplacé par l'API)
   ├── package.json
   ├── tsconfig.json
   └── ...

5.1 app/(tabs)/\_layout.tsx
Gère la navigation par onglets.
Définit 2 onglets : « Liste de mots » et « Flashcards ».
5.2 app/(tabs)/word-list.tsx
Affiche la liste des catégories et des mots avec un SectionList.
Inclut une barre de recherche.
5.3 app/(tabs)/flashcards.tsx
Affiche l’ensemble des mots sous forme de flashcards.
Utilise un FlatList et le composant Flashcard.
5.4 components/Flashcard.tsx
Composant stateless, qui gère son état “retourné” (useState).
Affiche le recto (mot anglais) ou le verso (traduction).
5.5 data/categories.ts
Contient un tableau de catégories, elles-mêmes contenant un tableau de mots.
