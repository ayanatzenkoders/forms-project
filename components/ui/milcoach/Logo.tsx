/*
 * militarycoach.ai wordmark. Inline SVG so it stays crisp and can be
 * recoloured with CSS.
 */
export default function MilCoachLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 2 36 11v18L20 38 4 29V11L20 2z"
          stroke="#6DBE45"
          strokeWidth="2"
          fill="#F1F9EC"
        />
        <circle cx="14" cy="17" r="3" fill="#6DBE45" />
        <circle cx="20" cy="15" r="3.5" fill="#4F9E2E" />
        <circle cx="26" cy="17" r="3" fill="#6DBE45" />
        <path
          d="M9 27c1.5-4 4-6 5-6m16 6c-1.5-4-4-6-5-6m-8 6c1-4 2.5-5.5 3-5.5s2 1.5 3 5.5"
          stroke="#4F9E2E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="leading-none">
        <p className="text-lg font-semibold tracking-tight text-slate-800">
          militarycoach<span className="text-[#6DBE45]">.ai</span>
        </p>
        <p className="text-[7px] uppercase tracking-[0.18em] text-slate-400">
          Empowering Heroes for a New Frontier
        </p>
      </div>
    </div>
  );
}
