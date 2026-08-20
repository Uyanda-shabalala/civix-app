import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Gauteng");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate("/ward");
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
    });

    if (error) {
      setLoading(false);
      return setError(error.message);
    }

    // If email confirmation is off, session exists immediately and we can write the profile row.
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        phone,
        street_address: streetAddress,
        ward,
        city,
        province,
      });
    }

    setLoading(false);
    if (data.session) {
      navigate("/ward");
    } else {
      setError("Check your email to confirm your account, then log in.");
      setMode("login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-brand-line shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center text-white text-sm font-extrabold">
            ✓
          </div>
          <span className="font-bold text-brand-ink tracking-tight">CIVIX</span>
        </div>

        {mode === "login" ? (
          <>
            <h1 className="text-xl font-bold text-brand-ink mb-1">Welcome to Civix</h1>
            <p className="text-sm text-brand-muted mb-5">
              Your secure gateway to local government and ward operations.
            </p>
          </>
        ) : (
          <h1 className="text-xl font-bold text-brand-ink mb-5">Create Account</h1>
        )}

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
              mode === "login" ? "bg-brand-blue text-white" : "bg-brand-card text-brand-ink"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
              mode === "register" ? "bg-brand-blue text-white" : "bg-brand-card text-brand-ink"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="text-xs text-brand-red bg-brand-red-bg rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="input"
              />
            </Field>
            <button disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <Field label="Full Name">
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
            </Field>
            <Field label="Phone Number">
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 123 4567" className="input" />
            </Field>
            <Field label="Email Address">
              <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="input" />
            </Field>
            <Field label="Password">
              <input type="password" required minLength={6} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="input" />
            </Field>
            <Field label="Street Address">
              <input required value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="input" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ward">
                <input required value={ward} onChange={(e) => setWard(e.target.value)} placeholder="1576" className="input" />
              </Field>
              <Field label="City">
                <input required value={city} onChange={(e) => setCity(e.target.value)} className="input" />
              </Field>
            </div>
            <Field label="Province">
              <input required value={province} onChange={(e) => setProvince(e.target.value)} className="input" />
            </Field>
            <button disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Signing up…" : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-brand-ink mb-1">{label}</span>
      {children}
    </label>
  );
}
