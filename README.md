```markdown
# 🏥 Health Consultation Booking App

A decentralized health consultation booking platform that stores **sensitive data off‑chain** (in a PostgreSQL database) while using a lightweight Ethereum smart contract for appointment confirmation and completion status.

> **Privacy‑first**: Patient names, symptoms, and descriptions **never** touch the blockchain – only appointment IDs and statuses are on‑chain.

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

This application allows patients to book consultations with doctors. The process is:

1. **Patient** connects their wallet (via Privy – email, social, or crypto wallet) and creates an appointment by:
   - Calling the smart contract (`createAppointment`) – stores minimal data (patient address, doctor address, date, status).
   - Saving detailed information (patient name, symptoms, description) to the **off‑chain database** via an API route.
2. **Doctor** can confirm or complete the appointment by calling the respective contract functions.
3. The **frontend** displays a unified view, combining on‑chain status and off‑chain details.

All sensitive information remains in your private PostgreSQL database, complying with data protection regulations.

---

## 🧩 Repository Structure & Team Ownership

```

tcc7-t9-hcbookingapp/
├── abis/                    # 👨‍💻 Member 1 – Copy contract ABI here
│   └── HealthConsultationBooking.json
├── contracts/               # 👨‍💻 Member 1 – Full Foundry project
│   ├── src/HealthConsultationBooking.sol
│   ├── test/
│   ├── script/
│   ├── lib/                 (dependencies)
│   └── foundry.toml
├── app/                     # 🎨 Member 2 – UI pages (Next.js App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── appointments/...
│   └── api/...              (backend endpoints)
├── components/              # 🎨 Member 2 – Reusable UI components
├── hooks/                   # 🔗 Member 3 – Web3 + API hooks
├── lib/                     # 🔗 Member 3 + 🧠 Member 4
│   ├── contract.ts
│   ├── prisma.ts
│   └── constants.ts
├── types/                   # 🔗 Member 3 – TypeScript types
│   ├── contract.ts
│   └── database.ts
├── prisma/                  # 🧠 Member 4 – Database schema
│   └── schema.prisma
├── public/                  # 🎨 Member 2 – Static assets
├── .env.local.example       # 🧠 Member 4
├── next.config.js           # 🧠 Member 4
├── tailwind.config.js       # 🎨 Member 2
├── package.json             # 🧠 Member 4
└── README.md                # 🧠 Member 4

```

| Member | Responsibilities |
|--------|------------------|
| 👨‍💻 **Member 1** | Smart contract development, Foundry tests, deployment script, ABI export |
| 🎨 **Member 2** | UI/UX design, pages, components, styling (Tailwind) |
| 🔗 **Member 3** | Web3 integration, Privy setup, custom hooks, contract + API calls |
| 🧠 **Member 4** | Project lead, repo management, CI/CD, database, environment, deployment |

---

## 🛠 Tech Stack

- **Blockchain**: Ethereum (Sepolia testnet) – Solidity, Foundry
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Authentication**: Privy (email, social, and wallet login)
- **Web3**: Wagmi, Viem (powered by Privy)
- **Database**: PostgreSQL – accessed via Prisma ORM
- **Hosting**: Vercel (recommended) – free tier works perfectly

---

## 📦 Prerequisites

- Node.js v18+ and npm
- Foundry (forge, cast, anvil) – [install guide](https://book.getfoundry.sh/getting-started/installation)
- PostgreSQL instance – we recommend [Neon](https://neon.tech) (free, supports IPv4)
- Git
- [Privy](https://console.privy.io/) account (free) – for authentication

---

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tosinchukwu/tcc7-t9-hcbookingapp.git
   cd tcc7-t9-hcbookingapp
```

2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install Foundry dependencies (inside the contracts folder):
   ```bash
   cd contracts
   forge install OpenZeppelin/openzeppelin-contracts
   cd ..
   ```
4. Set up environment variables:
   · Copy the example file:
     ```bash
     cp .env.local.example .env.local
     ```
   · Fill in DATABASE_URL, NEXT_PUBLIC_PRIVY_APP_ID, NEXT_PUBLIC_CONTRACT_ADDRESS, etc. (see Environment Variables below).
