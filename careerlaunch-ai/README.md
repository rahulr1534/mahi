# CareerLaunch AI - Resume Builder

A comprehensive AI-powered resume builder web application with real-time job search integration.

## Features

- ✅ **AI-Powered Resume Generation**: Create professional resumes with AI assistance
- ✅ **Modern Templates**: Professional, Creative, and Minimalist resume templates
- ✅ **Real-Time Job Search**: Integrated with JSearch API for live job listings
- ✅ **JWT Authentication**: Secure user authentication and authorization
- ✅ **PDF Download**: Export resumes as PDF (coming soon)
- ✅ **Responsive Design**: Dark theme with mobile-friendly interface

## Tech Stack

### Frontend
- React 19
- Tailwind CSS v4
- React Router DOM
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- JSearch API for job data

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- RapidAPI account (for job search)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careerlaunch-ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment Variables**
   Create `.env` file in `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/careerlaunch-ai
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development

   # Get your free API key from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
   RAPIDAPI_KEY=your-rapidapi-key-here
   RAPIDAPI_HOST=jsearch.p.rapidapi.com
   ```

2. **Get RapidAPI Key for Job Search**
   - Visit [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
   - Sign up for a free account
   - Subscribe to the free tier
   - Copy your API key to the `.env` file

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` or next available port

3. **Access the Application**
   Open `http://localhost:5173` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/generate` - Generate AI content

### Jobs
- `GET /api/jobs/search` - Search jobs with filters
- `GET /api/jobs/:id` - Get job details

## Features in Detail

### Resume Builder
- Create resumes with structured sections (personal info, experience, education, skills)
- AI-powered content suggestions
- Three template options (Professional, Creative, Minimalist)
- Real-time preview and editing

### Job Search
- Real-time job listings from multiple sources (LinkedIn, Indeed, etc.)
- Filter by skills, location, and keywords
- Direct application links to job platforms
- Responsive job cards with key information

### Authentication
- Secure JWT-based authentication
- Protected routes for authenticated users
- User registration and login forms
- Persistent login sessions

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Render)
```bash
cd backend
# Deploy to Render with environment variables
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues or questions, please create an issue in the repository.
