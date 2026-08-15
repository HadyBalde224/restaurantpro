@AGENTS.md

# RestaurantPro — Contexte du projet

## Ce qu'est ce projet

RestaurantPro est un **produit SaaS multi-tenant** destiné à être vendu à de vrais restaurants au Maroc, en Guinée et en Afrique francophone. Chaque restaurant client obtient un site public professionnel (menu numérique, réservations, avis, commande WhatsApp) et un espace admin pour tout gérer lui-même.

**Modèle économique** : frais d'installation (1 500–3 000 MAD) + abonnement mensuel (150–300 MAD/mois par restaurant).

**Principe d'architecture fondamental** : UN seul code, UNE seule base de données, N restaurants. Chaque restaurant = une ligne dans la table `restaurants`, son site public est sur `/[slug]`. On n'ajoute JAMAIS de code spécifique à un client — tout est piloté par les données (thème, contenu, menu).

## Stack technique (décidée, ne pas changer sans raison majeure)

- **Next.js 16** (App Router, TypeScript, dossier `src/`, alias `@/*` → `./src/*`)
- **Tailwind CSS 4** pour le style
- **Supabase** : PostgreSQL + Auth + Storage. PAS de backend séparé en V1 (les Server Components et Server Actions suffisent)
- **Vercel** pour le déploiement (prévu, pas encore fait)
- Langue du code et de l'UI : **français** (noms de variables, commentaires, interface)

⚠️ **Next.js 16 déprécie `middleware.ts` au profit de `proxy.ts`** (fonction `middleware` renommée `proxy`, même API). C'est le genre de changement que l'entraînement de Claude ne connaît pas encore — toujours vérifier `node_modules/next/dist/docs/` avant d'utiliser une convention de fichier qui semble "classique".

## Sécurité multi-tenant (CRITIQUE — ne jamais contourner)

Toute la sécurité repose sur la **Row Level Security (RLS)** de Supabase, déjà en place dans la base :

- La fonction SQL `mon_restaurant_id()` retourne le restaurant de l'admin connecté (via la table `profils_admin` liée à `auth.users`)
- Chaque table porte un `restaurant_id` ; les policies garantissent qu'un admin ne lit/écrit QUE les données de SON restaurant
- Les visiteurs anonymes peuvent : lire les restos actifs et leurs menus, créer des réservations (statut `en_attente` forcé), soumettre des avis (`approuve = false` forcé)
- Le champ `restaurants.actif` coupe le site public d'un client impayé (la RLS cache les restos inactifs → 404 automatique)
- On utilise UNIQUEMENT la clé publishable/anon côté client. JAMAIS la clé secrète dans le code frontend.
- Défense en profondeur systématique : validation navigateur (confort) → validation Server Action (sécurité réelle) → RLS (garantie ultime, jamais contournable). Testé et vérifié pour les réservations (une date passée envoyée en contournant le `min` HTML est bien rejetée côté serveur).

## Schéma de la base (tables existantes dans Supabase)

- `restaurants` : slug, nom, description, logo_url, **photo_hero_url** (ajouté pour le Hero plein écran), couleur_primaire, couleur_accent, telephone, whatsapp, email, adresse, ville, latitude, longitude, horaires (jsonb), instagram, facebook, actif, devise
- `profils_admin` : id (= auth.users.id), restaurant_id, nom_complet — aucune policy INSERT : un compte admin se crée à la main dans le dashboard Supabase (Authentication → Users) puis on insère la ligne `profils_admin` manuellement
- `categories_menu` : restaurant_id, nom, ordre
- `plats` : restaurant_id, categorie_id, nom, description, prix, photo_url, disponible, ordre
- `photos_galerie` : restaurant_id, url, legende, ordre
- `reservations` : restaurant_id, nom_client, telephone, date_resa, heure_resa, nb_personnes, message, statut (en_attente/confirmee/refusee/annulee)
- `avis` : restaurant_id, nom_client, note (1-5), commentaire, approuve
- Storage : bucket `images` public en lecture, écriture limitée au dossier `{restaurant_id}/` de l'admin connecté

Un restaurant de démo existe (slug actuel : **`nehma`** — a remplacé le `dar-zayna` initial, vérifier le slug réel en base avant de tester si un doute).

## Structure du code actuelle

