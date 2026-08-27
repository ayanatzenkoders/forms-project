/*
 * "Jades Health" wordmark with the small mountain glyph above it.
 * Inline SVG (not an image file) so it stays crisp at any size and can be
 * recoloured with CSS if the brand colour ever changes.
 */
export default function JadeLogo() {
  return (
    <div className="flex flex-col items-start leading-none">
      <svg
        width="52"
        height="16"
        viewBox="0 0 52 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 15 L16 2 L26 15 Z" fill="#1B75BC" />
        <path d="M18 15 L30 5 L42 15 Z" fill="#4EC0ED" />
      </svg>
      <span className="mt-1 text-sm font-semibold tracking-tight text-[#1B4B7F]">
        Jades Health
      </span>
    </div>
  );
}
