'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { usersApi, skillsApi, uploadApi } from '@/lib/api';
import type {
  User, UserSkill, SkillCatalogItem, SkillLevel, SkillType, SkillCategory,
} from '@/lib/api';
import { 
  Monitor, Globe, Palette, Briefcase, Trophy, ChefHat, Sparkles, 
  Camera, CheckCircle2, AlertCircle, XCircle, X, GraduationCap, 
  BookOpen, BarChart3, Star, Coins, Medal, User as UserIcon, Plus,
  Loader2, Search
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner',     label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced',     label: 'Avancé' },
];

const LEVEL_COLORS: Record<SkillLevel, string> = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced:     'bg-purple-100 text-purple-700',
};

const CATEGORIES: { value: SkillCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'tech',      label: 'Tech',      icon: <Monitor className="w-4 h-4" /> },
  { value: 'languages', label: 'Langues',   icon: <Globe className="w-4 h-4" /> },
  { value: 'arts',      label: 'Arts',      icon: <Palette className="w-4 h-4" /> },
  { value: 'business',  label: 'Business',  icon: <Briefcase className="w-4 h-4" /> },
  { value: 'sport',     label: 'Sport',     icon: <Trophy className="w-4 h-4" /> },
  { value: 'cooking',   label: 'Cuisine',   icon: <ChefHat className="w-4 h-4" /> },
  { value: 'other',     label: 'Autre',     icon: <Sparkles className="w-4 h-4" /> },
];

const BIO_MAX = 280;
const MAX_SKILLS = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_MB = 5;

// ─── Profile strength ─────────────────────────────────────────────────────────

function StrengthBar({ score }: { score: number }) {
  const color = score >= 71 ? 'bg-green-500' : score >= 41 ? 'bg-amber-500' : 'bg-destructive';
  
  let Icon = XCircle;
  let labelText = 'Incomplet';
  let textColor = 'text-destructive';
  if (score >= 71) {
    Icon = CheckCircle2;
    labelText = 'Complet';
    textColor = 'text-green-600';
  } else if (score >= 41) {
    Icon = AlertCircle;
    labelText = 'Partiel';
    textColor = 'text-amber-600';
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span className="font-semibold text-muted-foreground uppercase tracking-wider">Force du profil</span>
        <div className={`flex items-center gap-1.5 font-semibold ${textColor}`}>
          <span>{score}/100 · {labelText}</span>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Photo +20</span>
        <span>Bio +20</span>
        <span>3 skills offerts +30</span>
        <span>3 skills cherchés +30</span>
      </div>
    </div>
  );
}

// ─── Avatar upload ────────────────────────────────────────────────────────────

