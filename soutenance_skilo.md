# 🎓 Guide de Soutenance — Projet Skilo

---

## 1. 🧠 C'est quoi Skilo ? (Le Pitch)

**Skilo** est une **plateforme d'échange de compétences basée sur le temps**.

> Le principe : Vous enseignez ce que vous savez → vous gagnez des crédits → vous utilisez ces crédits pour apprendre quelque chose de nouveau auprès d'un autre utilisateur.

**1 heure enseignée = 1 crédit = 1 heure d'apprentissage**

C'est une économie circulaire de la connaissance, sans argent.

---

## 2. 🏗️ Architecture Générale — Monorepo Turborepo

Le projet utilise une architecture **monorepo** gérée par **Turborepo** et **pnpm workspaces**.

```
skilo/
├── apps/
│   ├── frontend/   → Next.js (interface utilisateur)
│   └── backend/    → NestJS (API REST)
├── packages/
│   ├── ui/              → Composants UI partagés
│   ├── eslint-config/   → Config ESLint commune
│   └── typescript-config/ → Config TypeScript commune
```

**Avantage du monorepo :** Un seul dépôt, un seul `pnpm install`, les deux apps tournent avec `pnpm dev`.

---

## 3. ⚙️ Stack Technique

| Couche | Technologie | Rôle |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | Interface utilisateur, routing |
| **Styling** | Tailwind CSS + shadcn/ui | Design system |
| **Backend** | NestJS | API REST modulaire |
| **ORM** | Prisma | Communication avec la base de données |
| **Base de données** | PostgreSQL (hébergé sur Neon.tech) | Stockage persistant |
| **Auth** | JWT + Refresh Tokens (HTTP-only cookies) | Sécurité |
| **Déploiement** | Vercel (Frontend + Backend) | Mise en production |
| **Gestionnaire de paquets** | pnpm + Turborepo | Monorepo |

---

## 4. 🗃️ Base de Données — Modèle de Données (Prisma)

Le schéma contient **10 modèles** :

### Modèles principaux :

| Modèle | Description |
|---|---|
| `User` | Compte utilisateur (email, mot de passe hashé, crédits, scores, badge) |
| `SkillCatalog` | Catalogue centralisé des compétences (ex: Python, Guitare, Cuisine...) |
| `UserSkill` | Lien entre un utilisateur et une compétence (offerte ou recherchée, niveau) |
| `Match` | Correspondance calculée entre 2 utilisateurs |
| `Session` | Une session d'échange planifiée entre 2 utilisateurs |
| `Review` | Évaluation post-session (note, pédagogie, ponctualité, communication) |
| `CreditTransaction` | Historique complet des mouvements de crédits |
| `Notification` | Alertes temps réel in-app |
| `Message` | Messages dans le chat d'une session confirmée |
| `TokenBlacklist` | Refresh tokens révoqués (sécurité logout) |

### Enums importants :
- **SkillType** : `offered` (je propose) / `wanted` (je cherche)
- **MatchType** : `perfect` (échange mutuel) / `partial` (un sens uniquement)
- **SessionStatus** : `pending → confirmed → completed` (ou `cancelled`, `disputed`)
- **SkillLevel** : `beginner` / `intermediate` / `advanced`

---

## 5. 🔒 Authentification — JWT Sécurisé

### Fonctionnement :

```
Inscription/Connexion
        ↓
Backend génère 2 tokens JWT :
  - Access Token  (durée: 15 minutes)
  - Refresh Token (durée: 7 jours, stocké en HTTP-only cookie)
        ↓
Quand l'Access Token expire → le frontend appelle /auth/refresh
  → le Refresh Token est vérifié, l'ancien est blacklisté (rotation)
  → de nouveaux tokens sont émis
        ↓
Logout → le Refresh Token est ajouté à la TokenBlacklist (SHA-256)
```

### Protections de sécurité :
- **Brute-force** : Après 5 tentatives échouées → compte bloqué 15 minutes
- **Mot de passe** : Hashé avec **bcrypt coût 12** (jamais en clair)
- **Token révocation** : SHA-256 du token stocké en base, jamais le token brut
- **Compte inactif** : Vérification `isActive` à chaque connexion

---

## 6. 🎯 Algorithme de Matching — Le Cœur du Projet

C'est **la fonctionnalité clé** à bien expliquer.

### Principe :

Pour chaque utilisateur A, l'algorithme compare ses compétences avec tous les autres utilisateurs B actifs et onboardés.

