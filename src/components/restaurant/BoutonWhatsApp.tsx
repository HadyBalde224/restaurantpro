export default function BoutonWhatsApp({
  whatsapp,
  nom,
}: {
  whatsapp: string;
  nom: string;
}) {
  if (!whatsapp) return null;

  const message = encodeURIComponent(`Bonjour ${nom} !`);
  const href = `https://wa.me/${whatsapp}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-110"
      style={{ background: "#25D366" }}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.343.652 4.53 1.785 6.4L4 29l7.79-1.75A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16.001 3zm0 21.7c-1.96 0-3.79-.55-5.35-1.5l-.383-.23-4.62 1.04 1.02-4.5-.25-.39A9.68 9.68 0 0 1 6.3 15c0-5.35 4.35-9.7 9.7-9.7s9.7 4.35 9.7 9.7-4.349 9.7-9.699 9.7zm5.34-7.27c-.29-.145-1.72-.85-1.99-.945-.267-.098-.462-.145-.656.145-.194.29-.75.945-.92 1.14-.17.194-.34.218-.63.073-.29-.145-1.224-.451-2.332-1.437-.862-.768-1.444-1.717-1.613-2.007-.169-.29-.018-.446.127-.59.13-.13.29-.34.435-.51.145-.17.194-.29.29-.484.097-.194.048-.363-.024-.508-.073-.145-.656-1.58-.9-2.164-.237-.57-.478-.492-.656-.5l-.559-.01c-.194 0-.508.073-.774.363-.267.29-1.02.996-1.02 2.43s1.044 2.82 1.19 3.014c.145.194 2.055 3.14 4.98 4.404.696.3 1.238.48 1.66.615.697.222 1.332.19 1.833.115.559-.083 1.72-.703 1.962-1.382.243-.678.243-1.26.17-1.382-.073-.121-.267-.194-.556-.34z" />
      </svg>
    </a>
  );
}
