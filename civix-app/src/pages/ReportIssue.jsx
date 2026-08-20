import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../lib/categories";

export default function ReportIssue({ draft, setDraft }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(draft.address || profile?.street_address || "");
  const [category, setCategory] = useState(draft.category || "pothole");
  const [description, setDescription] = useState(draft.description || "");
  const [photoFile, setPhotoFile] = useState(draft.photoFile || null);
  const [photoPreview, setPhotoPreview] = useState(draft.photoPreview || null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(draft.coords || null);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  function handleContinue(e) {
    e.preventDefault();
    setDraft({ category, description, address, coords, photoFile, photoPreview });
    navigate("/report/review");
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-sm mx-auto px-4 pt-6 pb-10">
        <button onClick={() => navigate(-1)} className="text-sm text-brand-ink font-bold mb-1">
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
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
              ) : (
                <>
                  <span className="text-2xl block mb-1.5">📷</span>
                  <span className="block text-xs font-bold text-brand-ink">Tap to take or upload a photo</span>
                  <span className="block text-[11px] text-brand-muted mt-1">
                    Clear photos help your ward resolve issues faster
                  </span>
                </>
              )}
            </label>
          </div>

          <div>
            <h3 className="section-label">Location</h3>
            <div className="input flex items-center gap-2 mt-2">
              <span>📍</span>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 outline-none text-sm"
                placeholder="Street address"
              />
            </div>
            <button
              type="button"
              onClick={useCurrentLocation}
              className="text-xs text-brand-blue font-semibold mt-1.5"
            >
              {locating ? "Locating…" : coords ? "📍 Location captured" : "Use current location"}
            </button>
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
