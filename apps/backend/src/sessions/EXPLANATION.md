# Gestion des Sessions

C'est ici que se passe le coeur de Skilo : l'organisation des cours entre utilisateurs.

### Le cycle de vie d'une session

#### 1. Propose (Proposition)
Un utilisateur propose une session a un autre. 
- Si c'est un **Match Partiel**, on reserve les credits de l'eleve tout de suite.
- On verifie que la date est dans le futur et qu'il n'y a pas deja trop de sessions en cours (max 3).

#### 2. Confirm / Decline (Acceptation ou Refus)
- **Acceptation** : La session passe en statut `confirmed`. Si c'est payant, les credits sont definitivement debites.
- **Refus** : La session passe en `declined`. On rend les credits a l'eleve s'ils etaient bloques.

#### 3. Complete (Termine)
Une fois le cours fini, le prof marque la session comme terminee. C'est la qu'il recoit ses credits (sauf si c'etait un Match Parfait gratuit).

#### 4. Cancel (Annulation)
N'importe qui peut annuler avant le debut. On rend les credits si besoin.

---

### Le Chat
Chaque session a son propre chat pour que les deux personnes puissent s'organiser. Les messages sont stockes en base de donnees liee a l'ID de la session.

### Les Notifications
A chaque changement d'etape (nouvelle proposition, acceptation, etc.), on envoie une notification pour prevenir l'autre utilisateur.
