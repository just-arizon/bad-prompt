# Frontend Structure

```
src/
├── styles/
│   └── globals.css          # CSS variables, base styles, shared classes
│
├── context/
│   └── AuthContext.jsx      # Global user state: session, plan, usage count
│
├── hooks/
│   └── useAnalyze.js        # Analyze API call + loading/error/result state
│
├── components/
│   ├── Navbar.jsx           # Top nav: logo, plan chip, usage count, auth links
│   └── UpgradeGate.jsx      # Shown when free user hits daily limit
│
├── pages/
│   ├── HomePage.jsx         # Main analyzer UI
│   ├── LoginPage.jsx        # Sign in form
│   ├── SignupPage.jsx       # Sign up form
│   └── UpgradePage.jsx      # Pricing page with Stripe link
│
└── App.jsx                  # Router + AuthProvider wrapper
```

## Install dependencies

```bash
npm install react-router-dom
```

## Environment variable

Create a `.env` file in your React project root:

```
VITE_API_BASE_URL=http://localhost:3001
```

## How auth flow works

1. User signs up → POST /api/auth/signup → receives JWT token
2. Token stored in localStorage
3. AuthContext reads token on mount → fetches /api/auth/me → sets user state
4. Every API call attaches token as `Authorization: Bearer <token>`
5. Backend verifies token, checks plan, checks usage count

## How plan gating works

- `AuthContext` exposes `atLimit` (boolean)
- `HomePage` shows `<UpgradeGate />` instead of the input when `atLimit === true`
- `Navbar` shows usage count and Upgrade button for free users
- After upgrade via Stripe, backend webhook sets `user.plan = "paid"` in DB