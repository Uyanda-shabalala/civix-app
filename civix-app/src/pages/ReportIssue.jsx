import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../lib/categories";
import { reverseGeocode } from "../lib/googlePlaces";
import { lookupWard, PILOT_WARD } from "../lib/wardLookup";
import AddressAutocomplete from "../components/AddressAutocomplete";

export default function ReportIssue({ draft, setDraft }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(
    draft.address || profile?.street_address || "",
  );
  const [category, setCategory] = useState(draft.category || "pothole");
  const [description, setDescription] = useState(draft.description || "");
  const [photoFile, setPhotoFile] = useState(draft.photoFile || null);
  const [photoPreview, setPhotoPreview] = useState(draft.photoPreview || null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(draft.coords || null);
  const [detectedWard, setDetectedWard] = useState(draft.detectedWard || null);
  const [wardChecked, setWardChecked] = useState(false);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  // Fires whenever we have a confirmed lat/lng, whether from autocomplete
  // selection or from "use current location".
  function applyCoords(lat, lng) {
    setCoords({ lat, lng });
    setDetectedWard(lookupWard(lat, lng));
    setWardChecked(true);
  }

  function handleAddressSelect({ address: fullAddress, lat, lng }) {
    setAddress(fullAddress);
    applyCoords(lat, lng);
  }

  async function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        applyCoords(lat, lng);
        // Autofill the address field with the real address at that location,
        // instead of leaving the user to type it separately.
        const formatted = await reverseGeocode(lat, lng);
        if (formatted) setAddress(formatted);
        setLocating(false);
      },
      () => setLocating(false),
    );
  }

  function handleContinue(e) {
    e.preventDefault();
    setDraft({
      category,
      description,
      address,
      coords,
      detectedWard,
      photoFile,
      photoPreview,
    });
    navigate("/report/review");
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-sm mx-auto px-4 pt-6 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-brand-ink font-bold mb-1"
        >
          ← Report an Issue
        </button>
        <p className="text-xs text-brand-muted mb-5">
          Ward {profile?.ward} · Metropolitan Municipality
        </p>

        <form onSubmit={handleContinue} className="space-y-5">
          <div>
            <h3 className="section-label">What's the issue?</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                    category === c.value
                      ? "bg-brand-blue border-brand-blue text-white"
                      : "bg-white border-brand-line text-brand-ink"
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="section-label">Photo Evidence</h3>
            <label className="mt-2 block border-2 border-dashed border-gray-300 rounded-2xl bg-brand-card text-center py-6 px-3 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhoto}
              />
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded-lg"
                />
              ) : (
                <>
                  <span className="text-2xl block mb-1.5">📷</span>
                  <span className="block text-xs font-bold text-brand-ink">
                    Tap to take or upload a photo
                  </span>
                  <span className="block text-[11px] text-brand-muted mt-1">
                    Clear photos help your ward resolve issues faster
                  </span>
                </>
              )}
            </label>
          </div>

          <div>
            <h3 className="section-label">Location</h3>
            <div className="mt-2">
              <AddressAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleAddressSelect}
                placeholder="Start typing your address…"
              />
            </div>
            <button
              type="button"
              onClick={useCurrentLocation}
              className="text-xs text-brand-blue font-semibold mt-1.5"
            >
              {locating
                ? "Locating…"
                : coords
                  ? "📍 Location captured"
                  : "Use current location"}
            </button>

            {wardChecked && (
              <div
                className={`mt-2 text-[11px] rounded-lg px-3 py-2 ${
                  detectedWard
                    ? "bg-brand-green-bg text-brand-green"
                    : "bg-brand-amber-bg text-brand-amber"
                }`}
              >
                {detectedWard
                  ? `✓ Detected: Ward ${detectedWard} (${PILOT_WARD.name})`
                  : "This address is outside our current pilot ward — your report will still be saved, but confirm your ward manually in your profile."}
              </div>
            )}
          </div>

          <div>
            <h3 className="section-label">Description</h3>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what you're seeing…"
              className="input mt-2 resize-none"
            />
          </div>

          <button className="btn-primary w-full">Continue</button>
        </form>
      </main>
    </div>
  );
}
