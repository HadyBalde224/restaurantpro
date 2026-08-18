"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { enregistrerPlat } from "@/app/admin/(protege)/menu/actions";
import { idUnique } from "@/lib/id";
import type { CategorieMenu, Plat } from "@/lib/types";

const TAILLE_MAX_OCTETS = 2 * 1024 * 1024; // 2 Mo

function cheminDepuisUrlPublique(url: string): string | null {
  const marqueur = "/object/public/images/";
  const index = url.indexOf(marqueur);
  return index === -1 ? null : url.slice(index + marqueur.length);
}

export default function PlatModal({
  categories,
  categorieId,
  plat,
  restaurantId,
  devise,
  onFermer,
  onMessage,
}: {
  categories: CategorieMenu[];
  categorieId: string;
  plat?: Plat;
  restaurantId: string;
  devise: string;
  onFermer: () => void;
  onMessage: (texte: string, erreur?: boolean) => void;
}) {
  const supabase = createClient();
  const inputFichierRef = useRef<HTMLInputElement>(null);

  const [nom, setNom] = useState(plat?.nom ?? "");
  const [description, setDescription] = useState(plat?.description ?? "");
  const [prix, setPrix] = useState(plat ? String(plat.prix) : "");
  const [categorieChoisie, setCategorieChoisie] = useState(plat?.categorie_id ?? categorieId);

  const [fichier, setFichier] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(plat?.photo_url ?? null);
  const [photoRetiree, setPhotoRetiree] = useState(false);

  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const choisirFichier = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErreur("Le fichier doit être une image.");
      return;
    }
    if (f.size > TAILLE_MAX_OCTETS) {
      setErreur("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    setErreur("");
    setFichier(f);
    setPhotoRetiree(false);
    setApercu(URL.createObjectURL(f));
  };

  const retirerPhoto = () => {
    setFichier(null);
    setApercu(null);
    setPhotoRetiree(true);
    if (inputFichierRef.current) inputFichierRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur("");

    const nomPropre = nom.trim();
    const prixNombre = Number(prix);

    if (!nomPropre || nomPropre.length < 2) {
      setErreur("Le nom du plat doit contenir au moins 2 caractères.");
      return;
    }
    if (!Number.isFinite(prixNombre) || prixNombre < 0) {
      setErreur("Le prix doit être un nombre positif.");
      return;
    }

    setEnCours(true);

    let photoUrl: string | null = plat?.photo_url ?? null;

    if (fichier) {
      const extension = fichier.name.split(".").pop() || "jpg";
      const chemin = `${restaurantId}/plats/${idUnique()}.${extension}`;

      const { error: erreurUpload } = await supabase.storage.from("images").upload(chemin, fichier);

      if (erreurUpload) {
        console.error("Erreur upload photo :", erreurUpload);
        setErreur("Impossible d'envoyer l'image. Réessayez.");
        setEnCours(false);
        return;
      }

      const { data: urlPublique } = supabase.storage.from("images").getPublicUrl(chemin);
      photoUrl = urlPublique.publicUrl;

      // Remplacement : on supprime l'ancienne image du storage pour ne pas accumuler de fichiers orphelins.
      if (plat?.photo_url) {
        const ancienChemin = cheminDepuisUrlPublique(plat.photo_url);
        if (ancienChemin) await supabase.storage.from("images").remove([ancienChemin]);
      }
    } else if (photoRetiree && plat?.photo_url) {
      const ancienChemin = cheminDepuisUrlPublique(plat.photo_url);
      if (ancienChemin) await supabase.storage.from("images").remove([ancienChemin]);
      photoUrl = null;
    }

    const resultat = await enregistrerPlat({
      id: plat?.id,
      nom: nomPropre,
      description,
      prix: prixNombre,
      categorieId: categorieChoisie,
      photoUrl,
    });

    setEnCours(false);

    if (!resultat.succes) {
      setErreur(resultat.message);
      return;
    }

    onMessage(resultat.message);
    onFermer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onFermer} aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900">
          {plat ? "Modifier le plat" : "Ajouter un plat"}
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="nom_plat" className="block text-sm font-medium text-gray-700">
              Nom du plat
            </label>
            <input
              id="nom_plat"
              type="text"
              required
              autoFocus
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="description_plat" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description_plat"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prix_plat" className="block text-sm font-medium text-gray-700">
                Prix ({devise})
              </label>
              <input
                id="prix_plat"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                required
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="categorie_plat" className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="categorie_plat"
                required
                value={categorieChoisie}
                onChange={(e) => setCategorieChoisie(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <div className="mt-1 flex items-center gap-4">
              {apercu ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={apercu} alt="Aperçu" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={retirerPhoto}
                    aria-label="Retirer la photo"
                    className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl text-gray-300">
                  🍽️
                </div>
              )}
              <button
                type="button"
                onClick={() => inputFichierRef.current?.click()}
                className="min-h-11 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Choisir une image
              </button>
              <input
                ref={inputFichierRef}
                type="file"
                accept="image/*"
                onChange={choisirFichier}
                className="hidden"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">JPG, PNG... 2 Mo maximum.</p>
          </div>

          {erreur && <p className="text-sm font-medium text-red-600">{erreur}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFermer}
              disabled={enCours}
              className="min-h-11 flex-1 rounded-xl border border-gray-300 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enCours}
              style={{ background: "var(--accent)", color: "var(--primaire)" }}
              className="min-h-11 flex-1 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-60"
            >
              {enCours ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
