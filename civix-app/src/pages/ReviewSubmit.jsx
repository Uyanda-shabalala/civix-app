import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { categoryMeta } from "../lib/categories";

export default function ReviewSubmit({ draft, setDraft }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!draft.category) {
    navigate("/report");
    return null;
  }

  const cat = categoryMeta(draft.category);

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    let photo_url = null;
    if (draft.photoFile) {
      const path = `${user.id}/${Date.now()}-${draft.photoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("report-photos")
        .upload(path, draft.photoFile);
      if (uploadError) {
        setSubmitting(false);
        return setError(uploadError.message);
      }
      const { data: publicUrl } = supabase.storage.from("report-photos").getPublicUrl(path);
      photo_url = publicUrl.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        ward: profile?.ward,
        category: draft.category,
        description: draft.description,
        address: draft.address,
        latitude: draft.coords?.lat ?? null,
        longitude: draft.coords?.lng ?? null,
        photo_url,
      })
      .select()
      .single();

    setSubmitting(false);
    if (insertError) return setError(insertError.message);

    setDraft({});
    navigate(`/report/confirmation/${data.id}`);
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-sm mx-auto px-4 pt-6 pb-10">
        <button onClick={() => navigate(-1)} className="text-sm text-brand-ink font-bold mb-1">
          ← Review & Submit
        </button>
        <p className="text-xs text-brand-muted mb-5">Check the details before sending</p>

        <div className="card p-4 divide-y divide-brand-line">
          <Row label="Category" value={`${cat.icon} ${cat.label}`} />
          <Row label="Location" value={draft.address} />
          <Row label="Ward" value={profile?.ward} />
          <Row label="Photo" value={draft.photoFile ? "1 attached ✓" : "None"} />
        </div>

        <h3 className="section-label mt-5 mb-2">Description</h3>
        <p className="text-sm text-brand-ink leading-relaxed">{draft.description}</p>

        <div className="bg-[#eef3ff] border border-[#d6e0fb] rounded-xl px-3 py-3 text-xs text-[#33456e] leading-relaxed mt-4">
          Your report will get a unique tracking code and be sent directly to Ward {profile?.ward}'s councillor.
        </div>

        <label className="flex items-start gap-2 mt-4 text-xs text-brand-ink">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
          I confirm this report is accurate to the best of my knowledge.
        </label>

        {error && (
          <div className="text-xs text-brand-red bg-brand-red-bg rounded-lg px-3 py-2 mt-3">{error}</div>
        )}

        <button
          disabled={!confirmed || submitting}
          onClick={handleSubmit}
          className="btn-primary w-full mt-5"
        >
          {submitting ? "Submitting…" : "Submit Report"}
        </button>
      </main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 text-xs first:pt-0 last:pb-0">
      <span className="text-brand-muted">{label}</span>
      <span className="font-semibold text-brand-ink">{value}</span>
    </div>
  );
}
