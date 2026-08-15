"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BoutonDeconnexion() {
  const router = useRouter();
  const supabase = createClient();

  const seDeconnecter = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={seDeconnecter}
      className="text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-900"
    >
      Déconnexion
    </button>
  );
}
