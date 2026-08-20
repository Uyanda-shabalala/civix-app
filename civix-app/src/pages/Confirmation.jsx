import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import StatusBadge from "../components/StatusBadge";

export default function Confirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setReport(data));
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-brand-green-bg text-brand-green text-3xl font-extrabold flex items-center justify-center mx-auto mb-4">
          ✓
        </div>
        <h1 className="text-xl font-bold text-brand-ink">Report Submitted!</h1>
        <p className="text-sm text-brand-muted mt-1">Your tracking code</p>

        <div className="inline-block font-mono text-lg font-extrabold text-brand-ink bg-brand-card border border-dashed border-gray-300 rounded-xl px-4 py-2.5 my-3">
          {report?.token ?? "…"}
        </div>

        <div>
          <StatusBadge status={report?.status ?? "new"} />
        </div>

        <p className="text-xs text-brand-muted leading-relaxed mt-4">
          We'll notify you when Ward {report?.ward} responds. You can track progress anytime in{" "}
          <span className="font-bold text-brand-ink">My Reports</span>.
        </p>

        <button onClick={() => navigate("/reports")} className="btn-primary w-full mt-6">
          Track This Report
        </button>
        <button onClick={() => navigate("/ward")} className="btn-outline w-full mt-2">
          Back to My Ward
        </button>
      </div>
    </div>
  );
}
