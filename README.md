Welcome! This is a frontend assignment for a stock trading platform where users can view their holdings, positions, and execute basic trade flows.

Click here for [Screenshots of the UI views](https://excalidraw.com/#json=tky-c3h6wKnyJWW0AKxTW,hYxMjbGU8r3D-6CPBufsrw)
Clicke here to access the [Deployed website link](https://excalidraw.com/#json=tky-c3h6wKnyJWW0AKxTW,hYxMjbGU8r3D-6CPBufsrw) of this assignment 

## 🚀 Steps to Run the App

1. nvm install 20 (if not already installed)
2. nvm use 20
3. npm install
4. npm run dev
5. On the login screen, enter a valid phone number
6. Enter any 6-digit OTP
7. Select from success / failure / server error to test all login flows
8. On successful login, the dashboard opens with the Holdings screen as default
9. You can hover on instruments to see buy/sell option -> which on click -> opens the trading modal
10. To logout, go to inspect->application->cookies->delete "user-details" cookie & reload

## ⚠️ Notes
This version is desktop-only (no tablet/mobile responsiveness yet)

Focused mostly on login flow and instruments UI

## 🛠️ Things to Improve (if more time available)

1. Proper API response mocking
2. Update holdings/positions after buy/sell actions
3. Build order book and positions screens
4. Add mobile/tablet responsive layouts
5. FAB better UI
6. Add animations for:
   a. CTA clicks
   b. Popup transitions
   c. Loading indicators
