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
import { Avatar } from '@/components/ui/Avatar'
import { SkillTag } from '@/components/ui/SkillTag'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth'

// ── Validation ───────────────────────────────────────────────────────────

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function validate(fields: {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}): FormErrors {
  const errors: FormErrors = {}

  if (fields.firstName.length < 2)
    errors.firstName = 'Le prénom doit contenir au moins 2 caractères.'

  if (fields.lastName.length < 2)
    errors.lastName = 'Le nom doit contenir au moins 2 caractères.'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Veuillez saisir une adresse email valide.'

  if (fields.password.length < 8)
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
  else if (!/(?=.*[A-Z])(?=.*\d)/.test(fields.password))
    errors.password = 'Doit contenir au moins une majuscule et un chiffre.'

  if (fields.password !== fields.confirmPassword)
    errors.confirmPassword = 'Les mots de passe ne correspondent pas.'

  return errors
}

// ── Overlay succès ───────────────────────────────────────────────────────

function SuccessOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 bg-[#1C1033] z-50 flex flex-col items-center justify-center gap-5">
      <span className="text-5xl animate-pop">✦</span>
      <p className="font-display text-2xl font-extrabold text-white text-center">
        Compte créé avec <span className="text-[#D4F000]">succès !</span>
      </p>
      <p className="text-white/50 text-sm">Redirection vers l'onboarding...</p>
    </div>
  )
}

