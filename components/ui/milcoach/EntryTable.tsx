"use client";

/*
 * The list of already-added entries (work experience rows, education rows,
 * certificates) with edit and delete icons.
 *
 * Generic on purpose: the page decides the columns, so one component serves
 * all three tables. `rows` is an array of arrays - one inner array per row,
 * each item being what to render in that column (string OR JSX for chips).
 */
interface Props {
  title: string;
  columns: string[];
  rows: React.ReactNode[][];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function EntryTable({
  title,
  columns,
  rows,
  onEdit,
  onDelete,
}: Props) {
  // Nothing added yet -> render nothing at all (the design has no empty state).
  if (rows.length === 0) return null;

  return (
    <div className="border-t border-slate-200 pt-4">
      <p className="mb-3 text-sm font-medium text-[#4F9E2E]">{title}</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="text-slate-700">
              {columns.map((column) => (
                <th key={column} className="pb-2 font-semibold">
                  {column}
                </th>
              ))}
              <th className="pb-2" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-slate-100 align-top">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-3 pr-4 text-slate-600">
                    {cell}
                  </td>
                ))}

                <td className="py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(index)}
                      aria-label="Edit entry"
                      className="text-[#6DBE45] hover:text-[#4F9E2E]"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(index)}
                      aria-label="Delete entry"
                      className="text-red-400 hover:text-red-600"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
