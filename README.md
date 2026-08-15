# RestaurantPro

SaaS multi-tenant pour restaurants au Maroc, en Guinée et en Afrique francophone. Chaque restaurant client obtient un site public professionnel (menu numérique, réservations, avis, commande WhatsApp) et un espace admin pour tout gérer lui-même.

**Un seul code, une seule base de données, N restaurants.** Chaque restaurant est une ligne dans la table `restaurants`, son site public vit sur `/[slug]`. Aucun code spécifique à un client : tout est piloté par les données (thème, contenu, menu).

## Stack

- **Next.js 16** (App Router, TypeScript, dossier `src/`)
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL + Auth + Storage), sécurisé par Row Level Security multi-tenant
- **Vercel** pour le déploiement

## Démarrer en local

```bash
npm install
npm run dev
```

Crée un fichier `.env.local` à la racine avec :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Puis ouvre [http://localhost:3000/dar-zayna](http://localhost:3000/dar-zayna) (restaurant de démonstration).

## Fonctionnalités

- Site public premium par restaurant : hero plein écran, thème dynamique (couleurs du resto via variables CSS), menu avec photos, avis clients, horaires, localisation
- Réservation de table (Server Action + validation serveur)
- Commande WhatsApp avec panier en mémoire
- Sécurité multi-tenant via RLS Supabase (RLS = dernier rempart, jamais contournable depuis le navigateur)

## À venir

- Espace admin (`/admin`) : login, CRUD menu, gestion des réservations, modération des avis
- Déploiement Vercel + domaine
