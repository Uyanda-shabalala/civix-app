// MVP-scoped ward lookup: checks a coordinate against the pilot ward's boundary only.
//
// Full national ward matching would need the Municipal Demarcation Board's complete
// ward boundary dataset (~4,277 polygons) — real scope, not something to bolt on
// under deadline. This checks against ONE ward's polygon, matching the "start with
// one pilot ward" rollout plan already in the pitch deck.
//
// >>> REPLACE THIS PLACEHOLDER POLYGON before the demo <<<
// Get your real pilot ward's boundary from https://www.demarcation.org.za
// (Ward Boundary GIS data, exported as GeoJSON) and paste its coordinate ring below.
// This placeholder is a small illustrative rectangle, not a real ward shape.

export const PILOT_WARD = {
  code: "1576",
  name: "Ward 1576",
  // [lng, lat] pairs forming a closed ring — GeoJSON coordinate order (lng first!)
  boundary: [
    [28.03, -26.11],
    [28.06, -26.11],
    [28.06, -26.08],
    [28.03, -26.08],
    [28.03, -26.11],
  ],
};

/** Standard ray-casting point-in-polygon test. `point` is [lng, lat]. */
function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }

  return inside;
}

/**
 * Returns the pilot ward's code if the coordinate falls inside it, otherwise null
 * (meaning: fall back to letting the resident type their ward manually).
 */
export function lookupWard(lat, lng) {
  if (lat == null || lng == null) return null;
  return pointInPolygon([lng, lat], PILOT_WARD.boundary) ? PILOT_WARD.code : null;
}
