type IconProps = React.SVGAttributes<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  );
}

export function HeartIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 20.5s-7.5-4.8-10-9.6C.5 7.4 2.4 4 6 4c2.1 0 3.7 1.2 6 3.6C14.3 5.2 15.9 4 18 4c3.6 0 5.5 3.4 4 6.9-2.5 4.8-10 9.6-10 9.6Z" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5H8.5A1.5 1.5 0 0 1 7 20.5L6 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base} className="flip-rtl" {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 1.9h6a2 2 0 0 0 2-1.9l1-13" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 8v8l8.5 4 8.5-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12.6 3.5h5.4a1.5 1.5 0 0 1 1.5 1.5v5.4a1.5 1.5 0 0 1-.44 1.06l-8.5 8.5a1.5 1.5 0 0 1-2.12 0l-5.4-5.4a1.5 1.5 0 0 1 0-2.12l8.5-8.5A1.5 1.5 0 0 1 12.6 3.5Z" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 20c1.2-3.3 3.7-5 6.5-5s5.3 1.7 6.5 5" />
      <circle cx="17" cy="8.5" r="2.3" />
      <path d="M15.5 12.2c1.9.4 3.4 1.7 4.3 3.9" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="M20.5 15.5 15 10l-8 8" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1h-.2a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6v-.2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 16.5 10 10l4 4 6.5-6.5" />
      <path d="M15.5 7.5h5v5" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" />
      <path d="M16 16l4-4-4-4" />
      <path d="M20 12H9" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.2" />
      <path d="M10.5 18h3" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="1.8" />
      <path d="m3.5 6 8.5 6.5L20.5 6" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21.5S5 15 5 9.8a7 7 0 0 1 14 0C19 15 12 21.5 12 21.5Z" />
      <circle cx="12" cy="9.6" r="2.4" />
    </svg>
  );
}

export function NoteTextIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2.5h9l4.5 4.5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-17.5a1 1 0 0 1 1-1Z" />
      <path d="M15 2.5V7h4.5" />
      <path d="M8 12.5h8M8 16h5.5" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="6" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <circle cx="17" cy="14.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="6" width="20" height="12" rx="1.6" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M5.5 8.5v0M18.5 15.5v0" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12.5l5 5 11-11" />
    </svg>
  );
}

export function PrinterIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8.5V3.5h12v5" />
      <rect x="3.5" y="8.5" width="17" height="8.5" rx="1.6" />
      <rect x="7" y="13.5" width="10" height="7" />
      <path d="M17 12h.01" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M13.6 21v-7.1h2.2l.3-2.6h-2.5V9.6c0-.75.2-1.3 1.3-1.3h1.4V6c-.25-.03-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v1.8H8.6v2.6h2.3V21" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3v10.3a3 3 0 1 1-2.2-2.9" />
      <path d="M14 3c.3 2.5 2 4.3 4.4 4.6v2.3c-1.6 0-3.1-.5-4.4-1.4" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.5 8.5c.3-.8 1.6-.8 1.9 0 .3.7 0 1.6-.4 2.1.5 1.4 1.7 2.6 3.1 3.1.5-.4 1.4-.7 2.1-.4.8.3.8 1.6 0 1.9-1.6.6-3.7-.1-5.3-1.7-1.6-1.6-2.3-3.7-1.4-5z" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a15.6 15.6 0 0 1-3.4 4.3M6.6 6.6C4 8.3 2 12 2 12s3.6 7 10 7c1.4 0 2.7-.3 3.8-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4" />
    </svg>
  );
}
