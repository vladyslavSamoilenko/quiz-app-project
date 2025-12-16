# 🎓 QuizApp - Examination System

A modern Full-Stack web application designed for conducting knowledge tests and exams. The project features a robust question creator, an administration panel, and an interactive quiz interface with a scoring system.

**Project created for the "Frontend Frameworks" course.**

🔗 **[Live Demo](https://quiz-app-project-two.vercel.app/)**

---

## 🚀 Tech Stack

The project is built using modern web standards:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** JavaScript (ES6+) / React
* **Backend & Auth:** [Firebase](https://firebase.google.com/) (Firestore Database & Authentication)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Fully Responsive Design)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 🛠 Key Features

### 🔐 Authentication & Security
* **User System:** Secure Registration and Login via Firebase Auth.
* **Protected Routes:** The Dashboard is strictly accessible only to authenticated users.
* **Content Protection:** Exam questions are hidden from non-logged-in guests.

### 📝 Admin Dashboard
* **CRUD Operations:** Create, Read, Update, and Delete questions in real-time.
* **Advanced Question Creator:** Support for 4 distinct question types:
    1.  **Single Choice**
    2.  **Multiple Choice** (with custom point weights for specific options)
    3.  **Matching Pairs** (Drag & Drop logic simulation)
    4.  **Fill in the Blanks** (Sentence building with dropdowns and scoring weights per blank)
* **Scoring Control:** Ability to assign different point values to questions.

### 🎓 Exam Interface (Student View)
* **Google Forms Style:** Clean and intuitive user interface.
* **Randomization:** Questions are shuffled every time the quiz starts.
* **Exam Mode:** Correct answers are hidden during the test.
* **Smart Scoring:** Calculation of total points (including partial points) and percentage results.
* **Result Summary:** Final screen displaying the score, percentage, and a motivational message.

---

## ⚙️ Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vladyslavSamoilenko/quiz-app-project.git
    cd quizz-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your Firebase configuration keys:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser at `http://localhost:3000`.

---

## 👤 Author

**[Vladyslav Samoilenko]**
* Computer Science Student (WSEI)
* GitHub: https://github.com/vladyslavSamoilenko

---

> This project was created for educational purposes.
