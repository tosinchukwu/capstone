markdown
# 🏥 Health Consultation Booking App

A decentralized health consultation booking platform that stores **sensitive data off‑chain** (in a PostgreSQL database) while using a lightweight Ethereum smart contract for appointment confirmation and completion status.

> **Privacy‑first**: Patient names, symptoms, and descriptions **never** touch the blockchain – only appointment IDs and statuses are on‑chain.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
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
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Overview

This application allows patients to book consultations with doctors.

### Workflow

1. **Doctor** signs up and creates availability slots (date + time ranges).
2. **Patient** connects their wallet (via Privy), views available slots, and books an appointment.
3. The **smart contract** records the appointment on‑chain:
   - Appointment ID
   - Patient wallet
   - Doctor wallet
   - Appointment date
   - Status (`isConfirmed`, `isCompleted`)
4. **PostgreSQL** stores off‑chain data:
   - Patient name
   - Description / symptoms
   - Prescriptions (future)
   - Ratings (future)
5. **Doctor** confirms or completes the appointment via the dashboard.
6. The **frontend** combines on‑chain status with off‑chain data.

---

## ✨ Features

- **Doctor Registration & Profile** – doctors sign up and edit their profile (specialty, hospital, bio, etc.).
- **Availability Slots** – doctors create time slots that patients can book.
- **Patient Booking** – patients select a doctor and an available slot, then book an appointment.
- **On‑Chain Status** – appointment status (Pending, Confirmed, Completed) is stored on‑chain.
- **Off‑Chain Data** – patient name, description, and other sensitive info are stored in PostgreSQL.
- **Doctor Dashboard** – doctors view appointments, confirm/reject, and manage slots.
- **Responsive UI** – works on both desktop and mobile (Tailwind CSS).
- **Dark / Light Theme** – toggle between themes.
- **Privy Authentication** – email, social, or wallet login.
- **Smart Contract** – deployed on Sepolia testnet, verified on Sourcify.
- **Real‑Time Updates** – appointments refresh after status changes.
- **Health Tips** – daily health tips displayed on the homepage.

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
│   ├── dashboard/
│   ├── tips/
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
Member	Responsibilities
👨‍💻 Member 1	Smart contract, tests, deployment, ABI export
🎨 Member 2	UI/UX, pages, components, Tailwind CSS
🔗 Member 3	Web3 integration, Privy setup, custom hooks, API calls
🧠 Member 4	Prisma, PostgreSQL, CI/CD, environment, deployment
🛠 Tech Stack
Layer	Technology
Blockchain	Solidity, Foundry (Sepolia testnet)
Frontend	Next.js 14 (App Router), React, TypeScript, Tailwind CSS
Authentication	Privy (email, social, wallet)
Web3	Wagmi v2, Viem, @privy-io/wagmi
Database	PostgreSQL (Neon) with Prisma ORM
Hosting	Vercel (auto‑deploy from GitHub)
📦 Prerequisites
Node.js v18+ and npm

Foundry (forge, cast, anvil) – install guide

A PostgreSQL instance – we recommend Neon (free tier)

A Privy account (free) – for authentication

Git

🔧 Installation & Setup
Clone the repository:

bash
git clone https://github.com/tosinchukwu/capstone.git
cd capstone
Install dependencies:

bash
npm install
Install Foundry dependencies (inside the contracts/ folder):

bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts
cd ..
Set up environment variables – copy .env.local.example to .env.local and fill in the values.

Push the Prisma schema to your database:

bash
npx prisma generate
npx prisma db push
Run the development server:

bash
npm run dev
Open http://localhost:3000.

⛓️ Smart Contract (Foundry)
The contract is at contracts/src/HealthConsultationBooking.sol.

Functions
Function	Caller	Description
createAppointment(address doctor, uint256 date)	Patient	Creates a new appointment
confirmAppointment(uint256 appointmentId)	Doctor	Confirms the appointment
completeAppointment(uint256 appointmentId)	Doctor	Marks the appointment as completed
getAppointment(uint256 appointmentId)	Anyone	Returns the appointment struct
Events
AppointmentCreated

AppointmentConfirmed

AppointmentCompleted

Test
bash
cd contracts
forge test
Deploy to Sepolia
bash
forge script script/DeployHealthConsultationBooking.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
After deployment, copy the contract address and update NEXT_PUBLIC_CONTRACT_ADDRESS.

Export ABI
bash
cp contracts/out/HealthConsultationBooking.sol/HealthConsultationBooking.json abis/
🗄️ Database (PostgreSQL)
Uses Prisma ORM. The schema is in prisma/schema.prisma.

Main Models
Model	Description
User	Stores wallet, name, role (PATIENT / DOCTOR), and doctor‑specific fields
Appointment	Links to patient/doctor, stores off‑chain details, and references the on‑chain ID
Availability	Time slots created by doctors
Tip	Health tips displayed on the homepage
Recommended Providers
Neon (best for Vercel) – IPv4 supported, 0.5 GB free storage, connection pooling.

