interface CTLogoProps {
  size?: number;
  fillColor?: string;
}

export default function CTLogo({ size = 32, fillColor = '#162F4A' }: CTLogoProps) {
  return (
    <svg
      className="ct-mark"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" fill={fillColor} />
      <path
        d="M65 27 C55 27 46 35.5 46 46 C46 56.5 55 65 65 65"
        stroke="white"
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="35" y1="35" x2="65" y2="35" stroke="white" strokeWidth="7.5" strokeLinecap="round" />
      <line x1="50" y1="35" x2="50" y2="69" stroke="white" strokeWidth="7.5" strokeLinecap="round" />
      <circle cx="50" cy="46" r="8.5" fill="#C47B2B" />
      <circle cx="50" cy="46" r="5" fill="#E8A44A" />
      <circle cx="50" cy="46" r="2" fill="white" />
    </svg>
  );
}
