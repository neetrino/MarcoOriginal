/**
 * When the server board refreshes after saving one row, keep local drafts
 * that the admin still has not saved on other rows.
 */
export function mergePreservingDirtyDrafts(
  previousBoard: Record<string, string>,
  nextBoard: Record<string, string>,
  currentDrafts: Record<string, string>,
): Record<string, string> {
  const merged: Record<string, string> = { ...nextBoard };

  for (const [id, draft] of Object.entries(currentDrafts)) {
    const previousSaved = previousBoard[id] ?? "";
    const nextSaved = nextBoard[id] ?? "";
    const isDirty = draft !== previousSaved;
    if (isDirty && draft !== nextSaved) {
      merged[id] = draft;
    }
  }

  return merged;
}