Railway – if you use Railway for hosting, it provides a managed PostgreSQL.

Seed Data
Insert doctors and tips via Neon SQL Editor or using prisma db seed.

🔐 Authentication with Privy
We use Privy to handle authentication (email, social, or wallet login). This replaces WalletConnect and provides a smooth onboarding experience.

Supported Login Methods
Email

Google

X (Twitter)

External wallet (MetaMask, Rabby, Coinbase Wallet, etc.)

Privy Configuration
Create an app at Privy Console.

Copy your App ID and set NEXT_PUBLIC_PRIVY_APP_ID.

In Domains settings, add your Vercel domain (https://your-app.vercel.app).

Provider Setup
The app/providers.tsx file sets up Privy with Wagmi:

tsx
<PrivyProvider appId={privyAppId} config={{ ... }}>
  <WagmiProvider config={wagmiConfig}>
    {children}
  </WagmiProvider>
</PrivyProvider>
🌐 Environment Variables
Create a .env.local file with the following variables:

env
# Database – use the pooled connection string from Neon
DATABASE_URL="postgresql://neondb_owner:...@ep-...-pooler.aws.neon.tech/neondb?sslmode=require"

# Smart Contract (deployed on Sepolia)
NEXT_PUBLIC_CONTRACT_ADDRESS="0x9269C8E4BcE3ac4a1A4cfF37697f54A6342bda95"

# RPC URL – working public endpoint (Tenderly)
NEXT_PUBLIC_RPC_URL="https://sepolia.gateway.tenderly.co"

# Chain ID for Sepolia
NEXT_PUBLIC_CHAIN_ID=11155111

# Privy App ID – from Privy Console → App Settings → Basics
NEXT_PUBLIC_PRIVY_APP_ID="clm7..."
Note: NEXT_PUBLIC_RPC_URL is set to a reliable public endpoint.
If you prefer a dedicated provider, you can use Infura/Alchemy with an API key.

🏃 Running Locally
bash
npm run dev
Open http://localhost:3000.

🚀 Deployment to Vercel
Push your code to GitHub.

In Vercel, create a new project and connect your repository.

Add the environment variables (same as .env.local).

The build script is already set up in package.json:

json
"build": "prisma generate && next build"
Deploy – Vercel will automatically run the build.

🧪 Troubleshooting
Wallet Pop‑Up Not Appearing
If using Privy embedded wallet (email login):

Open the Privy modal (click your profile icon) and confirm the pending transaction there.

If using an external wallet (Rabby, MetaMask):

Open the wallet extension and check the "Activity" tab for a pending transaction.

Ensure your wallet is on Sepolia and you have test ETH for gas.

Pop‑ups blocked: Allow pop‑ups for your site in browser settings.

Privy Domains: Add your Vercel domain to Allowed Origins in the Privy dashboard.

RPC Connection Issues
If you see 404 Not Found or connection errors, update NEXT_PUBLIC_RPC_URL to a working endpoint:

https://sepolia.gateway.tenderly.co ✅ (recommended)

https://ethereum-sepolia.publicnode.com

https://rpc2.sepolia.org

Database Connection
Use the pooled connection string from Neon (contains -pooler).

If you see "relation does not exist", run npx prisma db push to sync the schema.

Profile Update Fails
Ensure yearsExperience is a number – the API parses it correctly.

All required fields (name, specialty) must be provided.

Slots Not Showing for Patients
Slots are stored in the database and do not disappear when the doctor disconnects.

Check that the doctor's id (UUID) is correctly passed from the doctor list.

Refresh the appointment form after the doctor creates slots.

BigInt Serialization Error
If you see Do not know how to serialize a BigInt, the API responses have been fixed to convert BigInt to string.

Ensure app/api/appointments/route.ts uses the serializeBigInt helper.

🤝 Contributing
This project is developed by a team of 4. Please follow the standard Git flow:

Use meaningful commit messages.

Keep PRs small and focused.

Run npm run build locally before pushing to catch type errors.

Ensure contract tests pass (forge test).

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

❓ Questions?
Open an issue on the repository or contact the project lead (@tosinchukwu).

Happy coding! 🚀

text

---

### 📌 What This README Includes

| Section | Content |
|---------|---------|
| **Features** | Complete list of all app features |
| **Team Ownership** | Clean table with responsibilities |
| **Tech Stack** | Clear breakdown by layer |
| **Smart Contract** | Functions, events, test & deploy commands |
| **Environment Variables** | Working RPC (`tenderly.co`) and all required vars |
| **Troubleshooting** | Wallet pop‑up, RPC, DB, profile, slots, BigInt fixes |
| **Privy Setup** | Configuration and provider setup |
| **Deployment** | Vercel steps with build script |


