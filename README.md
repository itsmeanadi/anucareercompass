# Perfect Placement

Perfect Placement is a career guidance platform that helps students find internships and prepare for placements. The platform connects talented students with companies looking for interns, offering personalized recommendations and career roadmaps.

## Features

- **Personalized Internship Recommendations**: Based on user skills, preferences, and eligibility
- **Career Roadmaps**: Customized learning paths based on successful seniors' journeys
- **Onboarding Process**: Comprehensive onboarding to understand user goals and preferences
- **Google Authentication**: Secure authentication using Firebase Google OAuth
- **Role-based Access**: Different dashboards for applicants and recruiters
- **Skill Gap Analysis**: Identify areas for improvement based on target roles
- **Application Tracking**: Track and manage internship applications

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd perfect-placement
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── landing/         # Landing page components
│   ├── onboarding/      # Onboarding step components
│   └── recruiter/       # Recruiter-specific components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
│   └── supabase/       # (Removed - was for Supabase)
├── lib/                # Utility functions and contexts
│   ├── auth-context.tsx # Authentication context
│   ├── role-context.tsx # Role management context
│   └── firebase.ts     # Firebase configuration
├── pages/              # Route components
└── App.tsx             # Main application component
```

## Firebase Setup

To use this application, you need to set up a Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firebase Authentication (Email/Password and Google providers)
4. Set up Firestore database with appropriate security rules
5. Configure the Firebase SDK with your project credentials

## Security Rules (Firestore)

Example security rules for Firestore:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /internships/{internshipId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.posted_by;
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a pull request

## License

This project is licensed under the MIT License.