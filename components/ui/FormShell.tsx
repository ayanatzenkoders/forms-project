import MountainFooter from "./MountainFooter";

/*
 * The page frame every step of every form shares:
 *   white card with a title -> action buttons -> mountains.
 *   (The logo and progress bar live in the layout - they never change.)
 *
 * Only `title` and `children` change between steps, so each Page component
 * stops repeating this markup and just describes its own fields.
 */
interface Props {
  title: string;
  children: React.ReactNode;
  // The Back / Next buttons. They sit OUTSIDE the card (as in the design),
  // so the shell takes them as a separate slot rather than as children.
  actions?: React.ReactNode;
}

export default function FormShell({ title, children, actions }: Props) {
  return (
    <div className="flex-1 flex flex-col bg-white text-slate-900">
      {/* flex-1 makes this area absorb the leftover height */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-center text-lg font-semibold text-slate-800">
              {title}
            </h1>

            {/* {Childern} is the All the HTML and everything accepted other components} */}
            <div className="space-y-4">{children}</div>
          </div>
          {/* This is the action buttons Next and Back and Submit which we send through <FormAction />*/}
          {actions && <div className="mt-6">{actions}</div>}
        </div>
      </main>

      <MountainFooter />
    </div>
  );
}
