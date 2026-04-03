"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        auth: false, // pas de token nécessaire pour se connecter
        body: JSON.stringify({ email, password }),
      });

const data = await res.json();
if (!res.ok) throw new Error(data.message || "Identifiants incorrects");

login(data.access_token, data.user);

router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Shapes déco fond */}
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-[#6D28D9]/10 blur-3xl" />
      <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-[#6D28D9]/10 blur-3xl" />
      <div className="absolute top-1/2 left-[10%] w-24 h-24 rounded-full border border-[#6D28D9]/15" />
      <div className="absolute top-[20%] right-[15%] w-16 h-16 rounded-full border border-[#D4F000]/30" />

      {/* Carte centrale */}
      <div className="relative z-10 bg-white rounded-2xl shadow-[0_8px_40px_rgba(109,40,217,0.12)] w-full max-w-[420px] p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-extrabold">
            <span className="text-[#D4F000]">Ski</span>
            <span className="text-[#1C1033]">lo</span>
          </Link>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-[#D4F000] text-[#1C1033] text-xs font-bold px-4 py-1.5 rounded-full">
            Bon retour 👋
          </span>
        </div>

        <h1 className="text-[28px] font-extrabold text-[#1C1033] text-center mb-1">
          Se connecter
        </h1>
        <p className="text-center text-gray-400 text-sm mb-7">
          Accédez à votre espace personnel
        </p>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1033] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vous@exemple.com"
              className="w-full border border-[#7C3AED]/40 rounded-lg px-4 py-2.5 text-sm text-[#1C1033] placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#6D28D9]/30 focus:border-[#6D28D9] transition"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#1C1033]">
                Mot de passe
              </label>
              <a href="#" className="text-xs text-[#6D28D9] hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-[#7C3AED]/40 rounded-lg px-4 py-2.5 text-sm text-[#1C1033] placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#6D28D9]/30 focus:border-[#6D28D9] transition pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#6D28D9] transition"
              >
                {showPassword ? "Masquer" : "Voir"}
              </button>
            </div>
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6D28D9] text-white font-bold py-3 rounded-lg hover:bg-[#7C3AED] transition disabled:opacity-60 text-sm"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Séparateur */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">ou continuer avec</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full border border-[#1C1033]/20 text-[#1C1033] text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-[#6D28D9] font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}