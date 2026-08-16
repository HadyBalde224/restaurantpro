type IconeProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function Svg({
  size = 20,
  className,
  strokeWidth = 2,
  children,
}: IconeProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconeDashboard(props: IconeProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Svg>
  );
}

export function IconeMenu(props: IconeProps) {
  return (
    <Svg {...props}>
      <path d="M6 2v6a2 2 0 0 0 4 0V2" />
      <path d="M8 10v12" />
      <path d="M18 2c-1.5 2-2.5 4.5-2.5 7 0 2 1 3 2.5 3s2.5-1 2.5-3c0-2.5-1-5-2.5-7Z" />
      <path d="M18 12v10" />
    </Svg>
  );
}

export function IconeCalendrier(props: IconeProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 9h18" />
    </Svg>
  );
}

export function IconeEtoile(props: IconeProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.6l-5.9 3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5Z" />
    </Svg>
  );
}

export function IconeReglages(props: IconeProps) {
  return (
    <Svg {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="7" cy="18" r="2" />
    </Svg>
  );
}

export function IconeDeconnexion(props: IconeProps) {
  return (
    <Svg {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Svg>
  );
}

export function IconeBurger(props: IconeProps) {
  return (
    <Svg {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Svg>
  );
}

export function IconeCroix(props: IconeProps) {
  return (
    <Svg {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

export function IconeFlecheGauche(props: IconeProps) {
  return (
    <Svg {...props}>
      <path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

export function IconeFlecheDroite(props: IconeProps) {
  return (
    <Svg {...props}>
      <path d="M9 18l6-6-6-6" />
    </Svg>
  );
}