// ── Panneau gauche ────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-center w-[50%] min-h-screen
        bg-[#1C1033] px-14 py-16 relative overflow-hidden flex-shrink-0"
    >
      {/* Orbe violet top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,40,217,.5) 0%, transparent 65%)',
          top: -150, right: -150,
        }}
      />
      {/* Orbe citron bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,240,0,.1) 0%, transparent 65%)',
          bottom: -80, left: -60,
        }}
      />

      <div className="relative z-10">
        {/* Logo */}
        <Logo variant="dark" size="lg" href="/" className="mb-14" />

        {/* Headline */}
        <h1 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight text-white mb-4">
          Votre savoir<br />
          a de la <span className="text-[#D4F000]">valeur</span>
        </h1>
        <p className="text-white/50 text-[0.95rem] leading-[1.7] mb-12 font-light max-w-[380px]">
          Rejoignez une communauté où chaque compétence devient une monnaie d'échange.
          Apprenez, partagez, progressez.
        </p>

        {/* Carte profil mock */}
        <div
          className="rounded-[18px] p-[22px] mb-10"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-[14px] mb-4">
            <Avatar initials="SA" size="lg" variant="citron-gradient" />
            <div className="flex-1">
              <p className="font-display font-bold text-white text-[0.95rem]">Sara A.</p>
              <p className="text-white/45 text-[0.78rem] mt-[2px]">📍 Paris · ★★★★★ 4.9</p>
            </div>
            <span className="bg-[#D4F000] text-[#1C1033] text-[0.68rem] font-extrabold px-[10px] py-1 rounded-full tracking-[0.04em] whitespace-nowrap">
              ✦ Match parfait
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-[6px]">
            <SkillTag variant="offered">Figma</SkillTag>
            <SkillTag variant="offered">UI Design</SkillTag>
            <SkillTag variant="wanted">cherche React</SkillTag>
            <SkillTag variant="wanted">cherche Python</SkillTag>
          </div>
        </div>

        {/* Bénéfices */}
        <ul className="flex flex-col gap-[14px] list-none">
          {[
            { icon: '🎯', title: 'Matching algorithmique', desc: 'trouvez des échanges vraiment pertinents' },
            { icon: '⏱', title: 'Crédits temps', desc: '2 crédits offerts à l\'inscription' },
            { icon: '⭐', title: '100% gratuit', desc: 'sans abonnement, sans commission' },
          ].map((item) => (
            <li key={item.title} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.9rem] flex-shrink-0"
                style={{
                  background: 'rgba(212,240,0,0.1)',
                  border: '1px solid rgba(212,240,0,0.2)',
                }}
              >
                {item.icon}
              </div>
              <span className="text-white/70 text-[0.85rem] leading-snug">
                <strong className="text-white font-semibold">{item.title}</strong> — {item.desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()
  const { loading, simulateRegister } = useSimulatedAuth()

  // Champs
  const [firstName, setFirstName]             = useState('')
  const [lastName, setLastName]               = useState('')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Erreurs
  const [errors, setErrors]         = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  // Success
  const [showSuccess, setShowSuccess] = useState(false)

  // Nettoyage d'un champ
  const clearField = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setServerError(null)
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const validationErrors = validate({ firstName, lastName, email, password, confirmPassword })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    const result = await simulateRegister({ firstName, lastName, email, password })

    if (!result.success) {
      if (result.error === 'EMAIL_ALREADY_EXISTS') {
        setErrors({ email: '' })  // highlight le champ
        setServerError(result.message ?? 'Cette adresse email est déjà utilisée.')
      } else {
        setServerError(result.message ?? 'Une erreur est survenue.')
      }
      return
    }

    setShowSuccess(true)
    setTimeout(() => router.push('/onboarding'), 2000)
  }

  return (
    <>
      <SuccessOverlay visible={showSuccess} />

      <div className="flex min-h-screen overflow-hidden">
        {/* Panneau gauche (desktop uniquement) */}
        <LeftPanel />

        {/* Panneau droit — formulaire */}
        <div className="flex-1 bg-[#FAFAFA] flex flex-col justify-center items-center px-8 py-12 overflow-y-auto min-h-screen">
          <div className="w-full max-w-[420px] animate-fade-in">

            {/* Logo (visible uniquement sur mobile, car le left panel est caché) */}
            <Logo
              variant="light"
              size="md"
              href="/"
              className="lg:hidden block text-center mb-7 w-full justify-center"
            />

            <h2 className="font-display text-[1.7rem] font-extrabold text-[#1C1033] tracking-tight text-center mb-[6px]">
              Créer mon compte
            </h2>
            <p className="text-[#8B7EA8] text-[0.88rem] text-center mb-7 leading-relaxed">
              Quelques secondes et vous rejoignez la communauté
            </p>

            {/* Erreur serveur globale */}
            <Alert variant="error" visible={!!serverError} className="mb-4">
              {serverError}
            </Alert>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[14px]">

              {/* Prénom + Nom */}
              <div className="grid grid-cols-2 gap-[14px]">
                <Input
                  label="Prénom"
                  id="firstName"
                  placeholder="Marie"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearField('firstName') }}
                  error={errors.firstName}
                />
                <Input
                  label="Nom"
                  id="lastName"
                  placeholder="Dupont"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); clearField('lastName') }}
                  error={errors.lastName}
                />
              </div>

              {/* Email */}
              <Input
                label="Adresse email"
                type="email"
                id="email"
                placeholder="vous@exemple.com"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearField('email') }}
                error={errors.email}
              />

              {/* Mot de passe avec force */}
              <PasswordInput
                label="Mot de passe"
                id="password"
                placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearField('password') }}
                error={errors.password}
                showStrength
              />

              {/* Confirmation */}
              <PasswordInput
                label="Confirmer le mot de passe"
                id="confirmPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearField('confirmPassword') }}
                error={errors.confirmPassword}
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
                Créer mon compte
              </Button>
            </form>

            {/* Divider + Google */}
            <Divider label="ou" />
            <GoogleButton />

            {/* Lien connexion */}
            <p className="text-center mt-5 text-[0.83rem] text-[#8B7EA8]">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-[#6D28D9] font-semibold hover:underline">
                Se connecter →
              </Link>
            </p>

            {/* RGPD */}
            <p className="text-center mt-4 text-[0.72rem] text-[#8B7EA8]/70 leading-relaxed">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/cgu" className="text-[#6D28D9] opacity-70 hover:opacity-100">CGU</Link>
              {' '}et notre{' '}
              <Link href="/privacy" className="text-[#6D28D9] opacity-70 hover:opacity-100">
                politique de confidentialité
              </Link>
              . Vos données sont protégées conformément au RGPD.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
