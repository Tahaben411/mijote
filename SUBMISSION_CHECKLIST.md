# Checklist avant envoi au correcteur

1. Ouvrir un terminal dans ce dossier.
2. Exécuter `npm install` une fois avec Internet : cela installe les dépendances et complète/actualise `package-lock.json`.
3. Exécuter `npm run build` et vérifier qu'il n'y a aucune erreur TypeScript.
4. Exécuter `npm run dev` et tester les routes : `/`, `/recettes/1`, `/courses`, `/connexion`, `/proposer`, une route inconnue et `/recettes/9999`.
5. Tester la connexion avec `emilys` / `emilyspass`.
6. Tester recherche, filtre, tri, ajout/retrait d'une recette dans la liste et persistance après rechargement.
7. Réaliser les 7 captures demandées et les placer dans `docs/` avec les noms indiqués dans `docs/README.md`.
8. Faire une mesure réelle avec React Profiler puis remplacer la ligne « à compléter » de la section Performance du README par l'observation mesurée.
9. Relire la section « Utilisation de l'IA générative » et vérifier que vous êtes capable d'expliquer le code remis.
10. Vérifier que `.env` et `package-lock.json` sont bien suivis par Git, et que `node_modules/` ne l'est pas.