### Étape 1 — Match Parfait (`perfect`)
> A offre ce que B cherche **ET** B offre ce que A cherche (échange mutuel)

```
Si A offre "Python" et cherche "Guitare"
ET B offre "Guitare" et cherche "Python"
→ MATCH PARFAIT ✅
→ Score de base : 50 points par paire
```

### Étape 2 — Match Partiel (`partial`)
> Seulement si aucun match parfait. B offre quelque chose que A cherche, mais B ne veut rien de A.

```
Si A cherche "Guitare" et B offre "Guitare"
(mais B ne cherche rien que A offre)
→ MATCH PARTIEL ✅
→ Score de base : 40 points par paire
```

### Bonus de niveau (`levelBonus`) :
| Situation | Bonus |
|---|---|
| Niveau offert = niveau cherché | +20 points |
| Niveau offert = un cran au-dessus | +10 points |
| Niveau offert inférieur | +0 points |

### Labels de compatibilité :
| Score | Label |
|---|---|
| ≥ 70 | "Très compatible" |
| ≥ 50 | "Compatible" |
| < 50 | "Partiellement compatible" |

### Upsert intelligent :
- Si le match existait déjà → **mise à jour** du score
- Si un match partiel devient parfait → **notification "match upgradé"** envoyée aux 2 utilisateurs
- L'algorithme se reclenche à chaque **login** et après l'**onboarding**

---

## 7. ⏳ Système de Crédits — L'Économie Temps

### Règles fondamentales :
- **Plafond** : 20 crédits maximum (pour forcer la circulation)
- **Plancher** : 0 crédit minimum
- **Taux** : 1 heure = 1 crédit (arrondi au supérieur)
- **Bonus de bienvenue** : 2 crédits à l'inscription
- **Bonus parrainage** : 5 crédits pour le parrain quand son filleul s'inscrit

### Cycle de vie des crédits (lors d'une session) :

```
1. PROPOSITION d'une session (partielle seulement)
   → reserve() : crédits "bloqués" (creditReserved↑)
   
2. Si ACCEPTÉE
   → debit() : crédits réellement débités (creditBalance↓)
   
3. Si REFUSÉE ou ANNULÉE
   → refund() : crédits restitués (creditReserved↓)

4. Session COMPLÉTÉE
   → credit() : le formateur gagne des crédits
   → Si plafond atteint : notification d'avertissement + crédits perdus
```

