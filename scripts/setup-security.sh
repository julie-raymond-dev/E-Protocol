#!/bin/bash

# Script d'initialisation pour configurer la sécurité du repository
# À exécuter une seule fois après le premier push

echo "🔧 Configuration de la sécurité du repository E-Protocol..."

# Vérification des prérequis
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) n'est pas installé. Veuillez l'installer d'abord."
    echo "👉 https://cli.github.com/"
    exit 1
fi

# Vérification de l'authentification
if ! gh auth status &> /dev/null; then
    echo "❌ Vous n'êtes pas authentifié avec GitHub CLI."
    echo "👉 Exécutez: gh auth login"
    exit 1
fi

echo "✅ Prérequis validés"

# Configuration des branch protection rules
echo "🛡️ Configuration des règles de protection de branche..."

gh api repos/julie-raymond-dev/E-Protocol/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["🧪 Test & Lint","🛡️ Security Audit"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "✅ Règles de protection configurées"

# Activation des GitHub Pages
echo "📄 Configuration de GitHub Pages..."

gh api repos/julie-raymond-dev/E-Protocol/pages \
  --method POST \
  --field source='{"branch":"gh-pages","path":"/"}' \
  --field build_type="workflow"

echo "✅ GitHub Pages configuré"

# Configuration des secrets et variables
echo "🔐 Configuration des secrets..."

# Activation des discussions
gh api repos/julie-raymond-dev/E-Protocol \
  --method PATCH \
  --field has_discussions=true

echo "✅ Discussions activées"

# Configuration des labels personnalisés
echo "🏷️ Configuration des labels..."

# Labels pour les types de changements
gh label create "🚀 feature" --description "Nouvelle fonctionnalité" --color "0052cc" || true
gh label create "🐛 bug" --description "Correction de bug" --color "d73a4a" || true
gh label create "📚 docs" --description "Documentation" --color "0075ca" || true
gh label create "🔧 maintenance" --description "Maintenance du code" --color "fbca04" || true
gh label create "⬆️ dependencies" --description "Mise à jour des dépendances" --color "0366d6" || true
gh label create "🔒 security" --description "Sécurité" --color "b60205" || true

# Labels pour les priorités
gh label create "🔥 priority-high" --description "Priorité haute" --color "d93f0b" || true
gh label create "⚡ priority-medium" --description "Priorité moyenne" --color "fbca04" || true
gh label create "❄️ priority-low" --description "Priorité basse" --color "0e8a16" || true

echo "✅ Labels configurés"

# Création du template d'issue
mkdir -p .github/ISSUE_TEMPLATE

cat > .github/ISSUE_TEMPLATE/bug_report.yml << 'EOF'
name: 🐛 Bug Report
description: Signaler un bug dans l'application
title: "[BUG] "
labels: ["🐛 bug"]
body:
  - type: markdown
    attributes:
      value: |
        Merci de prendre le temps de remplir ce rapport de bug !

  - type: textarea
    id: what-happened
    attributes:
      label: Que s'est-il passé ?
      description: Description claire et concise du bug
      placeholder: Décrivez le problème...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Comportement attendu
      description: Que devrait-il se passer normalement ?
      placeholder: Décrivez le comportement attendu...
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Étapes pour reproduire
      description: Comment reproduire ce bug ?
      placeholder: |
        1. Aller à '...'
        2. Cliquer sur '...'
        3. Voir l'erreur
    validations:
      required: true

  - type: dropdown
    id: browsers
    attributes:
      label: Navigateur
      description: Sur quel navigateur avez-vous observé ce problème ?
      options:
        - Chrome
        - Firefox
        - Safari
        - Edge
        - Autre
    validations:
      required: true
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.yml << 'EOF'
name: 🚀 Feature Request
description: Suggérer une nouvelle fonctionnalité
title: "[FEATURE] "
labels: ["🚀 feature"]
body:
  - type: markdown
    attributes:
      value: |
        Merci de suggérer une amélioration pour E-Protocol !

  - type: textarea
    id: problem
    attributes:
      label: Problème à résoudre
      description: Quel problème cette fonctionnalité résoudrait-elle ?
      placeholder: Cette fonctionnalité est importante car...
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Solution proposée
      description: Comment imaginez-vous cette fonctionnalité ?
      placeholder: Je propose d'ajouter...
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considérées
      description: Avez-vous pensé à d'autres solutions ?
      placeholder: J'ai aussi pensé à...

  - type: dropdown
    id: priority
    attributes:
      label: Priorité
      description: Quelle est l'importance de cette fonctionnalité ?
      options:
        - Basse
        - Moyenne
        - Haute
        - Critique
    validations:
      required: true
EOF

echo "✅ Templates d'issues créés"

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Résumé des configurations appliquées :"
echo "   🛡️  Protection de la branche main activée"
echo "   📄  GitHub Pages configuré"
echo "   💬  Discussions activées"
echo "   🏷️  Labels personnalisés créés"
echo "   📝  Templates d'issues configurés"
echo ""
echo "🚀 Votre repository est maintenant sécurisé et prêt pour le déploiement !"
echo "📍 URL de votre application : https://julie-raymond-dev.github.io/E-Protocol/"
