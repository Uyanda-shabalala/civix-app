import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";

// Ward representatives are illustrative for MVP — swap for a `representatives`
// table once ward officials are onboarded.
const REPS = [
  { name: "Mr. John Doe", role: "Councillor (Ward Rep)", approval: 86 },
  { name: "Mrs. Jane Roe", role: "Eskom Marketing Liaison", approval: 41 },
];

export default function MyWard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const ward = profile?.ward || "—";

  return (
    <div className="min-h-screen pb-24">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 pt-5">
        <div className="bg-[#eef3ff] rounded-2xl px-4 py-3 mb-5">
          <div className="text-[10px] font-bold text-brand-blue-dark tracking-wide">CURRENT REGION</div>
          <div className="text-lg font-extrabold text-brand-ink mt-0.5">WARD {ward}</div>
          <div className="text-xs text-brand-muted mt-0.5">Metropolitan Municipality Community District</div>
        </div>

        <h2 className="text-xs font-bold uppercase tracking-wide text-brand-ink mb-3">
          Your Elected Representatives
        </h2>
        <div className="space-y-3">
          {REPS.map((rep) => (
            <div key={rep.name} className="card flex items-center gap-3 p-3">
              <div className="w-9 h-9 rounded-full bg-[#dbe4fb] flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-brand-ink">{rep.name}</div>
                <div className="text-xs text-brand-muted">{rep.role}</div>
              </div>
              <div
                className={`ml-auto text-xs font-extrabold px-2.5 py-1 rounded-full ${
                  rep.approval >= 60
                    ? "bg-brand-green-bg text-brand-green"
                    : "bg-brand-red-bg text-brand-red"
                }`}
              >
                {rep.approval}%
              </div>
            </div>
          ))}
        </div>
      </main>

      <button
        onClick={() => navigate("/report")}
        className="fixed bottom-7 right-6 w-14 h-14 rounded-full bg-brand-blue text-white text-2xl font-bold shadow-lg shadow-blue-900/30 flex items-center justify-center"
        aria-label="Report an issue"
        title="Report Issue"
      >
        +
      </button>
    </div>
  );
}