function AvatarUpload({
  currentUrl, firstName, lastName, onUploaded,
}: {
  currentUrl?: string; firstName: string; lastName: string; onUploaded: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview]   = useState(currentUrl ?? '');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const initials = [firstName[0], lastName[0]].join('').toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formats acceptés : JPG, PNG, WebP.');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Photo max ${MAX_FILE_MB} Mo.`);
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const { avatarUrl } = await uploadApi.avatar(file);
      setPreview(avatarUrl);
      onUploaded(avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload échoué.');
      setPreview(currentUrl ?? '');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="relative w-24 h-24 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden bg-muted flex items-center justify-center"
      >
        {preview
          ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
          : <span className="text-2xl font-bold text-primary">{initials}</span>
        }
        {loading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs">Upload…</span>
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-background">
          <Camera className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      </button>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      <p className="text-xs text-muted-foreground text-center">JPG, PNG, WebP · max {MAX_FILE_MB} Mo</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Skill add panel ──────────────────────────────────────────────────────────

function AddSkillModal({
  isOpen, onClose, type, existingSkillIds, onAdd
}: {
  isOpen: boolean;
  onClose: () => void;
  type: SkillType;
  existingSkillIds: string[];
  onAdd: (skill: SkillCatalogItem, level: SkillLevel) => void;
}) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<SkillCatalogItem[]>([]);
  const [selected, setSelected] = useState<SkillCatalogItem | null>(null);
  const [level, setLevel]       = useState<SkillLevel>('beginner');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelected(null);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      skillsApi.search(query || "")
        .then(setResults)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Ajouter une compétence {type === 'offered' ? 'à enseigner' : 'à apprendre'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {!selected ? (
            <>
              <div className="space-y-2 animate-in fade-in duration-300">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Rechercher</label>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                  placeholder="Ex: JavaScript, Design, Anglais..."
                  className="w-full text-sm border border-border rounded-xl px-4 py-3 bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="max-h-[350px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recherche en cours...</p>
                  </div>
                )}
                
                {!loading && results.length > 0 ? (
                  results.map((r) => {
                    const isAlreadyAdded = existingSkillIds.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        disabled={isAlreadyAdded}
                        onClick={() => { setSelected(r); setQuery(r.name); }}
                        className={`
                          w-full text-left text-sm px-4 py-3 rounded-2xl transition-all flex items-center justify-between group
                          ${isAlreadyAdded 
                            ? 'opacity-50 cursor-not-allowed bg-muted/30 grayscale-[0.5]' 
                            : 'hover:bg-primary/5 border border-transparent hover:border-primary/20'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            p-2 rounded-xl transition-colors
                            ${isAlreadyAdded ? 'bg-muted text-muted-foreground' : 'text-muted-foreground group-hover:text-primary bg-muted/30 group-hover:bg-primary/10'}
                          `}>
                            {CATEGORIES.find((c) => c.value === r.category)?.icon}
                          </div>
                          <span className={`font-semibold ${isAlreadyAdded ? 'text-muted-foreground' : ''}`}>
                            {r.name}
                          </span>
                        </div>
                        
                        {isAlreadyAdded && (
                          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter h-5 border-muted-foreground/20 text-muted-foreground bg-muted/20">
                            Déjà ajouté
                          </Badge>
                        )}
                      </button>
                    );
                  })
                ) : !loading && query.length >= 2 && (
                  <div className="text-center py-12 opacity-60">
                    <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-xs font-medium">Aucune compétence trouvée pour "{query}"</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Essayez un autre mot-clé.</p>
                  </div>
                )}

                {!loading && !results.length && !query && (
                  <div className="text-center py-12 opacity-40">
                    <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-xs font-medium uppercase tracking-widest">Commencez à taper...</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 animate-in zoom-in duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-background rounded-xl border border-primary/20 shadow-sm">
                  {CATEGORIES.find((c) => c.value === selected.category)?.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Sélectionné</span>
                  <span className="text-base font-black">{selected.name}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => { setSelected(null); setQuery(''); }} 
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors shadow-sm"
              >
                Changer
              </button>
            </div>
          )}

          {selected && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Votre niveau</label>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setLevel(l.value)}
                    className={`text-xs py-3 rounded-xl border-2 font-bold transition-all ${
                      level === l.value
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                        : 'border-border bg-muted/10 hover:border-primary/40'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 font-bold"
            >
              Annuler
            </Button>
            <Button
              type="button"
              disabled={!selected}
              onClick={() => { if (selected) { onAdd(selected, level); onClose(); } }}
              className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-primary/20"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Skills section ───────────────────────────────────────────────────────────

function SkillsSection({
  title, type, skills, onRemove, onLevelChange, onAdd, allSkills,
}: {
  title: string;
  type: SkillType;
  skills: UserSkill[];
  onRemove: (id: string) => void;
  onLevelChange: (id: string, level: SkillLevel) => void;
  onAdd: (skill: SkillCatalogItem, level: SkillLevel) => void;
  allSkills: UserSkill[];
}) {
  const [showAdd, setShowAdd] = useState(false);
  // Pass all skill IDs to prevent adding a skill as both offered and wanted
  const allSkillIds = allSkills.map((s) => s.skillCatalogId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">{skills.length}/{MAX_SKILLS}</span>
      </div>

      {skills.length === 0 && !showAdd && (
        <p className="text-xs text-muted-foreground py-2">Aucune compétence ajoutée.</p>
      )}

      <div className="space-y-2">
        {skills.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{s.skillCatalog.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize mt-0.5">
                {CATEGORIES.find((c) => c.value === s.skillCatalog.category)?.icon}
                <span>{s.skillCatalog.category}</span>
              </div>
            </div>
            <Select
              value={s.level}
              onValueChange={(val) => onLevelChange(s.id, val as SkillLevel)}
            >
              <SelectTrigger className={`w-[130px] h-8 text-[10px] font-bold uppercase tracking-wider rounded-full border-0 focus:ring-1 focus:ring-primary ${LEVEL_COLORS[s.level]}`}>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value} className="text-xs font-medium">
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => onRemove(s.id)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10 ml-1"
              title="Supprimer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {skills.length < MAX_SKILLS && (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="w-full text-sm py-3 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:text-primary transition-all text-muted-foreground font-bold flex items-center justify-center gap-2 group hover:bg-primary/5"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Ajouter une compétence
        </button>
      )}

      <AddSkillModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        type={type}
        existingSkillIds={allSkillIds}
        onAdd={onAdd}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();

  const [profile,  setProfile]  = useState<(User & { skills: UserSkill[] }) | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [city,      setCity]      = useState('');
  const [bio,       setBio]       = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [skills,    setSkills]    = useState<UserSkill[]>([]);

  useEffect(() => {
    usersApi.me()
      .then((data) => {
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setCity(data.city ?? '');
        setBio(data.bio ?? '');
        setAvatarUrl(data.avatarUrl ?? '');
        setSkills(data.skills);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveInfo() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await usersApi.updateMe({ firstName, lastName, city: city || undefined, bio: bio || undefined, avatarUrl: avatarUrl || undefined });
      setProfile((prev) => prev ? { ...prev, ...res.user } : null);
      updateUser(res.user); // Sync with auth context so header avatar updates
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSkill(type: SkillType, skill: SkillCatalogItem, level: SkillLevel) {
    try {
      const res = await usersApi.addSkill({ skillId: skill.id, type, level });
      setSkills((prev) => [...prev, res.skill]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l\'ajout.');
    }
  }

  async function handleRemoveSkill(userSkillId: string) {
    try {
      await usersApi.removeSkill(userSkillId);
      setSkills((prev) => prev.filter((s) => s.id !== userSkillId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de supprimer. La compétence est liée à une session.');
    }
  }

  async function handleLevelChange(userSkillId: string, level: SkillLevel) {
    try {
      const res = await usersApi.updateSkillLevel(userSkillId, level);
      setSkills((prev) => prev.map((s) => s.id === userSkillId ? { ...s, level: res.skill.level } : s));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la mise à jour.');
    }
  }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const offeredSkills = skills.filter((s) => s.type === 'offered');
  const wantedSkills  = skills.filter((s) => s.type === 'wanted');

  // Recalculate profile score locally so it updates in real-time
  const localScore = (
    (avatarUrl     ? 20 : 0) +
    (bio.trim()    ? 20 : 0) +
    (offeredSkills.length >= 3 ? 30 : 0) +
    (wantedSkills.length  >= 3 ? 30 : 0)
  );

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4 animate-pulse">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="h-64 bg-muted rounded-xl" />
        <div className="h-48 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!profile) return <p className="text-destructive">{error}</p>;

  return (
    <div className="max-w-6xl space-y-10">

      <div>
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Un profil complet améliore la qualité de vos matchs.
        </p>
      </div>

      {/* Strength bar */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <StrengthBar score={localScore} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Info & Stats */}
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" /> Informations générales
            </h2>

            {/* Avatar */}
            <AvatarUpload
              currentUrl={avatarUrl}
              firstName={profile.firstName}
              lastName={profile.lastName}
              onUploaded={setAvatarUrl}
            />

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Prénom</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={50}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Nom</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={50}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Ville <span className="text-muted-foreground">(optionnel)</span></label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={100}
                placeholder="Ex: Casablanca"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Bio <span className="text-muted-foreground">(optionnel)</span></label>
              <textarea
                value={bio}
                onChange={(e) => { if (e.target.value.length <= BIO_MAX) setBio(e.target.value); }}
                rows={4}
                placeholder="Parlez de votre parcours, vos passions…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <p className={`text-xs text-right ${bio.length >= BIO_MAX ? 'text-destructive' : 'text-muted-foreground'}`}>
                {bio.length}/{BIO_MAX}
              </p>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
            {success && <p className="text-xs text-green-600">✓ Profil mis à jour avec succès.</p>}

            <button
              type="button"
              onClick={handleSaveInfo}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60 transition-opacity shadow-sm hover:bg-primary/90"
            >
              {saving ? 'Sauvegarde…' : 'Sauvegarder les informations'}
            </button>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Statistiques
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                <p className="text-3xl font-black text-primary">{profile.sessionsCompleted}</p>
                <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wide">Sessions</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-3xl font-black text-amber-500">
                    {profile.avgRating ? Number(profile.avgRating).toFixed(1) : '—'}
                  </p>
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500 -mt-1" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wide">Note moy.</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-3xl font-black text-emerald-500">{profile.creditBalance}</p>
                  <Coins className="w-5 h-5 text-emerald-500 -mt-1" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wide">Crédits</p>
              </div>
            </div>
            {profile.hasBadgeFiable && (
              <div className="mt-6 flex items-center gap-2 justify-center text-sm bg-amber-500/10 text-amber-700 py-3 rounded-xl font-bold border border-amber-500/20">
                <Medal className="w-5 h-5 text-amber-600" />
                <span>Badge Fiable obtenu</span>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Skills */}
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" /> Compétences à enseigner
            </h2>
            <SkillsSection
              title="Ce que vous pouvez apprendre aux autres"
              type="offered"
              skills={offeredSkills}
              onRemove={handleRemoveSkill}
              onLevelChange={handleLevelChange}
              onAdd={(skill, level) => handleAddSkill('offered', skill, level)}
              allSkills={skills}
            />
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Compétences à apprendre
            </h2>
            <SkillsSection
              title="Ce que vous cherchez à maîtriser"
              type="wanted"
              skills={wantedSkills}
              onRemove={handleRemoveSkill}
              onLevelChange={handleLevelChange}
              onAdd={(skill, level) => handleAddSkill('wanted', skill, level)}
              allSkills={skills}
            />
          </section>
        </div>
      </div>

    </div>
  );
}
