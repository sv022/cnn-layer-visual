export function getCellSize(rows: number, cols: number, targetPx = 320, maxCellPx = 28): number {
  const dimension = Math.max(rows, cols)
  if (dimension === 0) return maxCellPx
  return Math.min(maxCellPx, Math.floor(targetPx / dimension))
}
