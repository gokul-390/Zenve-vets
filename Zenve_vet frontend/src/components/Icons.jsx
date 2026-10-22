import React from 'react';

// Geometric origami animal logo (dog / cat silhouette) matching ZENVE VET
export const ZenveLogo = ({ className = '', size = 38 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Geometric origami facets in gold/bronze palette */}
    {/* Left ear */}
    <polygon points="35,14 47,32 30,34" fill="#C99738" />
    <polygon points="35,14 30,34 22,26" fill="#B3802A" />
    
    {/* Right ear */}
    <polygon points="65,14 78,26 70,34" fill="#B3802A" />
    <polygon points="65,14 70,34 53,32" fill="#D6A544" />
    
    {/* Forehead & brow */}
    <polygon points="35,14 50,22 65,14 50,30" fill="#E2B755" />
    <polygon points="47,32 50,30 53,32 50,44" fill="#C99738" />
    <polygon points="30,34 47,32 50,44 32,48" fill="#B6832A" />
    <polygon points="70,34 53,32 50,44 68,48" fill="#DCAE4A" />
    
    {/* Cheeks */}
    <polygon points="22,26 30,34 32,48 18,44" fill="#A87522" />
    <polygon points="78,26 70,34 68,48 82,44" fill="#C99738" />
    
    {/* Snout & muzzle */}
    <polygon points="32,48 50,44 50,62 38,68" fill="#B3802A" />
    <polygon points="68,48 50,44 50,62 62,68" fill="#E0B34F" />
    <polygon points="38,68 50,62 62,68 50,74" fill="#8E5E16" />
    
    {/* Lower chest origami folds */}
    <polygon points="38,68 50,74 44,90 28,78" fill="#9F6F1D" />
    <polygon points="62,68 50,74 56,90 72,78" fill="#CCA040" />
    <polygon points="50,74 44,90 56,90" fill="#BA892B" />
  </svg>
);

// Home Icon: Modern house outline matching ZenveVet icon style
export const HomeIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15C14.45 21 14 20.55 14 20V15C14 14.45 13.55 14 13 14H11C10.45 14 10 14.45 10 15V20C10 20.55 9.55 21 9 21H4C3.45 21 3 20.55 3 20V10.5Z" />
  </svg>
);

// Feed Icon: Leaf inside angled oval
export const FeedIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Encapsulating circle/oval */}
    <circle cx="12" cy="12" r="9.5" />
    {/* Leaf shape inside */}
    <path d="M7.5 15.5C8 12.5 10.5 9 16 8C15 13.5 11.5 16 8.5 16.5" />
    {/* Central leaf vein */}
    <path d="M8.5 15.5L13.5 10.5" />
  </svg>
);

// Vet Network Icon: People outline
export const VetNetworkIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Main person */}
    <circle cx="9" cy="7" r="3.2" />
    <path d="M3.5 18.5C3.5 15.2 6 13.2 9 13.2C12 13.2 14.5 15.2 14.5 18.5" />
    {/* Second connected person */}
    <circle cx="16.5" cy="8" r="2.5" />
    <path d="M15.5 13.5C17.2 13.8 20.5 15 20.5 18.2" />
  </svg>
);

// Clinical Cases Icon: Medical briefcase with cross
export const ClinicalCasesIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Handle */}
    <path d="M9 6.5V5C9 4.2 9.7 3.5 10.5 3.5H13.5C14.3 3.5 15 4.2 15 5V6.5" />
    {/* Bag body */}
    <rect x="3.5" y="6.5" width="17" height="13.5" rx="2.5" />
    {/* Medical cross */}
    <path d="M12 10.5V15.5" />
    <path d="M9.5 13H14.5" />
  </svg>
);

// Short Videos Icon: Video frame with play symbol
export const ShortVideosIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Screen / Clapper frame */}
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    {/* Play triangle */}
    <polygon points="10,9.5 15,12 10,14.5" fill={color} stroke="none" />
  </svg>
);

// Messages Icon: Rounded speech bubble
export const MessagesIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.5 12C20.5 16.14 16.69 19.5 12 19.5C10.5 19.5 9.08 19.14 7.84 18.5L4 19.5L5.1 16.03C4.1 14.86 3.5 13.5 3.5 12C3.5 7.86 7.31 4.5 12 4.5C16.69 4.5 20.5 7.86 20.5 12Z" />
  </svg>
);

// Search Icon
export const SearchIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M16 16L20.5 20.5" />
  </svg>
);

// Member Benefits Icon: Ribbon badge
export const MemberBenefitsIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Badge circle */}
    <circle cx="12" cy="9" r="5.5" />
    {/* Ribbon tails */}
    <path d="M8.5 13.5L7 21L12 18.2L17 21L15.5 13.5" />
  </svg>
);

// Advertise Icon: Megaphone
export const AdvertiseIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3.5 11H6.5L14.5 5.5V18.5L6.5 13H3.5C2.67 13 2 12.33 2 11.5C2 10.67 2.67 10 3.5 10Z" />
    <path d="M18.5 8.5C19.8 9.5 20.5 10.7 20.5 12C20.5 13.3 19.8 14.5 18.5 15.5" />
    <path d="M7 13V18.5C7 19.3 7.7 20 8.5 20C9.3 20 10 19.3 10 18.5V13" />
  </svg>
);

// Plus Icon
export const PlusIcon = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Chevron Down Icon
export const ChevronDownIcon = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
