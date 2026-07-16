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
