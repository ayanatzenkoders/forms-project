/*
 * The pale mountain range along the bottom of every form page.
 *
 * Colour + opacity come straight from the Figma Properties panel:
 *   fill #4EC0ED, opacity 15%.
 *
 * preserveAspectRatio="none" lets the artwork stretch to any screen width
 * instead of being cropped, and aria-hidden marks it as pure decoration so
 * screen readers skip it.
 */
export default function MountainFooter() {
  return (
    <div className="pointer-events-none w-full" aria-hidden="true">
      <svg
        viewBox="0 0 944 219"
        preserveAspectRatio="none"
        className="h-32 w-full sm:h-44"
        fill="none"
      >
        <g opacity="0.15" fill="#4EC0ED">
          {/* back range */}
          <path d="M0 219 L180 96 L330 219 Z" />
          <path d="M250 219 L470 60 L700 219 Z" />
          <path d="M600 219 L800 110 L944 219 Z" />
          {/* front range, slightly darker by overlapping */}
          <path d="M120 219 L300 130 L470 219 Z" />
          <path d="M480 219 L660 140 L840 219 Z" />
        </g>
      </svg>
    </div>
  );
}
