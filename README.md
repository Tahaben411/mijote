# MIJOTÉ — Application de recettes React + TypeScript

Application front-end réalisée pour le TP EFREI 2026. Elle consomme l'API publique DummyJSON et propose un catalogue de recettes, une fiche détaillée, une liste de courses globale, une authentification et un formulaire de proposition de recette.

## Prérequis

- Node.js 24+ recommandé par le sujet (le projet reste compatible avec les versions récentes de Node prises en charge par Vite)
- npm

## Installation et lancement

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
```

## Variable d'environnement

Le fichier `.env` est volontairement versionné car il ne contient aucun secret :

```env
VITE_API_BASE_URL=https://dummyjson.com
```

## Compte de test

- Utilisateur : `emilys`
- Mot de passe : `emilyspass`

## Arborescence

```text
src/
├── components/      # Composants de présentation et navigation
├── pages/           # Pages liées aux routes
├── hooks/           # useFetch, useDebounce, useLocalStorage
├── context/         # ShoppingListContext, AuthContext
├── services/        # Accès API DummyJSON
├── types/           # Types du domaine
├── styles/          # CSS global mobile-first
├── App.tsx
└── main.tsx
```

## Circulation des données

```text
DummyJSON API
   │
   ▼
services/api.ts
   │
   ├── useFetch ───────────────► CatalogPage / RecipePage
   │                                  │
   │                                  ▼
   │                            composants de présentation
   │                            (RecipeList, RecipeCard...)
   │
   ├── AuthContext ────────────► Header / LoginPage / ProtectedRoute / NewRecipePage
   │
   └── ShoppingListContext ────► RecipePage / ShoppingListPage / Header
                                  │
                                  └── localStorage
```

## Fonctionnalités

- Recherche avec debounce de 400 ms
- Filtre par type de repas et tri en mémoire
- Synchronisation recherche/filtre/tri avec l'URL
- Catalogue responsive : 1 colonne mobile, 2 tablette, 4 bureau
- Fiche recette avec distinction entre erreur réseau et 404
- Liste de courses globale avec `useReducer`, cases à cocher, suppression et persistance locale
- Contexte du compteur séparé afin que la mise à jour d'un ingrédient ne notifie pas le Header via le contexte de liste
- Authentification DummyJSON, stockage du jeton dans `localStorage`, vérification au démarrage via `/auth/me`
- Route `/proposer` protégée avec retour vers la page demandée après connexion
- Formulaire validé par une fonction pure `validate(values)`
- États chargement, erreur, aucun résultat et page 404
- Routes chargées à la demande avec `React.lazy` + `Suspense`

## Choix de stockage du jeton

Le jeton est conservé dans `localStorage` pour conserver la session après un rechargement. Au démarrage, l'application vérifie le jeton avec `GET /auth/me`; une réponse non valide entraîne la déconnexion. Pour une application de production exposée à des contraintes de sécurité plus fortes, un cookie `HttpOnly` piloté par un back-end serait préférable, mais ce mode n'est pas disponible avec l'API publique imposée par le sujet.

## Performance

Optimisations présentes dans le code :

- `RecipeCard` est enveloppé dans `React.memo`.
- La liste filtrée/triée est calculée avec `useMemo`.
- Les fonctions de chargement passées à `useFetch` sont stabilisées par `useCallback`.
- Le compteur de recettes de la liste de courses dispose de son propre contexte, distinct de l'état détaillé.
- Les pages sont découpées en chunks via `React.lazy`.

**Mesure React Profiler à compléter par l'étudiant avant remise :** relever un rendu du catalogue avant/après interaction et inscrire ici l'observation exacte. Cette ligne n'est volontairement pas inventée.

**Mesure build :** lancer `npm run build` sur la machine de remise et reporter ici les tailles produites si l'enseignant demande une mesure chiffrée liée au bonus `React.lazy`.

## Limites connues

- `POST /recipes/add` est simulé par DummyJSON : la recette créée reçoit un identifiant mais n'est pas enregistrée durablement et n'apparaît pas ensuite dans le catalogue.
- L'application dépend de la disponibilité de `https://dummyjson.com`.
- Les captures d'écran du dossier `docs/` doivent refléter l'exécution réelle sur la machine de l'étudiant. Elles ne sont pas fabriquées hors ligne.

## Utilisation de l'IA générative

L'utilisation de l'IA est déclarée conformément au sujet.

- **Fournisseur / modèle :** OpenAI — ChatGPT GPT-5.6 Sol.
- **Prompt principal exact :** « est ceque tu peux faire tout le tp apres tu menvoie le dossiee jle met sur git hub jlenoie a la prof ».
- **Réponse obtenue :** génération d'une implémentation complète du projet à partir du sujet fourni : arborescence, types, service API, hooks, routage, composants, contextes, formulaires, CSS, README et configuration de build.
- **Pourquoi l'IA plutôt qu'une recherche classique :** gain de temps pour produire un squelette cohérent de bout en bout et résoudre les blocages rencontrés pendant la séance.
- **Adaptations / vérifications attendues de l'étudiant :** relire le code, être capable d'expliquer chaque hook/contexte, tester les appels DummyJSON, exécuter `npm run build`, réaliser la mesure React Profiler demandée et produire les captures d'écran réelles. Le code généré doit être compris et défendu lors de la correction.

Les échanges précédents avec l'IA ont également servi à créer progressivement les fichiers `Recipe.ts`, `RecipeSearchResponse.ts`, `MealType.ts`, `Auth.ts`, `NewRecipe.ts`, `ShoppingListEntry.ts`, `services/api.ts`, `hooks/useFetch.ts`, ainsi qu'à configurer le routage et le catalogue. Ces passages ont ensuite été consolidés et adaptés dans cette version finale.
