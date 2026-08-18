"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PageLogin() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur("");
    setEnCours(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error) {
      console.error("Erreur connexion admin :", error);
      setErreur("Email ou mot de passe incorrect.");
      setEnCours(false);
      return;
    }

    // Rechargement complet (pas router.push+refresh) : un super-admin doit
    // passer par la redirection serveur vers /admin/plateforme dès la
    // connexion, ce qu'une transition client ne déclenche pas de façon fiable.
    window.location.href = "/admin";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-gray-900">NEHMA</h1>
        <p className="mt-1 text-center text-sm text-gray-500">Espace de gestion</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
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
              type="password"
              autoComplete="current-password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {erreur && <p className="text-sm font-medium text-red-600">{erreur}</p>}

          <button
            type="submit"
            disabled={enCours}
            className="w-full rounded-xl bg-gray-900 px-4 py-2.5 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {enCours ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
