# 📄 Sifarish System — Digital Recommendation Letter Generator

> A full-stack web platform that digitizes the traditional Nepali **सिफारिस (Sifarish)** process — enabling organizations to generate, manage, and issue official recommendation letters with their own branding.

🔗 **Repo:** [github.com/codewithyukesh/certificationsystem](https://github.com/codewithyukesh/certificationsystem)

---

## 🧩 What It Does

In Nepal, government offices, schools, and organizations regularly issue formal recommendation letters (सिफारिस) for various purposes. This system replaces the manual process with a digital workflow:

1. **Select a letter template** (e.g., citizenship recommendation, employment verification, income certificate)
2. **Fill in the required fields** specific to that letter type
3. **System generates** a fully formatted letter with the organization's official **header and footer**
4. **Print or export** — ready for official use

This was inspired by and directly contributed to the **Integrated Digital Siyari System**, now used municipality-wide at Siyari Rural Municipality, Rupandehi.

---

## ✨ Features

- 📋 **Template-based Letter Generation** — Multiple predefined letter types
- 🏛️ **Organization Branding** — Official header, footer, and seal per organization
- 📝 **Dynamic Input Fields** — Form fields adapt based on selected letter type
- 🔐 **User Authentication** — JWT-based secure login
- 📊 **Analytics Dashboard** — Track template usage and letter issuance history
- 🖨️ **Print-ready Output** — Formatted for direct printing or PDF export
- 🗂️ **Letter History** — View and manage previously issued letters

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Auth | JWT (JSON Web Tokens) |
| Styling | CSS3 |

---

## 📁 Project Structure

```
certificationsystem/
├── backend/
│   ├── routes/         # API route definitions
│   ├── models/         # MongoDB schemas
│   ├── controllers/    # Business logic
│   └── middleware/     # Auth & validation
├── frontend/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   └── assets/         # Images, fonts
└── uploads/            # Uploaded assets (logos, seals)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/codewithyukesh/certificationsystem.git
cd certificationsystem

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Setup

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm start
```

App runs at `http://localhost:3000`

---

## 🌍 Real-World Impact

This system directly contributed to the **Integrated Digital Siyari System** deployed at **Siyari Rural Municipality, Rupandehi** — enabling digital certificate and recommendation letter issuance across all 8 offices of the municipality.

---

## 💡 Use Cases

- Government ward offices (सिफारिस letters)
- Schools & colleges (bonafide, character certificates)
- NGOs & organizations (employment, income verification)
- Any institution issuing formal recommendation documents

---

## 👨‍💻 Developer

**Yukesh Chaudhary** — Full Stack Developer | System Analyst at KMC, Nepal

🌐 [yukesh.info.np](https://www.yukesh.info.np) · 💼 [LinkedIn](https://www.linkedin.com/in/yukeshc) · 📧 Link2yukesh@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