> **Match parfait** = échange gratuit, 0 crédit débité (les 2 s'enseignent mutuellement)

---

## 8. 📅 Gestion des Sessions — Cycle de Vie

### États d'une session :

```
[pending] → [confirmed] → [completed] ✅
     ↓            ↓
[cancelled]   [cancelled]
              [disputed]
              [auto_completed] (après 24h sans confirmation)
```

### Endpoints API (Sessions Controller) :

| Méthode | Route | Action |
|---|---|---|
| `POST` | `/sessions` | Proposer une session |
| `GET` | `/sessions` | Mes sessions (avec filtres) |
| `GET` | `/sessions/:id` | Détail d'une session |
| `PATCH` | `/sessions/:id/accept` | Accepter |
| `PATCH` | `/sessions/:id/decline` | Refuser |
| `PATCH` | `/sessions/:id/cancel` | Annuler |
| `PATCH` | `/sessions/:id/confirm` | Confirmer la réalisation |
| `GET` | `/sessions/:id/messages` | Chat de la session |
| `POST` | `/sessions/:id/messages` | Envoyer un message |

### Intégration Jitsi :
- Un lien de réunion **Jitsi Meet** est généré automatiquement à la confirmation de la session

---

## 9. 🔔 Notifications

Le système envoie des notifications in-app pour :

| Événement | Notification |
|---|---|
| Nouveau match parfait | `new_perfect_match` |
| Nouveau match partiel | `new_partial_match` |
| Match partiel → parfait | `match_upgraded` |
| Session proposée | `session_proposed` |
| Session acceptée | `session_accepted` |
| Session refusée/annulée | `session_declined / session_cancelled` |
| Session complétée | `session_completed` |
| Crédits gagnés | `credits_earned` |
| Crédits remboursés | `credits_refunded` |
| Badge obtenu | `badge_earned` |

---

## 10. 🖥️ Frontend — Pages et Navigation

### Structure des routes Next.js :

```
app/
├── page.tsx              → Page d'accueil (Landing)
├── (auth)/               → Groupe sans layout dashboard
│   ├── login/            → Connexion
│   └── register/         → Inscription
├── onboarding/           → Étapes de configuration du profil
└── (dashboard)/          → Groupe avec sidebar
    ├── dashboard/         → Tableau de bord principal
    ├── matches/           → Liste des matchs
    ├── sessions/          → Mes sessions
    ├── messages/          → Messagerie
    ├── profile/           → Mon profil
    ├── credits/           → Mon solde et historique
    └── users/             → Annuaire des utilisateurs
```

### Design System :
- Thème **"Grunge Rock 90s"** : tons sombres (#2E2E2E), jaune sale (#B5A642), rouge sourd (#8C2727)
- Typographie **Courier New** (monospace, style vintage)
- Animations subtiles (fade + translateY, 420ms)
- **Anti-patterns bannis** : pas d'emojis dans l'UI, pas de noir pur, pas de 3 colonnes égales

---

## 11. 🧩 Modules Backend (NestJS)

| Module | Responsabilité |
|---|---|
| `AuthModule` | Inscription, connexion, refresh, logout, JWT |
| `UsersModule` | Profil utilisateur, avatar |
| `OnboardingModule` | Configuration initiale du profil et compétences |
| `SkillsModule` | Catalogue de compétences, autocomplete |
| `MatchingModule` | Algorithme de matching, liste des matchs |
| `SessionsModule` | Cycle de vie des sessions, chat |
| `CreditsModule` | Réservation, débit, remboursement, historique |
| `ReviewsModule` | Évaluations post-session |
| `NotificationsModule` | Notifications in-app |
| `UploadModule` | Upload de photo de profil |
| `PrismaModule` | Connexion à la base de données (singleton) |

---

## 12. 🚀 Déploiement

- **Frontend** : [skilo-frontend-zeta.vercel.app](https://skilo-frontend-zeta.vercel.app/)
- **Backend API** : [skilo-backend-two.vercel.app](https://skilo-backend-two.vercel.app/)
- **Base de données** : Hébergée sur **Neon.tech** (PostgreSQL serverless)

---

## 13. 💬 Questions Fréquentes de Jury — Réponses Clés

**Q : Pourquoi NestJS et pas Express ?**
> NestJS est un framework structuré avec modules, décorateurs, injection de dépendances — idéal pour une API complexe avec beaucoup de fonctionnalités. Express serait trop bas niveau pour ce projet.

**Q : Pourquoi Prisma et pas Sequelize ou TypeORM ?**
> Prisma génère des types TypeScript automatiquement depuis le schéma, ce qui élimine les erreurs de types au runtime et accélère le développement.

**Q : Comment fonctionne la sécurité des tokens ?**
> Double token : Access Token (15min, en mémoire) + Refresh Token (7j, HTTP-only cookie non accessible par JavaScript). La rotation du Refresh Token à chaque usage empêche le vol de session.

**Q : Pourquoi un plafond de 20 crédits ?**
> Pour forcer la circulation des connaissances. Si on accumule sans limite, les gens n'enseignent plus. Le plafond crée une urgence à apprendre.

**Q : Qu'est-ce qu'un match parfait vs partiel ?**
> Parfait = échange mutuel des deux compétences, gratuit. Partiel = une seule direction, payant en crédits. Le système incite à compléter son profil pour obtenir des matchs parfaits.

**Q : Pourquoi le monorepo Turborepo ?**
> Pour partager du code (composants UI, types TypeScript) entre frontend et backend, avec un seul point d'installation et une commande unique pour lancer les deux serveurs.

---

## 14. 🔑 Points Clés à Retenir pour la Soutenance

1. **Concept** : Échange de compétences basé sur le temps (1h = 1 crédit)
2. **Architecture** : Monorepo (Turborepo) = Frontend Next.js + Backend NestJS
3. **Base de données** : PostgreSQL via Prisma ORM, 10 modèles reliés
4. **Algorithme de matching** : Parfait (mutuel, gratuit) vs Partiel (unilatéral, payant)
5. **Crédits** : Réservation → Débit → Remboursement / Crédit. Plafond 20.
6. **Sécurité** : JWT double token, bcrypt, brute-force protection, token blacklist
7. **Sessions** : Cycle complet pending→confirmed→completed avec chat intégré (Jitsi)
8. **Déployé** : Frontend et Backend sur Vercel, DB sur Neon.tech
