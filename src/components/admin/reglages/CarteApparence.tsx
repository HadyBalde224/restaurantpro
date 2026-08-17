"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { enregistrerApparence } from "@/app/admin/(protege)/reglages/actions";
import BarreActions from "@/components/admin/reglages/BarreActions";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconePalette } from "@/components/admin/Icones";
import type { Restaurant } from "@/lib/types";

const TAILLE_MAX_LOGO = 2 * 1024 * 1024; // 2 Mo
const TAILLE_MAX_HERO = 4 * 1024 * 1024; // 4 Mo
const MAX_PHOTOS_HERO = 3;

function cheminDepuisUrlPublique(url: string): string | null {
  const marqueur = "/object/public/images/";
  const index = url.indexOf(marqueur);
  return index === -1 ? null : url.slice(index + marqueur.length);
}

type PhotoHero = {
  id: string;
  urlActuelle: string | null; // déjà en base — null si nouvelle photo pas encore envoyée
  fichier: File | null; // nouveau fichier choisi, envoyé au submit
  apercu: string; // ce qui s'affiche (URL en base ou aperçu local du fichier)
};

export default function CarteApparence({ restaurant }: { restaurant: Restaurant }) {
  const supabase = createClient();
  const inputLogoRef = useRef<HTMLInputElement>(null);
  const inputHeroRef = useRef<HTMLInputElement>(null);
  const cibleUploadHero = useRef<string | "nouvelle" | null>(null);

  const [couleurPrimaire, setCouleurPrimaire] = useState(restaurant.couleur_primaire);
  const [couleurAccent, setCouleurAccent] = useState(restaurant.couleur_accent);

  const [logoUrl, setLogoUrl] = useState(restaurant.logo_url);
  const [fichierLogo, setFichierLogo] = useState<File | null>(null);
  const [apercuLogo, setApercuLogo] = useState<string | null>(restaurant.logo_url);

  const [photos, setPhotos] = useState<PhotoHero[]>(() =>
    (restaurant.photos_hero ?? []).map((url) => ({
      id: crypto.randomUUID(),
      urlActuelle: url,
      fichier: null,
      apercu: url,
    })),
  );
  const [photosASupprimer, setPhotosASupprimer] = useState<string[]>([]);

  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const choisirLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setMessage({ texte: "Le logo doit être une image.", erreur: true });
      return;
    }
    if (f.size > TAILLE_MAX_LOGO) {
      setMessage({ texte: "Le logo ne doit pas dépasser 2 Mo.", erreur: true });
      return;
    }
    setMessage(null);
    setFichierLogo(f);
    setApercuLogo(URL.createObjectURL(f));
  };

  const choisirPhotoHero = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    const cible = cibleUploadHero.current;
    e.target.value = "";
    if (!f || !cible) return;

    if (!f.type.startsWith("image/")) {
      setMessage({ texte: "La photo doit être une image.", erreur: true });
      return;
    }
    if (f.size > TAILLE_MAX_HERO) {
      setMessage({ texte: "La photo ne doit pas dépasser 4 Mo.", erreur: true });
      return;
    }
    setMessage(null);

    const apercuLocal = URL.createObjectURL(f);

    if (cible === "nouvelle") {
      setPhotos((p) => [...p, { id: crypto.randomUUID(), urlActuelle: null, fichier: f, apercu: apercuLocal }]);
    } else {
      setPhotos((p) => p.map((photo) => (photo.id === cible ? { ...photo, fichier: f, apercu: apercuLocal } : photo)));
    }
  };

  const ouvrirSelecteurHero = (cible: string | "nouvelle") => {
    cibleUploadHero.current = cible;
    inputHeroRef.current?.click();
  };

  const supprimerPhotoHero = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo?.urlActuelle) setPhotosASupprimer((a) => [...a, photo.urlActuelle!]);
    setPhotos((p) => p.filter((photo) => photo.id !== id));
  };

  const deplacerPhotoHero = (id: string, direction: "gauche" | "droite") => {
    setPhotos((p) => {
      const index = p.findIndex((photo) => photo.id === id);
      const cible = direction === "gauche" ? index - 1 : index + 1;
      if (index === -1 || cible < 0 || cible >= p.length) return p;
      const copie = p.slice();
      [copie[index], copie[cible]] = [copie[cible], copie[index]];
      return copie;
    });
  };

  const televerser = async (fichier: File, ancienneUrl: string | null): Promise<string> => {
    const extension = fichier.name.split(".").pop() || "jpg";
    const chemin = `${restaurant.id}/identite/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from("images").upload(chemin, fichier);
    if (error) throw error;

    const { data } = supabase.storage.from("images").getPublicUrl(chemin);

    if (ancienneUrl) {
      const ancienChemin = cheminDepuisUrlPublique(ancienneUrl);
      if (ancienChemin) await supabase.storage.from("images").remove([ancienChemin]);
    }

    return data.publicUrl;
  };

  const televerserPhotoHero = async (fichier: File, position: number): Promise<string> => {
    const extension = fichier.name.split(".").pop() || "jpg";
    const chemin = `${restaurant.id}/identite/hero-${position + 1}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from("images").upload(chemin, fichier);
    if (error) throw error;

    const { data } = supabase.storage.from("images").getPublicUrl(chemin);
    return data.publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setEnCours(true);

    let nouveauLogoUrl = logoUrl;
    const nouvellesPhotosHero: string[] = [];
    const aSupprimerDuStorage = photosASupprimer.slice();

    try {
      if (fichierLogo) nouveauLogoUrl = await televerser(fichierLogo, logoUrl);

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (photo.fichier) {
          const url = await televerserPhotoHero(photo.fichier, i);
          if (photo.urlActuelle) aSupprimerDuStorage.push(photo.urlActuelle);
          nouvellesPhotosHero.push(url);
        } else if (photo.urlActuelle) {
          nouvellesPhotosHero.push(photo.urlActuelle);
        }
      }
    } catch (err) {
      console.error("Erreur upload image identité :", err);
      setEnCours(false);
      setMessage({ texte: "Impossible d'envoyer une image. Réessayez.", erreur: true });
      return;
    }

    const resultat = await enregistrerApparence({
      couleurPrimaire,
      couleurAccent,
      logoUrl: nouveauLogoUrl,
      photosHero: nouvellesPhotosHero,
    });

    setEnCours(false);

    if (!resultat.succes) {
      setMessage({ texte: resultat.message, erreur: true });
      return;
    }

    // Nettoyage du storage seulement après succès de l'enregistrement en base,
    // pour ne jamais perdre un fichier si la sauvegarde échoue.
    for (const url of aSupprimerDuStorage) {
      const chemin = cheminDepuisUrlPublique(url);
      if (chemin) await supabase.storage.from("images").remove([chemin]);
    }

    setLogoUrl(nouveauLogoUrl);
    setFichierLogo(null);
    setPhotos(
      nouvellesPhotosHero.map((url) => ({ id: crypto.randomUUID(), urlActuelle: url, fichier: null, apercu: url })),
    );
    setPhotosASupprimer([]);
    setMessage({ texte: "✓ Enregistré", erreur: false });
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <EnteteCarte icone={IconePalette} couleur="text-pink-600" fond="bg-pink-50" titre="Apparence" />

      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="couleur_primaire" className="block text-sm font-medium text-gray-700">
              Couleur principale
            </label>
            <div className="mt-1 flex items-center gap-3">
              <input
                id="couleur_primaire"
                type="color"
                value={couleurPrimaire}
                onChange={(e) => setCouleurPrimaire(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300"
              />
              <span className="font-mono text-sm text-gray-600">{couleurPrimaire}</span>
            </div>
          </div>
          <div>
            <label htmlFor="couleur_accent" className="block text-sm font-medium text-gray-700">
              Couleur d&apos;accent
            </label>
            <div className="mt-1 flex items-center gap-3">
              <input
                id="couleur_accent"
                type="color"
                value={couleurAccent}
                onChange={(e) => setCouleurAccent(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300"
              />
              <span className="font-mono text-sm text-gray-600">{couleurAccent}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Aperçu</p>
          <div
            className="mt-2 flex items-center justify-between overflow-hidden rounded-xl p-4 transition-colors duration-200"
            style={{ background: couleurPrimaire }}
          >
            <span className="font-semibold text-white">{restaurant.nom || "Votre restaurant"}</span>
            <span
              className="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
              style={{ background: couleurAccent, color: couleurPrimaire }}
            >
              Réserver
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              {apercuLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={apercuLogo} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-300">🏪</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => inputLogoRef.current?.click()}
              className="min-h-11 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Choisir
            </button>
            <input
              ref={inputLogoRef}
              type="file"
              accept="image/*"
              onChange={choisirLogo}
              className="hidden"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">2 Mo maximum.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos de couverture (hero) — {photos.length}/{MAX_PHOTOS_HERO}
          </label>
          <p className="mt-1 text-xs text-gray-400">
            La première photo s&apos;affiche en premier. Avec plusieurs photos, elles défilent
            automatiquement sur le site. 4 Mo maximum par photo.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <div key={photo.id} className="space-y-2">
                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.apercu} alt={`Photo hero ${index + 1}`} className="h-full w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
                      1ère
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => supprimerPhotoHero(photo.id)}
                    aria-label="Supprimer la photo"
                    className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => ouvrirSelecteurHero(photo.id)}
                    className="min-h-11 flex-1 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Remplacer
                  </button>
                  <button
                    type="button"
                    onClick={() => deplacerPhotoHero(photo.id, "gauche")}
                    disabled={index === 0}
                    aria-label="Déplacer avant"
                    className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-gray-900 disabled:opacity-30"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => deplacerPhotoHero(photo.id, "droite")}
                    disabled={index === photos.length - 1}
                    aria-label="Déplacer après"
                    className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-gray-900 disabled:opacity-30"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}

            {photos.length < MAX_PHOTOS_HERO && (
              <button
                type="button"
                onClick={() => ouvrirSelecteurHero("nouvelle")}
                className="flex aspect-4/3 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors duration-200 hover:border-gray-300 hover:text-gray-600"
              >
                <span className="text-2xl">+</span>
                <span className="text-xs font-semibold">Ajouter</span>
              </button>
            )}
          </div>

          <input
            ref={inputHeroRef}
            type="file"
            accept="image/*"
            onChange={choisirPhotoHero}
            className="hidden"
          />
        </div>

        <BarreActions enCours={enCours} message={message} />
      </form>
    </section>
  );
}
