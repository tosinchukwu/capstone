
# 🏥 Health Consultation Booking App

A decentralized health consultation booking platform that stores **sensitive data off-chain** in PostgreSQL while using an Ethereum smart contract for appointment confirmation and completion.

> **Privacy first:** Patient names, symptoms, and descriptions never touch the blockchain. Only appointment IDs and status are stored on-chain.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure & Team Ownership](#repository-structure--team-ownership)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Smart Contract (Foundry)](#smart-contract-foundry)
- [Database (PostgreSQL)](#database-postgresql)
- [Authentication with Privy](#authentication-with-privy)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment to Vercel](#deployment-to-vercel)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Overview

This application allows patients to book consultations with doctors.

### Workflow

1. Patient signs in using **Privy** (email, social login, or wallet).
2. Patient books an appointment.
3. The smart contract stores:
   - Appointment ID
   - Patient wallet
   - Doctor wallet
   - Appointment date
   - Status
4. PostgreSQL stores:
   - Patient name
   - Symptoms
   - Description
   - Other sensitive information
5. Doctor confirms or completes the appointment.
6. The frontend combines on-chain status with off-chain data.

---

## 🧩 Repository Structure & Team Ownership

```text
tcc7-t9-hcbookingapp/
├── abis/
│   └── HealthConsultationBooking.json
├── contracts/
│   ├── src/
│   ├── script/
│   ├── test/
│   ├── lib/
│   └── foundry.toml
├── app/
│   ├── api/
│   ├── appointments/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
├── lib/
│   ├── constants.ts
│   ├── contract.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── public/
├── types/
├── .env.local.example
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
```

| Member | Responsibilities |
| --- | --- |
| 👨‍💻 Member 1 | Smart contract, tests, deployment, ABI |
| 🎨 Member 2 | UI, pages, components, Tailwind |
| 🔗 Member 3 | Web3 integration, hooks, APIs |
| 🧠 Member 4 | Prisma, PostgreSQL, CI/CD, deployment |

---

## 🛠 Tech Stack

- Solidity
- Foundry
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Privy
- Wagmi
- Viem
- Vercel

---

## 📦 Prerequisites

- Node.js 18+
- npm
- Git
- Foundry
- PostgreSQL (Neon recommended)
- Privy account

---

## 🔧 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/tosinchukwu/tcc7-t9-hcbookingapp.git
cd tcc7-t9-hcbookingapp
```

Install dependencies:

```bash
npm install
```

Install Foundry dependencies:

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts
cd ..
```

Create environment file:

```bash
cp .env.local.example .env.local
```

Generate Prisma client:

```bash
npx prisma generate
npx prisma db push
```

---

## ⛓ Smart Contract (Foundry)

Run tests:

```bash
cd contracts
forge test
```

Deploy:

```bash
forge script script/DeployHealthConsultationBooking.s.sol \
--rpc-url $RPC_URL \
--private-key $PRIVATE_KEY \
--broadcast \
--verify
```

Export the ABI into:

```text
abis/HealthConsultationBooking.json
```

---

## 🗄 Database (PostgreSQL)

Uses Prisma ORM.

Main models:

- User
- Appointment
- Payment
- Review

Recommended providers:

- Neon
- Railway

---

## 🔐 Authentication with Privy

Privy supports:

- Email login
- Google login
- X login
- Wallet login

Configure:

```text
NEXT_PUBLIC_PRIVY_APP_ID
```

---

## 🌐 Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."

NEXT_PUBLIC_RPC_URL="https://rpc.sepolia.org"

NEXT_PUBLIC_CHAIN_ID=11155111

NEXT_PUBLIC_PRIVY_APP_ID="YOUR_PRIVY_APP_ID"
```

---

## 🏃 Running Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🚀 Deployment to Vercel

1. Push to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables.
4. Ensure build script is:

```json
"build": "prisma generate && prisma db push && next build"
```

5. Deploy.

---

## 🤝 Contributing

- Use feature branches.
- Keep PRs focused.
- Run:

```bash
npm run build
forge test
```

before pushing.

---

## 📄 License

MIT License.

---

## ❓ Questions?

Open a GitHub Issue or contact **@tosinchukwu**.

Happy coding! 🚀
