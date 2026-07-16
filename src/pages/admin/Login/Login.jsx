import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { signInAdmin } from "@/services/auth.js";
import { useAuth } from "@/hooks/useAuth.js";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/admin"} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInAdmin(email, password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError("Email atau password salah.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F5F1] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <p className="font-display text-xl font-semibold text-ink">
          Exora <span className="text-brand">Academy</span>
        </p>
        <p className="eyebrow mt-1">Admin Login</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@exora.id"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Masuk…" : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
