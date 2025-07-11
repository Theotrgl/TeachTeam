# TeachTeam (TT) – Frontend Prototype

This is a frontend-only React TypeScript project for the TeachTeam (TT) system. It's a prototype for hiring casual tutors at the School of Computer Science.

## 👨‍🏫 How to Run the Project

1. **Clone the repo:**
   ```bash
   git clone git@github.com:rmit-fsd-2025-s1/s4115252-s4115477-a1.git
   cd assignment-1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```

The app will run at `http://localhost:3000` (or similar).

## 🔐 Login Details

Use the following dummy account to log in:

**Tutor:**
- Email: `john123@gmail.com`
- Password: `Password123!`

**Lecturer:**
- Email: `jane123@gmail.com`
- Password: `Password456!`

## 🧪 Features
**Landing Page**
Overview of what TeachTeam does
Navigation bar (Sign In, Sign Up, etc.)

**Sign In**
Simple login form (email + password)
Validates format and checks against dummy data
Shows success message on login

**Tutor Page (after login as tutor)**
1. Fill profile page (`http://localhost:3000/profile`) with:

- Previous roles
- Skills and credentials
- Availability

2. Submit an application (`http://localhost:3000/course-select`) with:


**Lecturer Page (after login as lecturer)**
1. View list of tutor applications (`http://localhost:3000/tutors`)

2. Filter/search by course, name, availability, or skills

3. Rank, and comment on applicants on profile page (`http://localhost:3000/profile`)

4. See visual stats:

- Most chosen
- Least chosen
- Not chosen applicants

## 🛠️ Tech Stack
- **React + TypeScript**
- **Tailwind CSS (for styling)**
- **HTML5 localStorage (for data)**
- **Jest (unit tests)**

## 🎨 Assets & Resources
- **Images**: Unsplash

- **Avatars**: UI Faces

- **Icons**: Material Icons

## 🔒 Licensing & Attribution
This project only uses **free and royalty-free** digital assets. All styles and components are custom-built, in line with academic policy.
