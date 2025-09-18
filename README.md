# FamilyApp
Family App PWA

A cross-platform Progressive Web App (PWA) built with React, Firebase, and Firestore that helps families stay organized. The app supports real-time grocery list and to-do list synchronization, offline functionality, and user authentication to keep data private between accounts.

Features:

Cross-Platform PWA: Works on desktop, Android, and iOS. Can be installed directly from the browser (Add to Home Screen).

Authentication: Users must sign in with Firebase Authentication. Each user has their own grocery list and to-do tasks, isolated from others.

Shared Grocery List: Add, remove, and edit grocery items. Updates in real-time across all devices signed in with the same account.

To-Do List: Manage daily tasks alongside groceries. Mark tasks as complete or delete them.

Realtime Sync: Built on Firebase Firestore for instant updates across devices.

Offline Support: Service worker caching ensures the app still works when offline. Data automatically syncs when the device reconnects.

Deployed on Firebase Hosting: Publicly shareable web link. HTTPS out of the box.

Tech Stack:
Frontend: React (Create React App, functional components, hooks)
Backend & Database: Firebase (Authentication, Firestore, Hosting)
PWA Support: Service workers, Web App Manifest
Deployment: Firebase Hosting

Installation on Mobile

Android: Chrome will prompt to “Install App”.

iOS (Safari): Tap Share → Add to Home Screen.
