# ShopApp — Professional Mobile E-Commerce Solution

## Description

ShopApp is a fully functional mobile e-commerce application engineered with **React Native** and **Expo SDK 55**. Designed with a "Mobile-First" philosophy, it features a sophisticated deep-blue dark theme, seamless navigation guards, and a robust state management architecture. The application integrates real-time data fetching from the **DummyJSON API** to provide a realistic shopping experience from discovery to a simulated checkout.

---

## Features Implemented

### Core Features

- **Splash Screen:** Features the app logo and name with a 3-second auto-navigation timer.
- **Authentication Flow:** Secure login and registration with email/password validation and error handling.
- **Navigation Guard:** Prevents unauthenticated users from accessing main app content.
- **Home Screen:** Dynamic product grid with a search bar and featured product carousel.
- **Product Details:** Detailed view including large images, description, quantity selection, and "Add to Cart" functionality.
- **Cart System:** Persistent cart state with quantity controls, subtotal/total calculations, and item removal.
- **Checkout Flow:** Simulated delivery address form, payment method selection, and success screen with automatic cart clearing.
- **Profile Management:** User info display, gallery image picking for avatars, and secure logout.

### Bonus Features

- **Dark Mode Toggle:** Instant theme switching with persistent user preference.
- **Wishlist Feature:** Ability to save favorites to a dedicated list via a heart toggle on product cards.
- **Category Filtering:** Advanced horizontal scrollable pills and a modal-based category selector.
- **Product Reviews:** Dynamic review sections on the details screen.

---

## Tech Stack

- **Framework:** React Native & Expo (SDK 55)
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **Type Safety:** TypeScript
- **State Management:** Context API + `useReducer` for Auth, Cart, and Wishlist logic
- **Persistence:** Expo SecureStore (Auth) and AsyncStorage (Theme/Cart/Wishlist)

---

## Folder Structure Explanation

The project follows a modular architecture to separate concerns and improve scalability:

- `src/screens/`  
  Divided into `auth/` and `main/` to enforce navigation security.

- `src/components/`  
  Houses reusable UI elements like `ProductCard` and `CategoriesModal`.

- `src/context/`  
  Centralizes global state using the `useReducer` pattern for predictable data flow.

- `src/hooks/`  
  Contains custom hooks like `useProducts` for clean API integration.

- `src/types/`  
  Single source of truth for all TypeScript interfaces.

---

## Screenshots

| Screen              | Screenshot            |
| :------------------ | :-------------------- |
| **Splash Screen**   | _[Insert Image Here]_ |
| **Login Screen**    | _[Insert Image Here]_ |
| **Home Screen**     | _[Insert Image Here]_ |
| **Product Details** | _[Insert Image Here]_ |
| **Cart Screen**     | _[Insert Image Here]_ |
| **Checkout Screen** | _[Insert Image Here]_ |
| **Profile Screen**  | _[Insert Image Here]_ |

---

## Optimization Techniques Used

To ensure high performance and a smooth 60fps experience, the following optimizations were applied:

- **useMemo:**  
  Applied to product search and category filtering logic on the Home Screen to prevent heavy recalculations on every keystroke.

- **useCallback:**  
  Used for `renderItem` functions in FlatLists and event handlers passed to child components to maintain referential stability.

- **React.memo:**  
  Applied to `ProductCard` and `CartItem` components to ensure only the updated item re-renders instead of the entire list.

---

## Challenges Faced

- **NativeWind v4 Configuration:**  
  Initial setup in Expo required custom Metro and Babel configurations to avoid build crashes.

- **State Persistence with useReducer:**  
  Coordinating AsyncStorage updates with reducer actions required careful side-effect management to avoid data desynchronization.

- **Navigation Guard Complexity:**  
  Managing type-safe navigation across nested Tab and Stack navigators required advanced use of `CompositeScreenProps`.

- **AsyncStorage Build Issues:**  
  Resolved Android Gradle dependency errors (`org.asyncstorage.shared_storage`) by enforcing Maven Central repositories in the build configuration.

---

### Submission

```bash
- Repository: https://github.com/tesleemah/e-commerce/
- Branch: `dev`
- All features implemented and tested
- No `node_modules` committed
- README complete with all required sections
```
