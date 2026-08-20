import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import StatusBadge from "../components/StatusBadge";
import { categoryMeta } from "../lib/categories";

export default function MyReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReports(data ?? []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen pb-16">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 pt-5">
        {loading && <p className="text-sm text-brand-muted">Loading…</p>}
        {!loading && reports.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-brand-muted mb-3">You haven't reported anything yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {reports.map((r) => {
            const cat = categoryMeta(r.category);
            return (
              <div key={r.id} className="card p-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-sm font-bold text-brand-ink">
                      {cat.icon} {cat.label} — {r.address}
                    </div>
                    <div className="text-[11px] text-brand-muted mt-0.5">Ward {r.ward}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex justify-between items-center mt-2.5 text-[11px] text-brand-muted">
                  <span className="font-mono text-gray-400">{r.token}</span>
                  <span>{timeAgo(r.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
