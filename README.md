# Waspito Rewards

Application de récompenses pour les utilisateurs de Waspito, permettant de gagner des points et des badges.

## Fonctionnalités

- Système d'authentification
- Gestion des commentaires (création, suppression)
- Système de likes
- Points de récompense
- Badges pour les accomplissements
- Interface utilisateur moderne et responsive

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Accès à l'API Waspito (URL fournie dans les variables d'environnement)

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/Agirem/waspi-front
cd waspi-front
```

2. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurer les variables d'environnement :
   - Copier le fichier `.env.example` en `.env`
   - Modifier l'URL de l'API si nécessaire dans le fichier `.env`

## Développement

Lancer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible à l'adresse : `http://localhost:5173`



## Technologies Utilisées

- Vue.js 3
- Tailwind CSS
- Axios pour les requêtes API
- Vite comme bundler

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request


