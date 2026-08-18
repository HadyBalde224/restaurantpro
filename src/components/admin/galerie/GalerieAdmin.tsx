"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { idUnique } from "@/lib/id";
import { ajouterPhoto, supprimerPhoto, modifierLegende, reordonnerPhotos } from "@/app/admin/(protege)/galerie/actions";
import type { PhotoGalerie } from "@/lib/types";

const TAILLE_MAX = 4 * 1024 * 1024; // 4 Mo
const MAX_PHOTOS = 12;

function messageErreurUpload(err: unknown): string {
  const code = (err as { code?: string } | null)?.code;
  if (code === "InvalidMimeType") {
    return "Format d'image non supporté (HEIC/HEIF non accepté) — utilisez JPG, PNG ou WEBP.";
  }
  if (code === "EntityTooLarge") {
    return "Cette image dépasse la taille maximale autorisée (4 Mo).";
  }
  return "Impossible d'envoyer une image. Réessayez.";
}

export default function GalerieAdmin({
  restaurantId,
  nom,
  photosInitiales,
}: {
  restaurantId: string;
  nom: string;
  photosInitiales: PhotoGalerie[];
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState(photosInitiales);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const choisirFichier = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    e.target.value = "";
    if (!fichier) return;

    if (!fichier.type.startsWith("image/")) {
      setMessage({ texte: "La photo doit être une image.", erreur: true });
      return;
    }
    if (fichier.size > TAILLE_MAX) {
      setMessage({ texte: "La photo ne doit pas dépasser 4 Mo.", erreur: true });
      return;
    }

    setMessage(null);
    setEnvoiEnCours(true);

    try {
      const extension = fichier.name.split(".").pop() || "jpg";
      const chemin = `${restaurantId}/galerie/${idUnique()}.${extension}`;
      const { error: erreurUpload } = await supabase.storage.from("images").upload(chemin, fichier);
      if (erreurUpload) throw erreurUpload;

      const { data } = supabase.storage.from("images").getPublicUrl(chemin);
      const resultat = await ajouterPhoto(data.publicUrl);

      if (!resultat.succes) {
        await supabase.storage.from("images").remove([chemin]);
        setMessage({ texte: resultat.message, erreur: true });
      } else {
        setPhotos((p) => [...p, { id: idUnique(), url: data.publicUrl, legende: "", ordre: p.length }]);
        setMessage({ texte: "✓ Photo ajoutée", erreur: false });
      }
    } catch (err) {
      console.error("Erreur upload galerie :", err);
      setMessage({ texte: messageErreurUpload(err), erreur: true });
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const supprimer = async (id: string) => {
    setPhotos((p) => p.filter((photo) => photo.id !== id));
    const resultat = await supprimerPhoto(id);
    if (!resultat.succes) setMessage({ texte: resultat.message, erreur: true });
  };

  const changerLegende = (id: string, legende: string) => {
    setPhotos((p) => p.map((photo) => (photo.id === id ? { ...photo, legende } : photo)));
  };

  const enregistrerLegende = async (id: string, legende: string) => {
    const resultat = await modifierLegende(id, legende);
    if (!resultat.succes) setMessage({ texte: resultat.message, erreur: true });
  };

  const deplacer = async (id: string, direction: "gauche" | "droite") => {
    const index = photos.findIndex((p) => p.id === id);
    const cible = direction === "gauche" ? index - 1 : index + 1;
    if (index === -1 || cible < 0 || cible >= photos.length) return;

    const suivant = photos.slice();
    [suivant[index], suivant[cible]] = [suivant[cible], suivant[index]];
    setPhotos(suivant);

    const resultat = await reordonnerPhotos(suivant.map((p) => p.id));
    if (!resultat.succes) setMessage({ texte: resultat.message, erreur: true });
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {photos.length}/{MAX_PHOTOS} photos. Elles s&apos;affichent dans l&apos;ordre ci-dessous sur votre site
          public.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={envoiEnCours || photos.length >= MAX_PHOTOS}
          style={{ background: "var(--accent)", color: "var(--primaire)" }}
          className="min-h-11 rounded-xl px-5 font-semibold transition hover:opacity-90 disabled:opacity-50"
        >
          {envoiEnCours ? "Envoi…" : "+ Ajouter une photo"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={choisirFichier} className="hidden" />
      </div>

      {message && (
        <p className={`mt-3 text-sm font-medium ${message.erreur ? "text-red-600" : "text-green-600"}`}>
          {message.texte}
        </p>
      )}

      {photos.length === 0 ? (
        <p className="mt-8 py-10 text-center text-gray-400">
          Aucune photo pour l&apos;instant. Ajoutez vos plus belles photos de plats, de salle ou d&apos;ambiance.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="space-y-2">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                <Image src={photo.url} alt={photo.legende || nom} fill sizes="200px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => supprimer(photo.id)}
                  aria-label="Supprimer la photo"
                  className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={photo.legende}
                onChange={(e) => changerLegende(photo.id, e.target.value)}
                onBlur={(e) => enregistrerLegende(photo.id, e.target.value)}
                placeholder="Légende (facultatif)"
                maxLength={120}
                className="w-full min-w-0 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => deplacer(photo.id, "gauche")}
                  disabled={index === 0}
                  aria-label="Déplacer avant"
                  className="flex h-9 w-9 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-gray-900 disabled:opacity-30"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => deplacer(photo.id, "droite")}
                  disabled={index === photos.length - 1}
                  aria-label="Déplacer après"
                  className="flex h-9 w-9 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-gray-900 disabled:opacity-30"
                >
                  ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