```
src/
├── middleware → proxy.ts        → protège /admin/:path* (redirige vers /admin/login si non connecté)
├── lib/
│   ├── supabase/client.ts       → createBrowserClient (composants "use client")
│   ├── supabase/server.ts       → createServerClient avec cookies (Server Components)
│   ├── restaurant.ts            → getRestaurant(slug), mis en cache() React (dédoublonne layout+page)
│   └── types.ts                 → Restaurant, Plat, CategorieMenu, Avis
└── app/
    ├── layout.tsx                → polices Playfair Display (titres) + Karla (texte)
    ├── globals.css                → thème clair uniquement, keyframes fadeUp/rebondLent, prefers-reduced-motion
    ├── [slug]/
    │   ├── layout.tsx             → injecte --primaire/--accent (couleurs du resto) + <PanierProvider>
    │   ├── page.tsx                → compose toutes les sections du site public
    │   └── reserver/actions.ts     → Server Action creerReservation (validation serveur + insert RLS)
    └── admin/
        ├── login/page.tsx          → connexion (hors protection, "use client")
        └── (protege)/               → route group : layout protège TOUT sauf /admin/login
            ├── layout.tsx           → vérifie session + profil admin, header + nav + déconnexion
            └── page.tsx             → tableau de bord (compteurs réels : résas en attente, avis à modérer, plats)

src/components/
├── Apparition.tsx                → IntersectionObserver générique (fade + translate-y, prop delai)
├── restaurant/
│   ├── Navbar.tsx                 → sticky, transparente → fond --primaire après 50px scroll
│   ├── Hero.tsx                   → plein écran (100svh), photo_hero_url, cascade fadeUp au chargement
│   ├── TitreSection.tsx           → titre de section réutilisable (trait décoratif accent)
│   ├── SectionMenu.tsx             → cartes plats (photo ratio 4/3 ou carte texte élégante si sans photo)
│   ├── BoutonAjouterPanier.tsx    → "+ Ajouter" avec feedback "✓ Ajouté"
│   ├── PanierContext.tsx          → Context du panier WhatsApp (mémoire seule, pas de localStorage)
│   ├── PanierFlottant.tsx         → barre flottante (nb articles + total), cachée si panier vide
│   ├── PanneauPanier.tsx          → bottom sheet mobile / carte desktop, envoi commande via wa.me
│   ├── SectionReservation.tsx     → formulaire de réservation (FormulaireReservation + Server Action)
│   ├── FormulaireReservation.tsx → useActionState, désactivé pendant l'envoi
│   ├── SectionAvis.tsx            → fond --primaire foncé, uniquement approuve=true, étoiles
│   ├── Horaires.tsx                → jour actuel en évidence
│   ├── Localisation.tsx            → iframe Google Maps (lat/lng)
│   ├── Footer.tsx
│   └── BoutonWhatsApp.tsx         → contact direct flottant (distinct du panier de commande)
└── admin/
    └── BoutonDeconnexion.tsx     → supabase.auth.signOut() + redirection login
```

## État d'avancement

✅ **Site public** (`/[slug]`) : design premium image-first complet — Hero plein écran animé, navbar sticky, menu avec photos et animations au scroll, avis, horaires, localisation, footer
✅ **Réservation** : Server Action avec validation serveur (défense en profondeur testée)
✅ **Commande WhatsApp** : panier en mémoire (Context React), message pré-rempli avec le détail de la commande
✅ **Auth admin** : `proxy.ts` (protection au niveau routeur) + layout protégé (route group) + page de login + déconnexion
✅ **Tableau de bord admin** (`/admin`) : statistiques réelles (réservations en attente, avis à modérer, nb de plats)

🚧 **En cours — Session 2** : gestion du menu (`/admin/menu`) — CRUD catégories/plats, upload photos vers Storage. Les liens `/admin/menu`, `/admin/reservations`, `/admin/avis`, `/admin/reglages` existent déjà dans la nav du layout admin mais les pages ne sont pas encore créées.

## Roadmap V1 (dans l'ordre)

1. ~~Corriger le 404 et valider l'affichage des données de la base~~ ✅
2. ~~Site public complet~~ ✅ (thème dynamique, menu, galerie non affichée pour l'instant, horaires, carte, WhatsApp, réservation, avis)
3. **Espace admin `/admin`** : ~~login, dashboard~~ ✅ → CRUD menu (avec upload photos), gestion réservations, modération avis, réglages du restaurant — **en cours**
4. Tests + revue sécurité (RLS, validation des entrées)
5. Déploiement Vercel + domaine
6. Kit commercial (démo, tarifs, argumentaire)

**Hors scope V1** (ne pas implémenter sauf demande explicite) : paiement en ligne, multilingue, notifications automatiques, domaines personnalisés par client, statistiques avancées.

## Conventions et préférences du développeur

- Le développeur est de niveau intermédiaire en React/Next.js et DÉBUTANT avec Supabase : **expliquer les choix techniques importants**, pas seulement livrer du code. Il veut comprendre son produit pour le maintenir et le vendre.
- Privilégier les Server Components par défaut ; `"use client"` uniquement quand nécessaire (interactivité)
- Toujours lire et logger `error` dans les réponses Supabase pendant le développement
- Environnement : Windows + PowerShell. Attention aux crochets `[ ]` dans les commandes (caractères spéciaux PowerShell) — préférer la création de fichiers/dossiers via VS Code
- Rester simple : pas de sur-ingénierie, pas de librairies supplémentaires sans justification
- Toute nouvelle fonctionnalité UI est vérifiée dans un vrai navigateur (Playwright) avant d'être annoncée comme terminée — captures d'écran + inspection des styles calculés, pas seulement `tsc --noEmit`
- Le design actuel est fonctionnel mais pas encore "vendable en démo" — une passe de polish visuel dédiée est prévue plus tard (couleurs, espacement, photos réelles)

## Dépôt

Poussé sur https://github.com/HadyBalde224/restaurantpro (branche `main`). `.env.local` (clés Supabase) exclu via `.gitignore` — jamais commité.
