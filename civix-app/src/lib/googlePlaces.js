// Wraps Google's *new* Places API (REST) — not the older google.maps.places.Autocomplete
// widget most tutorials show. New Google Cloud projects only get access to the new API,
// so this is the version that will actually work for a freshly created project.
//
// Needs VITE_GOOGLE_MAPS_API_KEY in .env, with "Places API (New)" and
// "Geocoding API" both enabled in Google Cloud Console, billing turned on.

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Get address predictions as the user types.
 * `sessionToken` should be the same string for every keystroke of one search,
 * then thrown away after a place is selected — this is what keeps Google's
 * per-session billing cheap instead of billing every keystroke separately.
 */
export async function fetchAddressPredictions(input, sessionToken) {
  if (!input || input.length < 3) return [];

  const res = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
      },
      body: JSON.stringify({
        input,
        sessionToken,
        includedRegionCodes: ["za"], // bias to South Africa
      }),
    },
  );

  if (!res.ok) {
    console.error("Places autocomplete failed", await res.text());
    return [];
  }

  const data = await res.json();
  return (data.suggestions ?? [])
    .filter((s) => s.placePrediction)
    .map((s) => ({
      placeId: s.placePrediction.placeId,
      mainText:
        s.placePrediction.structuredFormat?.mainText?.text ??
        s.placePrediction.text?.text,
      secondaryText:
        s.placePrediction.structuredFormat?.secondaryText?.text ?? "",
      fullText: s.placePrediction.text?.text,
    }));
}

/** Resolve a selected prediction into a formatted address + coordinates. */
export async function fetchPlaceDetails(placeId, sessionToken) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "formattedAddress,location",
        sessionToken,
      },
    },
  );

  if (!res.ok) {
    console.error("Place details failed", await res.text());
    return null;
  }

  const data = await res.json();
  return {
    address: data.formattedAddress,
    lat: data.location?.latitude,
    lng: data.location?.longitude,
  };
}

/** Turn raw coordinates (from "Use current location") into a readable address. */
export async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`,
  );
  if (!res.ok) return null;

  const data = await res.json();
  const first = data.results?.[0];
  return first ? first.formatted_address : null;
}

/** Generates a fresh session token — call once per new address search. */
export function newSessionToken() {
  return crypto.randomUUID();
}
