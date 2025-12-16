# 🎓 QuizApp - System Egzaminacyjny

Nowoczesna aplikacja webowa typu Full-Stack służąca do przeprowadzania testów wiedzy i egzaminów. Projekt umożliwia tworzenie zaawansowanych pytań, zarządzanie nimi w panelu administratora oraz przeprowadzanie interaktywnych quizów z systemem punktacji.

**Projekt wykonany w ramach zaliczenia przedmiotu: Frameworki Frontendowe.**

🔗 **[Zobacz Demo Live](https://quiz-app-project-two.vercel.app/)** 

---

## 🚀 Technologie

Projekt został zbudowany w oparciu o najnowsze standardy webowe:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Język:** JavaScript (ES6+) / React
* **Baza Danych & Auth:** [Firebase](https://firebase.google.com/) (Firestore & Authentication)
* **Style:** [Tailwind CSS](https://tailwindcss.com/) (RWD, nowoczesny design)
* **Hosting:** [Vercel](https://vercel.com/)

---

## 🛠 Funkcjonalności

### 🔐 Uwierzytelnianie i Bezpieczeństwo
* Rejestracja i Logowanie użytkowników (Firebase Auth).
* **Ochrona tras (Protected Routes):** Panel administratora dostępny tylko dla zalogowanych.
* Blokada widoku treści dla niezalogowanych użytkowników.

### 📝 Panel Administratora (Dashboard)
* **CRUD Pytań:** Tworzenie, Edycja i Usuwanie pytań w czasie rzeczywistym.
* **Kreator Pytań:** Obsługa 4 typów pytań:
    1.  **Pojedynczy wybór** (Single Choice).
    2.  **Wielokrotny wybór** (Multiple Choice) – z możliwością punktowania każdej opcji.
    3.  **Dopasowanie par** (Matching Pairs).
    4.  **Uzupełnianie luk** (Fill in the Blanks) – z systemem punktacji za każdą lukę.
* Możliwość przypisywania różnej wagi punktowej dla pytań.

### 🎓 System Egzaminacyjny (Frontend)
* Interfejs inspirowany **Google Forms**.
* Losowa kolejność pytań przy każdym podejściu.
* Tryb "Egzaminu": Użytkownik nie widzi poprawnych odpowiedzi w trakcie rozwiązywania.
* **System Punktacji:** Zliczanie punktów (również cząstkowych) i obliczanie wyniku procentowego.
* Ekran końcowy z podsumowaniem, oceną i możliwością powtórzenia testu.

---

## ⚙️ Instalacja i Uruchomienie

Aby uruchomić projekt lokalnie, wykonaj poniższe kroki:

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [https://github.com/vladyslavSamoilenko/quiz-app-project.git]
    cd nazwa-repo
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

3.  **Skonfiguruj zmienne środowiskowe:**
    Utwórz plik `.env.local` w głównym folderze i wklej swoje klucze z Firebase:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=twoj_klucz
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=twoj_projekt.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=twoj_projekt
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=twoj_projekt.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=twoje_id
    NEXT_PUBLIC_FIREBASE_APP_ID=twoje_app_id
    ```

4.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    ```

5.  Otwórz przeglądarkę pod adresem `http://localhost:3000`.

---

## 👤 Autor

**[Vladyslav Samoilenko]**
* Student Informatyki (WSEI)
* GitHub: [@TwojNick](https://github.com/TwojNick)

---

> Projekt stworzony w celach edukacyjnych. Wszelkie prawa zastrzeżone.
