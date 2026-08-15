import type { ReactNode } from "react";

export default function TitreSection({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold md:text-5xl">{children}</h2>
      <span
        className="mx-auto mt-5 block h-1 w-16 rounded-full"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
    </div>
  );
}