5. Generate Prisma client and push the schema:
   ```bash
   npx prisma generate
   npx prisma db push   # Creates tables in your PostgreSQL DB
   ```

---

⛓ Smart Contract (Foundry)

The contract is at contracts/src/HealthConsultationBooking.sol. It stores only:

· id, patient, doctor, date, isConfirmed, isCompleted.

Test locally

```bash
cd contracts
forge test
```

Deploy to Sepolia (or local)

```bash
forge script script/DeployHealthConsultationBooking.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

After deployment, copy the contract address and update .env.local and your Vercel environment variables.

Export ABI

Run forge build and copy the ABI from out/HealthConsultationBooking.sol/HealthConsultationBooking.json into abis/HealthConsultationBooking.json. (Only the abi array is needed.)

---

🗄 Database (PostgreSQL)

We use PostgreSQL with Prisma as the ORM. The schema is in prisma/schema.prisma and includes User and Appointment models.

· User: stores wallet (unique), name, role (PATIENT / DOCTOR / ADMIN)
· Appointment: stores chainAppointmentId (links to the contract), patientId, doctorId, date, description, status (PENDING / CONFIRMED / COMPLETED)

Recommended Free PostgreSQL Providers:

· Neon (best for Vercel) – IPv4 supported, 0.5 GB free storage, connection pooling.
· Railway – if you use Railway for hosting, it provides a managed PostgreSQL.

Important: DIRECT_URL vs DATABASE_URL

· We use prisma db push during the build – this works with the pooled connection (DATABASE_URL).
· A separate DIRECT_URL is not required for this setup. If you later switch to manual migrations (prisma migrate deploy), you can add it.

---

🔐 Authentication with Privy

We use Privy to handle authentication (email, social, or wallet login). This replaces WalletConnect and provides a smooth onboarding experience.

· Sign up at Privy Console and create an app.
· Copy your App ID – set it as NEXT_PUBLIC_PRIVY_APP_ID.
· The app/providers.tsx file sets up Privy with Wagmi. No separate wagmi.ts config is needed.

---

🌐 Environment Variables

Create a .env.local file with:

```env
# Database – use your actual PostgreSQL URL (pooled)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Contract deployed on Sepolia (or your chosen chain)
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."
NEXT_PUBLIC_RPC_URL="https://rpc.sepolia.org"   # public RPC, no API key
NEXT_PUBLIC_CHAIN_ID=11155111

# Privy App ID (from console.privy.io)
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
```

Security Note:

· The RPC URL is public (no API key) – it’s safe to expose in the browser.
· DATABASE_URL is never exposed to the client – it’s only used server‑side.
· NEXT_PUBLIC_* variables are safe to expose as they contain no secrets.

---

🏃 Running Locally

Start the development server:

```bash
npm run dev
```

Visit http://localhost:3000. The app will use your configured PostgreSQL database and the deployed contract address (or a local anvil node if you're testing).

---

🚀 Deployment to Vercel

1. Push your code to GitHub.
2. Create a Vercel project and connect your repository.
3. Set environment variables in Vercel (same as above – no .env file needed on Vercel, just add them in the dashboard).
4. Update package.json – ensure the build script is:
   ```json
   "build": "prisma generate && prisma db push && next build"
   ```
5. Deploy – Vercel will automatically run the build script. The database schema will be pushed to your PostgreSQL instance during the build (works for testnet/demo).
6. Your app is live – test the connection by creating an appointment.

Note: For production/mainnet, consider using prisma migrate deploy instead of db push and run migrations manually.

---

🤝 Contributing

This project is designed for 4 team members. Please stick to your assigned folders and communicate via GitHub issues/pull requests.

Guidelines

· Use meaningful commit messages.
· Keep PRs small and focused.
· Run npm run build locally before pushing to catch type errors.
· Ensure the contract tests pass (forge test).

---

📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

---

❓ Questions?

Open an issue on the repository or contact the project lead (@tosinchukwu). Happy coding! 🚀

```
