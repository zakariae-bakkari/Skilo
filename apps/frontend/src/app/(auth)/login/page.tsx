'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import  Logo  from '@/components/ui/Logo'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Divider } from '@/components/ui/Divider'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth'

// ── Validation locale ────────────────────────────────────────────────────

function validateEmail(email: string): string | null {
  if (!email) return 'Veuillez saisir votre adresse email.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Adresse email invalide.'
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return 'Veuillez saisir votre mot de passe.'
  return null
}

// ── Overlay de succès ────────────────────────────────────────────────────

function SuccessOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 bg-[#1C1033] z-50 flex flex-col items-center justify-center gap-5">
      <span className="text-5xl animate-pop">✦</span>
      <p className="font-display text-2xl font-extrabold text-white">
        Connexion <span className="text-[#D4F000]">réussie !</span>
      </p>
      <p className="text-white/50 text-sm">Redirection vers votre dashboard...</p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const { loading, simulateLogin } = useSimulatedAuth()

  // Champs
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // Erreurs champ
  const [emailError, setEmailError]       = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Erreurs serveur
  const [serverError, setServerError]   = useState<string | null>(null)
  const [lockedBanner, setLockedBanner] = useState<string | null>(null)

  // Success
  const [showSuccess, setShowSuccess] = useState(false)

  // ── Nettoyage à la saisie ──
  const clearErrors = () => {
    setServerError(null)
    setLockedBanner(null)
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    // Validation locale
    const emailErr    = validateEmail(email)
    const passwordErr = validatePassword(password)
    setEmailError(emailErr)
    setPasswordError(passwordErr)
    if (emailErr || passwordErr) return

    // Simulation API
    const result = await simulateLogin({ email, password })

    if (!result.success) {
      if (result.error === 'ACCOUNT_LOCKED') {
        setLockedBanner(result.message ?? 'Compte verrouillé.')
      } else {
        setServerError(result.message ?? 'Email ou mot de passe incorrect.')
      }
      return
    }

    // Succès
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <>
      <SuccessOverlay visible={showSuccess} />

      {/* Centrage vertical */}
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <div
          className="
            w-full max-w-[420px]
            bg-[#FAFAFA] rounded-[20px] px-10 py-9
            shadow-[0_4px_6px_rgba(109,40,217,.04),_0_12px_40px_rgba(109,40,217,.10),_0_0_0_1px_rgba(109,40,217,.08)]
            animate-fade-up
          "
        >
          {/* Logo */}
          <Logo variant="light" size="md" href="/" className="block text-center mb-6 w-full justify-center" />

          {/* Badge "Bon retour" */}
          <div className="flex justify-center mb-4">
            <span className="bg-[#D4F000] text-[#1C1033] text-[0.78rem] font-bold px-4 py-[5px] rounded-full tracking-[0.02em]">
              Bon retour 👋
            </span>
          </div>

          {/* Titre */}
          <h1 className="font-display text-[1.75rem] font-extrabold text-[#1C1033] tracking-tight text-center mb-[6px]">
            Se connecter
          </h1>
          <p className="text-[#8B7EA8] text-[0.875rem] text-center mb-7 leading-relaxed">
            Retrouvez vos matchs et continuez vos échanges
          </p>

          {/* Alertes serveur */}
          <Alert variant="error" visible={!!serverError} className="mb-4">
            {serverError}
          </Alert>
          <Alert variant="warning" visible={!!lockedBanner} className="mb-4">
            {lockedBanner}
          </Alert>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Email */}
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="vous@exemple.com"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(null); clearErrors() }}
              error={emailError ?? undefined}
            />

            {/* Mot de passe */}
            <PasswordInput
              label="Mot de passe"
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(null); clearErrors() }}
              error={passwordError ?? undefined}
              rightSlot={
                <Link
                  href="/forgot-password"
                  className="text-[#6D28D9] font-medium hover:underline text-[0.78rem]"
                >
                  Mot de passe oublié ?
                </Link>
              }
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              className="mt-1"
            >
              Se connecter
            </Button>
          </form>

          {/* Divider + Google */}
          <Divider />
          <GoogleButton />

          {/* Lien inscription */}
          <p className="text-center mt-5 text-[0.83rem] text-[#8B7EA8]">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[#6D28D9] font-semibold hover:underline">
              S'inscrire →
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
