"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { creerRestaurant, verifierSlugDisponible } from "@/app/admin/(protege)/plateforme/actions";
import { IconeCoche, IconeExterne } from "@/components/admin/Icones";

const DEVISES = [
  { valeur: "GNF", libelle: "GNF — Franc guinéen" },
  { valeur: "DH", libelle: "DH — Dirham marocain" },
  { valeur: "CFA", libelle: "CFA — Franc CFA" },
];

function slugifier(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type EtatSlug = "inconnu" | "verification" | "disponible" | "pris";

export default function FormulaireNouveauRestaurant() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [slugModifieManuellement, setSlugModifieManuellement] = useState(false);
  const [ville, setVille] = useState("");
  const [devise, setDevise] = useState("GNF");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const [etatSlug, setEtatSlug] = useState<EtatSlug>("inconnu");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [recapitulatif, setRecapitulatif] = useState<{ url: string; email: string; motDePasse: string } | null>(
    null
  );

  const delaiVerification = useRef<ReturnType<typeof setTimeout> | null>(null);

  const modifierNom = (valeur: string) => {
    setNom(valeur);
    if (!slugModifieManuellement) setSlug(slugifier(valeur));
  };

  const modifierSlug = (valeur: string) => {
    setSlugModifieManuellement(true);
    setSlug(slugifier(valeur));
  };

  useEffect(() => {
    if (delaiVerification.current) clearTimeout(delaiVerification.current);

    if (!slug || slug.length < 2) {
      setEtatSlug("inconnu");
      return;
    }

    setEtatSlug("verification");
    delaiVerification.current = setTimeout(async () => {
      const resultat = await verifierSlugDisponible(slug);
      setEtatSlug(resultat.disponible ? "disponible" : "pris");
    }, 500);

    return () => {
      if (delaiVerification.current) clearTimeout(delaiVerification.current);
    };
  }, [slug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur("");

    if (etatSlug === "pris") {
      setErreur("Ce slug est déjà utilisé, choisis-en un autre.");
      return;
    }

    setEnCours(true);
    const resultat = await creerRestaurant({ nom, slug, ville, devise, whatsapp, email, motDePasse });
    setEnCours(false);

    if (!resultat.succes) {
      setErreur(resultat.message);
      return;
    }

    setRecapitulatif({
      url: `${window.location.origin}/${resultat.slug}`,
      email,
      motDePasse,
    });
  };

  if (recapitulatif) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
          <IconeCoche size={22} />
        </div>
        <h2 className="mt-3 text-lg font-bold text-gray-900">Restaurant créé avec succès</h2>
        <p className="mt-1 text-sm text-gray-500">
          Transmets ces informations à ton client pour qu&apos;il puisse gérer son site.
        </p>

        <dl className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Adresse du site</dt>
            <dd className="mt-0.5 font-semibold text-gray-900">{recapitulatif.url}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Email de connexion</dt>
            <dd className="mt-0.5 font-semibold text-gray-900">{recapitulatif.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Mot de passe</dt>
            <dd className="mt-0.5 font-semibold text-gray-900">{recapitulatif.motDePasse}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={recapitulatif.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 px-5 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <IconeExterne size={16} />
            Voir le site
          </a>
          <button
            type="button"
            onClick={() => router.push("/admin/plateforme")}
            style={{ background: "var(--accent)", color: "var(--primaire)" }}
            className="min-h-11 rounded-xl px-5 font-semibold transition hover:opacity-90"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom du restaurant
        </label>
        <input
          id="nom"
          type="text"
          required
          value={nom}
          onChange={(e) => modifierNom(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Adresse du site
        </label>
        <div className="mt-1 flex items-center rounded-xl border border-gray-300 pl-4 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
          <span className="shrink-0 text-sm text-gray-400">nehma.app/</span>
          <input
            id="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => modifierSlug(e.target.value)}
            className="w-full rounded-xl px-1 py-2.5 outline-none"
          />
        </div>
        <p className="mt-1 text-xs">
          {etatSlug === "verification" && <span className="text-gray-400">Vérification...</span>}
          {etatSlug === "disponible" && <span className="text-green-600">✓ Disponible</span>}
          {etatSlug === "pris" && <span className="text-red-600">Déjà utilisé</span>}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
            Ville
          </label>
          <input
            id="ville"
            type="text"
            required
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label htmlFor="devise" className="block text-sm font-medium text-gray-700">
            Devise
          </label>
          <select
            id="devise"
            value={devise}
            onChange={(e) => setDevise(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          >
            {DEVISES.map((d) => (
              <option key={d.valeur} value={d.valeur}>
                {d.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          type="tel"
          inputMode="tel"
          required
          placeholder="224620000000"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
        <p className="mt-1 text-xs text-gray-400">Format international sans +, ex : 224620000000</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email du compte
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="mot_de_passe"
            type="text"
            required
            minLength={8}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
          <p className="mt-1 text-xs text-gray-400">8 caractères minimum</p>
        </div>
      </div>

      {erreur && <p className="text-sm font-medium text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={enCours || etatSlug === "verification"}
        style={{ background: "var(--accent)", color: "var(--primaire)" }}
        className="flex min-h-11 items-center gap-2 rounded-xl px-5 font-semibold transition hover:opacity-90 disabled:opacity-60"
      >
        {enCours ? "Création en cours..." : "Créer le restaurant"}
      </button>
    </form>
  );
}
