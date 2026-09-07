/** The dither alphabet of the companion mark — the art uses nothing else. */
const GLYPHS = ["{", "}", "=", ">", "<"] as const;

/**
 * Deterministic noise glyph for a cell. A hash rather than `Math.random` so
 * the banner is byte-identical on every load — a face that reshuffles itself
 * between refreshes reads as a rendering bug, not as texture.
 */
function glyphAt(x: number, y: number): string {
  let h = Math.imul(x, 73856093) ^ Math.imul(y, 19349663);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return GLYPHS[Math.abs(h ^ (h >>> 16)) % GLYPHS.length];
}

/**
 * Rescales ASCII art horizontally to a target column count.
 *
 * The art is authored on a square grid, but a console cell is roughly 0.6em
 * wide and a full line-height tall — so drawn as-is the face comes out at
 * about half its intended width. Columns are resampled nearest-neighbour and
 * every ink cell is re-dithered from the source alphabet, so the wider art
 * reads as noise instead of as doubled-up glyphs.
 *
 * @param rows - Source art, one string per line; ragged rows are padded.
 * @param columns - Target width in characters.
 */
export function widenAscii(
  rows: readonly string[],
  columns: number,
): string[] {
  const width = Math.max(...rows.map((row) => row.length));
  return rows.map((row, y) => {
    const padded = row.padEnd(width, " ");
    let out = "";
    for (let x = 0; x < columns; x++) {
      const isInk = padded[Math.floor((x * width) / columns)] !== " ";
      out += isInk ? glyphAt(x, y) : " ";
    }
    return out.trimEnd();
  });
}
