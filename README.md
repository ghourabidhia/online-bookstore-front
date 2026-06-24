# Online Bookstore — Frontend

React + TypeScript single-page application Online Bookstore.
Lets users browse books, manage a shopping cart, and place orders — all secured with JWT authentication.

---

## Prerequisites

The following tools must be installed on your machine:

- **Node.js** 18 or higher
- **npm** (included with Node.js)
- **Git**
- **Backend running** on `http://localhost:8080` — see the [backend README](../online-bookstore/README.md)

Verify your versions:

```bash
node --version
npm --version
```

---

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>

# 2. Go into the project folder
cd online-bookstore-front

# 3. Install dependencies
npm install
```


## Run the Application

Start the development server:

```bash
npm run dev
```

The app is available at:

```
http://localhost:3000
```

> The backend must be running on `http://localhost:8080` before you open the app.
> All API calls (`/api/*`) are automatically forwarded to the backend by the Vite proxy.

---


## Project Architecture

```
src/
├── api/
├── components/
│   ├── auth/
│   ├── books/
│   ├── cart/
│   ├── common/
│   ├── layout/
│   └── orders/
├── context/
├── hooks/
├── pages/
├── router/
├── types/
└── utils/
```

| Folder | Role |
|---|---|
| `api/` | All Axios calls to the backend — one file per resource (auth, books, cart, orders) plus the shared Axios client with JWT interceptors |
| `components/auth/` | Login and register forms with validation |
| `components/books/` | Book card and book grid used on the catalog page |
| `components/cart/` | Cart item row with quantity stepper and order summary sidebar |
| `components/common/` | Reusable UI pieces: spinner, error alert, pagination, and protected route guard |
| `components/layout/` | App shell with the responsive navbar and main content area |
| `components/orders/` | Order card showing items, quantities, and totals |
| `context/` | Global state for the authenticated user (AuthContext) and the shopping cart (CartContext) |
| `hooks/` | Custom hooks that fetch data from the backend — books with pagination, order history |
| `pages/` | One file per route — composes components into full page views |
| `router/` | Route definitions, public vs protected route logic, and redirect rules |
| `types/` | TypeScript interfaces that match the backend DTO shapes |
| `utils/` | Shared helpers: JWT token read/write, price formatting (€ fr-BE), and backend error message extraction |

---

## Main Features

- **Browse the catalog** — paginated list of books sorted by title, 12 per page
- **Search by page** — navigate forward and backward through the catalog
- **Out-of-stock indicator** — "Add to Cart" button is disabled when a book has no stock
- **Register** — create a new account with first name, last name, email, and password
- **Login** — authenticate and receive a JWT token stored in `localStorage`
- **Stay logged in** — session is restored from the token automatically on page refresh
- **Shopping cart** — add books, increase or decrease quantity, remove items
- **Live cart badge** — navbar shows the total number of items in the cart
- **Checkout** — review the full order before confirming
- **Place an order** — cart is converted to an order, stock is reduced, cart is cleared
- **Order history** — view all past orders with items, unit prices, and totals
- **Order confirmation** — dedicated page shown immediately after a successful order
- **Auto logout** — if the backend returns 401, the token is cleared and the user is redirected to the login page

---

## API Connection

The frontend talks to the Spring Boot backend through a single Axios instance (`src/api/client.ts`).

**Backend base URL (development):**


http://localhost:8080


**How JWT authentication works:**

Every request to a protected endpoint automatically includes the token:

```
Authorization: Bearer <token>
```

The token is read from `localStorage` before each request (request interceptor).
If the backend responds with `401 Unauthorized`, the token is deleted and the user is redirected to `/login` (response interceptor).

**Endpoint groups used:**

| Group | Base path | Auth required |
|---|---|---|
| Authentication | `/api/auth/register`, `/api/auth/login` | No |
| Books | `/api/books` | No |
| Cart | `/api/cart`, `/api/cart/items` | Yes — JWT |
| Orders | `/api/orders` | Yes — JWT |
