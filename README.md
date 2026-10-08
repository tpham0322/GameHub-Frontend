# GameHub Frontend

The GameHub frontend is a responsive React and TypeScript application for discovering games, managing a personal game collection, and writing game reviews.

The frontend communicates with the GameHub Express backend through REST API requests.

## Live Demo

**Frontend:** https://gamehub-frontend-cdio.onrender.com/

**Backend API:** https://gamehub-backend-3cjd.onrender.com

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Persistent authentication using local storage
- Logout functionality
- Protected routes

### Game Discovery

- Search for games using the RAWG API through the GameHub backend
- View game artwork
- View game descriptions
- View release dates
- View ratings
- View game genres
- Navigate from search results to game details

### Game Collection

Authenticated users can:

- Add games to their collection
- View their collection
- Change game status
- Remove games
- Prevent duplicate games from being added

Available statuses:

- Want to Play
- Playing
- Completed

### Reviews

Authenticated users can:

- View game reviews
- Create reviews
- Rate games from 1–5
- Edit their own reviews
- Delete their own reviews

### Profile

The profile page displays:

- Username
- Email
- Account information
- Link to the user's collection
- Link to game discovery
- Logout functionality

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API
- Fetch API

## Frontend Architecture

The application uses reusable React pages, components, Context API authentication, and a centralized API service.

The main frontend structure is:

- `src/components/`
  - `Navbar.tsx`
  - `ProtectedRoute.tsx`
- `src/context/`
  - `AuthContext.tsx`
- `src/pages/`
  - `Home.tsx`
  - `Login.tsx`
  - `Register.tsx`
  - `GameDetails.tsx`
  - `Collection.tsx`
  - `Profile.tsx`
- `src/services/`
  - `api.ts`
- `src/App.tsx`
- `src/main.tsx`

## 🧭 Application Routes

| Route | Description | Authentication |
|---|---|---|
| `/` | Game discovery and search | No |
| `/login` | User login | No |
| `/register` | User registration | No |
| `/games/:id` | Game details and reviews | No |
| `/collection` | User's game collection | Yes |
| `/profile` | User profile | Yes |

## 🔄 Data Flow

The frontend communicates with the GameHub Express backend.

The overall flow is:

React Component → API Service → Express Backend → MongoDB / RAWG API

The frontend does not communicate directly with MongoDB.

The RAWG API key is also not exposed to the frontend. Requests to RAWG are handled by the GameHub backend.

## API Service

The frontend uses a centralized API service located at:

`src/services/api.ts`

The API service handles:

- GET requests
- POST requests
- PUT requests
- DELETE requests
- JWT authorization headers

Authenticated requests include the JWT using the Authorization header.

## Authentication

Authentication is managed using React Context API.

The authentication context is located at:

`src/context/AuthContext.tsx`

The context manages:

- Current user
- JWT token
- Login
- Logout
- Authentication persistence

The JWT and user information are stored in local storage so authentication persists after refreshing the page.

## Protected Routes

Authenticated pages use the `ProtectedRoute` component.

Protected routes include:

- `/collection`
- `/profile`

Users who are not authenticated are redirected to the login page.

## Design

GameHub uses a dark gaming-inspired interface with a blue and cyan aesthetic.

The design includes:

- Dark navy backgrounds
- Blue primary buttons
- Cyan highlights
- Game artwork
- Responsive game cards
- Hover effects
- Blue and cyan accents
- Responsive navigation
- Mobile-friendly layouts

## Responsive Design

The frontend uses Tailwind CSS responsive utilities to support:

- Desktop
- Laptop
- Tablet
- Mobile

Game cards, navigation, forms, and layouts adapt to different screen sizes.

## Environment Variables

### Local Development

Create a `.env` file in the frontend project with:

`VITE_API_URL=http://localhost:5000/api`

### Production

The production frontend uses:

`VITE_API_URL=https://gamehub-backend-3cjd.onrender.com/api`

Environment variables should be configured through the Render dashboard for production rather than committing sensitive configuration to GitHub.

## 📦 Installation

Clone the repository:

`git clone YOUR_FRONTEND_REPOSITORY_URL`

Move into the project directory:

`cd GameHub-Frontend`

Install dependencies:

`npm install`

Create a local `.env` file and configure the backend URL:

`VITE_API_URL=http://localhost:5000/api`

Start the development server:

`npm run dev`

The application will be available at the local Vite development URL.

## 🏗️ Production Build

Create a production build with:

`npm run build`

The production files are generated in the `dist/` directory.

To preview the production build locally:

`npm run preview`

## ☁️ Deployment

The frontend is deployed as a Render Static Site.

### Render Configuration

**Build Command:**

`npm run build`

**Publish Directory:**

`dist`

The production API URL is configured through the Render environment variable:

`VITE_API_URL`

The production value is:

`https://gamehub-backend-3cjd.onrender.com/api`

## Tested Functionality

The frontend has been tested with the following workflows.

### Authentication

- Registration
- Login
- Logout
- Persistent authentication
- Protected routes

### Game Discovery

- Search for games
- Open game details
- Display game artwork
- Display game information
- Display cleaned game descriptions

### Collection

- Add a game
- View collection
- Update game status
- Remove a game
- Duplicate prevention

### Reviews

- Create a review
- View reviews
- Edit a review
- Delete a review

### Navigation

- Home
- Login
- Register
- Game Details
- Collection
- Profile
- Logout

## User Workflow

Register → Login → Search for a game → View Game Details → Add Game to Collection → Track Game Status → Write a Review → Edit/Delete Review → Manage Collection → Logout

## Future Improvements

Possible future frontend improvements include:

- Advanced game filtering
- Genre filtering
- Platform filtering
- Search pagination
- Game recommendations
- Favorite games
- User statistics
- Average community ratings
- Improved loading skeletons
- More advanced profile customization
- Additional responsive UI improvements

## Author

**Truong Pham**
