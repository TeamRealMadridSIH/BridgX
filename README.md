# BridgeX

> Bridging real problems with real people who can solve them.

## Stack
| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Relational DB | PostgreSQL |
| Document DB | MongoDB (chat messages) |
| Real-time | Socket.IO |
| Auth | JWT |

## Project Structure
```
├── Software/Frontend/      # React application
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Navbar, ProblemCard, ChallengeCard
│       ├── context/     # AuthContext
│       └── pages/       # Home, Login, Register, PostProblem,
│                        # ProblemDetail, Challenges, ChallengeDetail,
│                        # Workspace, Profile, Notifications
└── Software/Backend/node/  # Express backend
    └── src/
        ├── config/      # PostgreSQL init + schema
        ├── controllers/ # auth, problem, challenge, workspace
        ├── middleware/  # JWT auth
        ├── models/      # Mongoose Message model
        ├── routes/      # auth, problems, challenges, user
        └── socket/      # Socket.IO chat handler
```

## Setup

### 1. Backend
```bash
cd Software/Backend/node
cp .env.example .env   # fill in your DB credentials + secrets
npm install
npm run dev
```

### 2. Frontend
```bash
cd Software/Frontend
npm install
npm run dev
```

### Prerequisites
- PostgreSQL running locally (database: `bridgex`)
- MongoDB running locally

## Features
- **Home Feed** — browse, search, filter problems by category/status; upvote
- **Post a Problem** — title, description, category, location, image
- **Solve Flow** — solver sends request → author accepts → workspace auto-created
- **Community Challenges** — organizations post SIH-style challenges; teams apply; org accepts best proposal
- **Real-time Workspace** — Socket.IO chat + linked GitHub repo per workspace
- **Profiles** — role badge, solved count, posted problems, GitHub link
- **Notifications** — in-app alerts for requests, acceptances, applications

## Roles
| Role | Can Do |
|---|---|
| Citizen | Post problems |
| Solver | Browse & offer to solve problems |
| Mentor | Guide teams |
| Organization | Post community challenges, accept applications |
