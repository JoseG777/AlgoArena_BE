# Algo Arena — Backend

Backend service for **Algo Arena**, an online competitive programming and algorithm practice platform.

**Live application:** https://alg0-ar3na.web.app/

This repository contains the **Node.js + Express backend**, written in **TypeScript**, responsible for authentication, problem management, code execution via Judge0, and database operations.

---

## Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB (Atlas)**
- **JWT Authentication**
- **Judge0 API (via RapidAPI)**

---

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

---

## Environment Variables

Create a `.env` file in the root of the backend project.

### Required Variables

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

JUDGE0_API_URL=judge0-ce.p.rapidapi.com
RAPIDAPI_KEY=your_rapidapi_key (https://rapidapi.com/judge0-official/api/judge0-ce/pricing)
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com