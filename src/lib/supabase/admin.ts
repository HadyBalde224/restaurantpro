import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client avec la clé service_role : contourne totalement la RLS et peut créer
// des comptes auth pour d'autres utilisateurs (supabase.auth.admin.*).
// ⚠️ Ne JAMAIS importer ce fichier ailleurs que dans les Server Actions de
// src/app/admin/(protege)/plateforme/ — la clé ne doit jamais atteindre le
// navigateur (pas de préfixe NEXT_PUBLIC) ni être utilisée pour des requêtes
// qui pourraient passer par un contexte accessible au client.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
