interface CategoryIconProps {
  id: number;
  className?: string;
}

export function CategoryIcon({ id, className = "size-12" }: CategoryIconProps) {
  switch (id) {
    case 1:
      // পরিবার ও গৃহস্থালি (Family & Household) - House with red roof, cyan walls, door, window
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Chimney */}
          <rect x="42" y="14" width="6" height="12" fill="#c0392b" rx="1" />
          {/* Walls */}
          <rect
            x="14"
            y="28"
            width="36"
            height="26"
            fill="#e0f2fe"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Roof */}
          <polygon
            points="32,8 8,28 14,28 14,29 50,29 50,28 56,28"
            fill="#ef4444"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Window */}
          <rect
            x="19"
            y="34"
            width="9"
            height="9"
            fill="#38bdf8"
            stroke="#1e293b"
            strokeWidth="2"
            rx="1"
          />
          <line x1="23.5" y1="34" x2="23.5" y2="43" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="19" y1="38.5" x2="28" y2="38.5" stroke="#1e293b" strokeWidth="1.5" />
          {/* Door */}
          <rect
            x="35"
            y="35"
            width="10"
            height="19"
            fill="#b91c1c"
            stroke="#1e293b"
            strokeWidth="2"
            rx="1"
          />
          <circle cx="38" cy="45" r="1" fill="#fef08a" />
        </svg>
      );

    case 2:
      // ই-কমার্স ও B2B (E-Commerce & B2B) - Shopping Cart
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Handle and chassis */}
          <path
            d="M10 14h8l6 24h24l5-17H21"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Basket grid lines */}
          <line x1="28" y1="21" x2="26" y2="38" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="21" x2="35" y2="38" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="44" y1="21" x2="43" y2="38" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="27" x2="49" y2="27" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="23" y1="33" x2="46" y2="33" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          {/* Wheels */}
          <circle cx="27" cy="46" r="4.5" fill="#1e293b" />
          <circle cx="27" cy="46" r="2" fill="#f8fafc" />
          <circle cx="44" cy="46" r="4.5" fill="#1e293b" />
          <circle cx="44" cy="46" r="2" fill="#f8fafc" />
        </svg>
      );

    case 3:
      // মেরামত সেবা (Repair Services) - Wrench / Spanner
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <g transform="rotate(-45 32 32)">
            <path
              d="M26 12a10 10 0 0 1 12 0l-5 7h-2l-5-7zm-2 10h16v24h-16V22zm2 26l6 6 6-6v-2h-12v2z"
              fill="#cbd5e1"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M32 16v18"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="32" cy="48" r="2.5" fill="#1e293b" />
          </g>
        </svg>
      );

    case 4:
      // কৃষি ও শ্রমিক (Agriculture & Labor) - Wheat & Sprout
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Stem */}
          <path
            d="M32 54C32 38 34 20 42 12"
            stroke="#15803d"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Green leaves */}
          <path
            d="M32 46C24 44 18 36 20 28C26 28 32 36 32 46Z"
            fill="#22c55e"
            stroke="#15803d"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M33 36C40 34 46 26 44 18C38 18 33 26 33 36Z"
            fill="#4ade80"
            stroke="#15803d"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Golden wheat grains */}
          <ellipse cx="40" cy="18" rx="4" ry="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(25 40 18)" />
          <ellipse cx="44" cy="12" rx="3.5" ry="5.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(35 44 12)" />
          <ellipse cx="36" cy="22" rx="3.5" ry="5.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(15 36 22)" />
        </svg>
      );

    case 5:
      // নির্মাণ (Construction) - Building with crane
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Building */}
          <rect
            x="24"
            y="26"
            width="28"
            height="28"
            fill="#f97316"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Scaffolding/windows */}
          <rect x="29" y="31" width="6" height="6" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="41" y="31" width="6" height="6" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="29" y="42" width="6" height="8" fill="#1e293b" />
          <rect x="41" y="42" width="6" height="6" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />
          {/* Crane mast */}
          <path d="M16 54V12h20" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 16l8-4" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
          {/* Cable & hook */}
          <path d="M32 12v12" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="32" cy="25" r="1.5" fill="#1e293b" />
        </svg>
      );

    case 6:
      // পরিবহন ও বাস টিকিট (Transport & Bus Ticket) - Bus
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Bus body */}
          <rect
            x="14"
            y="16"
            width="36"
            height="32"
            rx="6"
            fill="#38bdf8"
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          {/* Windshield */}
          <rect
            x="18"
            y="21"
            width="28"
            height="13"
            rx="2"
            fill="#e0f2fe"
            stroke="#1e293b"
            strokeWidth="2"
          />
          {/* Center divider */}
          <line x1="32" y1="21" x2="32" y2="34" stroke="#1e293b" strokeWidth="1.5" />
          {/* Grille */}
          <rect x="24" y="38" width="16" height="4" rx="1" fill="#facc15" stroke="#1e293b" strokeWidth="1.5" />
          {/* Headlights */}
          <circle cx="19" cy="40" r="2.5" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="45" cy="40" r="2.5" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />
          {/* Wheels */}
          <rect x="18" y="47" width="7" height="4" rx="2" fill="#1e293b" />
          <rect x="39" y="47" width="7" height="4" rx="2" fill="#1e293b" />
        </svg>
      );

    case 7:
      // ট্যুরিজম (Tourism) - Rolling Suitcase / Luggage
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Handle */}
          <path
            d="M26 18V10h12v8"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Suitcase body */}
          <rect
            x="18"
            y="18"
            width="28"
            height="34"
            rx="4"
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          {/* Front ridges */}
          <line x1="24" y1="24" x2="24" y2="46" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="24" x2="32" y2="46" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="40" y1="24" x2="40" y2="46" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          {/* Wheels */}
          <circle cx="23" cy="53" r="2.5" fill="#1e293b" />
          <circle cx="41" cy="53" r="2.5" fill="#1e293b" />
        </svg>
      );

    case 8:
      // স্বাস্থ্যসেবা (Healthcare) - Clinic with Red Cross
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Clinic body */}
          <rect
            x="16"
            y="18"
            width="32"
            height="36"
            rx="3"
            fill="#f0fdf4"
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          {/* Red Cross Badge */}
          <rect x="26" y="24" width="12" height="4" fill="#ef4444" rx="1" />
          <rect x="30" y="20" width="4" height="12" fill="#ef4444" rx="1" />
          {/* Windows */}
          <rect x="20" y="36" width="6" height="6" fill="#bae6fd" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="38" y="36" width="6" height="6" fill="#bae6fd" stroke="#1e293b" strokeWidth="1.5" />
          {/* Door */}
          <rect x="28" y="44" width="8" height="10" fill="#22c55e" stroke="#1e293b" strokeWidth="1.5" />
        </svg>
      );

    case 9:
      // ইভেন্ট (Events) - Party Popper / Cone
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Party Hat / Cone */}
          <g transform="rotate(-15 32 32)">
            <polygon
              points="32,14 18,48 46,48"
              fill="#a855f7"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Pattern stripes */}
            <path d="M22 38h20" stroke="#facc15" strokeWidth="3" />
            <path d="M26 28h12" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="32" cy="13" r="3" fill="#f43f5e" />
          </g>
          {/* Confetti */}
          <circle cx="16" cy="20" r="2" fill="#facc15" />
          <circle cx="48" cy="18" r="2" fill="#38bdf8" />
          <circle cx="50" cy="30" r="1.5" fill="#f43f5e" />
          <rect x="14" y="32" width="3" height="3" fill="#22c55e" transform="rotate(30 14 32)" />
          <rect x="46" y="42" width="3" height="3" fill="#fb923c" transform="rotate(45 46 42)" />
        </svg>
      );

    case 10:
      // ISP ও ইউটিলিটি (ISP & Utility) - Globe Network
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Globe circle */}
          <circle cx="32" cy="32" r="20" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
          {/* Equator & parallels */}
          <line x1="12" y1="32" x2="52" y2="32" stroke="#0284c7" strokeWidth="2" />
          <path d="M15 22c5 4 29 4 34 0" stroke="#0284c7" strokeWidth="1.5" fill="none" />
          <path d="M15 42c5-4 29-4 34 0" stroke="#0284c7" strokeWidth="1.5" fill="none" />
          {/* Meridians */}
          <ellipse cx="32" cy="32" rx="10" ry="20" fill="none" stroke="#0284c7" strokeWidth="2" />
          <line x1="32" y1="12" x2="32" y2="52" stroke="#0284c7" strokeWidth="2" />
        </svg>
      );

    case 11:
      // চাকরি ও পেশাজীবী (Jobs & Professionals) - Briefcase
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Handle */}
          <path
            d="M26 22v-5h12v5"
            fill="none"
            stroke="#78350f"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Briefcase body */}
          <rect
            x="14"
            y="22"
            width="36"
            height="26"
            rx="4"
            fill="#92400e"
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          {/* Corner patches & lock */}
          <path d="M14 32h36" stroke="#1e293b" strokeWidth="2" />
          <rect x="29" y="30" width="6" height="5" rx="1" fill="#facc15" stroke="#1e293b" strokeWidth="1.5" />
        </svg>
      );

    case 12:
      // সামাজিক ফিড (Social Feed) - Chat Bubble
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Speech bubble */}
          <path
            d="M16 20h32a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H26l-8 6v-6h-2a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* 3 dots */}
          <circle cx="24" cy="32" r="2.5" fill="#1e293b" />
          <circle cx="32" cy="32" r="2.5" fill="#1e293b" />
          <circle cx="40" cy="32" r="2.5" fill="#1e293b" />
        </svg>
      );

    case 13:
      // পেমেন্ট ও কমপ্লায়েন্স (Payment & Compliance) - Credit Card
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Card */}
          <rect
            x="12"
            y="20"
            width="40"
            height="26"
            rx="4"
            fill="#facc15"
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          {/* Magnetic stripe */}
          <rect x="12" y="25" width="40" height="6" fill="#1e293b" />
          {/* Chip */}
          <rect x="17" y="34" width="7" height="6" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        </svg>
      );

    default:
      return null;
  }
}
