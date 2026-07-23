markdown
# 🏥 MEDCRUSH Blockchain Hospital – Health Consultation Booking App

A decentralized health consultation booking platform that stores **sensitive data off‑chain** (in a PostgreSQL database) while using a lightweight Ethereum smart contract for appointment confirmation and completion.

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
- [Admin Dashboard](#admin-dashboard)
- [Hospital Settings & Branding](#hospital-settings--branding)
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

### User Features

- **Doctor Registration & Profile** – doctors sign up and edit their profile (specialty, hospital, bio, etc.).
- **Availability Slots** – doctors create time slots that patients can book.
- **Patient Booking** – patients select a doctor and an available slot, then book an appointment.
- **On‑Chain Status** – appointment status (Pending, Confirmed, Completed) is stored on‑chain.
- **Off‑Chain Data** – patient name, description, and other sensitive info are stored in PostgreSQL.
- **Doctor Dashboard** – doctors view appointments, confirm/reject, and manage slots.
- **Patient Dashboard** – patients view their appointments and status.
- **Role Selector** – users choose "Patient" or "Doctor" role on landing.
- **Responsive UI** – works on both desktop and mobile (Tailwind CSS).
- **Dark / Light Theme** – toggle between themes.
- **Privy Authentication** – email, social, or wallet login.
- **Smart Contract** – deployed on Sepolia testnet, verified on Sourcify.
- **Real‑Time Updates** – appointments refresh after status changes.
- **Health Tips** – daily health tips displayed on the homepage.
- **Delete Appointments** – doctors can delete appointments (with confirmation).
- **Clear All** – doctors can clear all appointments (with confirmation).

### Admin Features

- **Secure Admin Panel** – protected by wallet whitelist (multi‑admin support).
- **Doctor Management** – add, edit, delete, toggle active/inactive.
- **Hospital Settings** – manage hospital name, email, phone, address, social links.
- **Admin Wallet Whitelist** – add/remove admin wallets via the settings page.
- **Statistics Dashboard** – view total appointments, pending, confirmed, completed, cancelled counts.
- **User Overview** – view total doctors and patients.

### Branding

- **Custom Logo** – floating sticky logo in the navbar (60×60 source, responsive).
- **Hospital Info** – displayed in the homepage footer (name, address, phone, email).
- **Favicon** – browser tab icon with "MEDCRUSH" branding.

---

## 🧩 Repository Structure & Team Ownership

```text
medcrush-blockchain-hospital/
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
│   │   ├── admin/
│   │   │   ├── doctors/route.ts
│   │   │   ├── settings/route.ts
│   │   │   └── stats/route.ts
│   │   └── appointments/
│   │       ├── [id]/route.ts
│   │       └── route.ts
│   ├── admin/
│   │   ├── doctors/page.tsx
│   │   ├── settings/page.tsx
│   │   └── page.tsx
│   ├── appointments/
│   │   ├── [id]/page.tsx
│   │   └── create/page.tsx
│   ├── dashboard/
│   │   ├── profile/page.tsx
│   │   └── page.tsx
│   ├── tips/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── AdminLayout.tsx
│   ├── AppointmentCard.tsx
│   ├── AppointmentDetail.tsx
│   ├── AppointmentForm.tsx
│   ├── AppointmentList.tsx
│   ├── ConnectWallet.tsx
│   ├── HealthTips.tsx
│   ├── HospitalInfo.tsx
│   ├── Logo.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   └── useAppointments.ts
├── lib/
│   ├── admin.ts
│   ├── contract.ts
│   ├── format.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── public/
│   ├── favicon.ico
│   └── logo.png
├── types/
├── .env.local.example
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
🛠 Tech Stack
Layer	Technology
Blockchain	Solidity, Foundry (Sepolia testnet)
Frontend	Next.js 14 (App Router), React, TypeScript, Tailwind CSS
Authentication	Privy (email, social, wallet)
Web3	Wagmi v2, Viem, @privy-io/wagmi
Database	PostgreSQL (Neon) with Prisma ORM
Hosting	Vercel (auto‑deploy from GitHub)
Admin	Custom admin dashboard with role‑based access (wallet whitelist)
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
HospitalSettings	Hospital contact, social media, and admin wallet whitelist
Recommended Providers
Neon (best for Vercel) – IPv4 supported, 0.5 GB free storage, connection pooling.

Railway – if you use Railway for hosting, it provides a managed PostgreSQL.

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
The app/providers.tsx file sets up Privy with Wagmi.

🛡️ Admin Dashboard
The admin dashboard provides a secure interface for managing the platform.

Access Control
Multi‑admin wallet whitelist – stored in HospitalSettings.adminWallets.

The environment variable NEXT_PUBLIC_ADMIN_WALLET is used as a fallback if no admin wallets are set.

Admin wallets can be added/removed via the admin settings page.

Features
Feature	Description
Dashboard	View appointment statistics (total, pending, confirmed, completed, cancelled, doctors, patients)
Doctor Management	Add, edit, delete, and toggle doctors active/inactive
Hospital Settings	Update hospital name, email, phone, address, website, and social media links (Twitter, LinkedIn, Facebook, Instagram)
Admin Wallet Management	Add/remove wallet addresses that have admin access
Admin API Routes
Endpoint	Method	Description
/api/admin/doctors	GET	List all doctors
/api/admin/doctors	POST	Add a new doctor
/api/admin/doctors	PUT	Update a doctor
/api/admin/doctors	DELETE	Delete a doctor
/api/admin/settings	GET	Get hospital settings
/api/admin/settings	PUT	Update hospital settings
/api/admin/stats	GET	Get appointment statistics
🏥 Hospital Settings & Branding
Hospital Info
Name: MEDCRUSH BLOCKCHAIN HOSPITAL

Email: medcrush@gmail.com

Phone: 08023000000

Address: 2, Hospital Road, Benin

This information is displayed in the homepage footer and can be updated via the admin settings page.

Logo & Favicon
Logo: public/logo.png (60×60 source, displayed at 32–40px height, responsive)

Favicon: public/favicon.ico (browser tab icon)

The logo is a floating/sticky element at the top‑left corner, independent of the navbar panel (so the navbar stays compact).

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

# WalletConnect Project ID (optional – only if using WalletConnect)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=""

# Admin Wallet – initial admin wallet (fallback)
NEXT_PUBLIC_ADMIN_WALLET="0xYourAdminWalletAddress"
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

Admin Dashboard Access
Ensure NEXT_PUBLIC_ADMIN_WALLET is set to your wallet address (or add your wallet via the admin settings).

Connect with the same wallet to access /admin.

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

## 📌 `.env.local.example` (Full)

```env

# ============================================
# DATABASE (PostgreSQL – Neon)
# ============================================
# Use the pooled connection string from Neon
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-...-pooler.aws.neon.tech/neondb?sslmode=require"

# ============================================
# SMART CONTRACT (Sepolia testnet)
# ============================================
# Deployed contract address – get this after running forge script
NEXT_PUBLIC_CONTRACT_ADDRESS="0x9269C8E4BcE3ac4a1A4cfF37697f54A6342bda95"

# RPC URL – working public endpoint (Tenderly)
NEXT_PUBLIC_RPC_URL="https://sepolia.gateway.tenderly.co"

# Chain ID for Sepolia
NEXT_PUBLIC_CHAIN_ID=11155111

# ============================================
# AUTHENTICATION (Privy)
# ============================================
# Get this from https://console.privy.io → App Settings → Basics
NEXT_PUBLIC_PRIVY_APP_ID="clm7..."

# WalletConnect Project ID (optional – only if using WalletConnect)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=""

# ============================================
# ADMIN DASHBOARD
# ============================================
# Initial admin wallet (fallback) – you can add more via the admin settings
NEXT_PUBLIC_ADMIN_WALLET="0xYourAdminWalletAddress"
