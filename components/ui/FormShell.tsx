import MountainFooter from "./MountainFooter";

/*
 * The page frame every step of every form shares:
 *   white card with a title -> action buttons -> mountains.
 *   (The logo and progress bar live in the layout - they never change.)
 *
 * Only `title`, `children` and `onSubmit` change between steps, so each Page
 * component stops repeating this markup and just describes its own fields.
 *
 * THE SHELL OWNS THE <form>. Two reasons:
 *  1. The Next/Submit button sits OUTSIDE the card, so it still needs to be
 *     inside the form element to submit it.
 *  2. Height chain: layout(min-h-dvh flex-col) > form > shell-content > footer.
 *     Every element in the middle of a flex chain plays two roles - a flex ITEM
 *     of its parent (needs `flex-1` to claim leftover space) and a flex
 *     CONTAINER for its children (needs `flex flex-col`). Keeping the form here
 *     means no page can forget those classes and break the sticky footer.
 */
interface Props {
  title: string;
  children: React.ReactNode;
  // Pass react-hook-form's handleSubmit(onSubmit).
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  // The Back / Next buttons. They sit OUTSIDE the card (as in the design),
  // so the shell takes them as a separate slot rather than as children.
  actions?: React.ReactNode;
}

export default function FormShell({
  title,
  children,
  onSubmit,
  actions,
}: Props) {
  return (
    // flex-1  -> as an ITEM, grow to fill the height the layout left over
    // flex flex-col -> as a CONTAINER, stack main + footer vertically
    <form
      onSubmit={onSubmit}
      className="flex flex-1 flex-col bg-white text-slate-900"
    >
      {/* flex-1 makes this area absorb the leftover height, which pushes the
          mountains to the bottom on short forms. On long forms the parent's
          min-height simply grows and the page scrolls instead. */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-center text-lg font-semibold text-slate-800">
              {title}
            </h1>

            {/* {children} is all the fields the individual page passes in */}
            <div className="space-y-4">{children}</div>
          </div>
          {/* Action buttons (Next / Back / Submit) sent in via <FormActions /> */}
          {actions && <div className="mt-6">{actions}</div>}
        </div>
      </main>

      <MountainFooter />
    </form>
  );
}
