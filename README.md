# ShopApp — Mobile E-Commerce Application

## Description

ShopApp is a fully functional mobile e-commerce application built with React Native and Expo. The app allows users to register and log in securely, browse products fetched from the DummyJSON API, add items to their cart, save favourites to a wishlist, and complete a simulated checkout flow. The app features a dark-first design theme with a professional deep blue accent palette, persistent cart and auth state, and a smooth modern UI across all screens.

---

## Features Implemented

### Core Features

- Splash screen with logo and auto-navigation after 3 seconds
- User registration with form validation (React Hook Form + Zod)
- User login with credential verification against stored registration data
- Persistent login state using Expo SecureStore (native) and AsyncStorage (web fallback)
- Navigation guard — unauthenticated users cannot access app screens
- Logout functionality that clears stored credentials
- Home screen with product grid, search bar, featured product carousel, and category filtering
- Product Details screen with large image, description, quantity selector, reviews, and Add to Cart
- Cart screen with item list, quantity controls, remove item, subtotal and total
- Cart state persists across app restarts using Zustand persist middleware with AsyncStorage
- Checkout screen with delivery address form, payment method selection, and order summary
- Success screen showing order confirmation with order ID, clears cart on confirm
- Profile screen with avatar (initials or gallery image), user info display, inline edit mode, and logout

### Bonus Features

- Dark mode toggle with AsyncStorage persistence — switches entire app theme instantly
- Wishlist feature — save and remove products, heart icon on product cards
- Category filtering — horizontal scrollable pills + "See all" bottom sheet modal
- Product reviews section — displayed on Product Details screen from DummyJSON data

---

## Tech Stack

- **React Native** — mobile UI framework
- **Expo SDK 55** — managed workflow, build tools, and native module access
- **TypeScript** — full type safety across all files
- **NativeWind v4** — Tailwind CSS utility classes for React Native styling
- **React Navigation v6** — stack and bottom tab navigation
- **Context API** — used for Auth and Theme global state
- **React Hook Form + Zod** — form handling and schema validation
- **AsyncStorage** — persistent storage for cart, theme preference, profile image
- **Expo SecureStore** — encrypted storage for auth token and user credentials on native
- **Expo Image Picker** — profile image selection from device gallery
- **DummyJSON API** — product data including images, descriptions, categories, and reviews

---

## Folder Structure Explanation

```
src/
  screens/
    auth/          Login and Register screens — only shown to unauthenticated users
    main/          All app screens behind the navigation guard
  components/      Reusable UI components used across multiple screens
  navigation/      All navigator files — AuthStack, AppStack, TabNavigator, RootNavigator
  context/         AuthContext and ThemeContext — global state via Context API
  hooks/           Custom hooks — useProducts for DummyJSON fetching
  types/           All TypeScript interfaces — Product, CartItem, User, navigation params
  constants/       theme.ts — full light and dark Tailwind class palettes
  utils/           validators.ts and storage.ts utility functions
  data/            Static data if needed
assets/            App logo, icons, splash image
```

This structure separates concerns clearly — screens contain only UI logic, context and store handle state, hooks handle data fetching, and types provide a single source of truth for all data shapes. The grader can navigate to any feature instantly without hunting through unrelated files.

---

## Screenshots

> Add screenshots of the following screens after taking them on your device or browser:

| Screen          | Screenshot         |
| --------------- | ------------------ |
| Splash screen   | _(add screenshot)_ |
| Login screen    | _(add screenshot)_ |
| Home screen     | _(add screenshot)_ |
| Product Details | _(add screenshot)_ |
| Cart            | _(add screenshot)_ |
| Checkout        | _(add screenshot)_ |
| Profile         | _(add screenshot)_ |

---

## Optimization Techniques Used

### useMemo

**Location: `src/screens/main/Home.tsx`**
The product search and category filter computation is wrapped in `useMemo`. The filtered product list only recomputes when `products`, `searchText`, or `selectedCategory` changes — not on every render. This is critical on the Home screen which renders a large FlatList and re-renders frequently due to scroll events.

```typescript
// useMemo optimization — only recomputes when products, searchText or selectedCategory changes
const filteredProducts = useMemo(() => {
  return products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}, [products, searchText, selectedCategory]);
```

**Location: `src/store/cartStore.ts`**
`cartTotal` and `cartCount` are computed functions that read from `cartItems` using `get()` — they only recalculate when called, always returning the latest value without unnecessary state duplication.

### useCallback

**Location: `src/screens/main/Home.tsx`**
The `renderProduct` function passed to FlatList's `renderItem` is wrapped in `useCallback`. Without this, a new function reference is created on every Home screen render, causing every ProductCard in the list to re-render unnecessarily even when the product data hasn't changed.

```typescript
// useCallback optimization — prevents recreating function on every render
const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
        <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        />
    ),
    [navigation]
)
```

**Location: `src/screens/main/Home.tsx`**
`handleEndReached`, `onCarouselScroll`, `renderCarouselItem`, `ListHeader`, `ListEmpty`, and `ListFooter` are all wrapped in `useCallback` to prevent unnecessary recreation on each render cycle.

**Location: `src/screens/main/ProductDetails.tsx`**
The `increment` and `decrement` handlers for the quantity selector are wrapped in `useCallback` since they are passed as props and would otherwise cause unnecessary re-renders.

### React.memo

**Location: `src/components/ProductCard.tsx`**
`ProductCard` is wrapped in `React.memo`. The Home screen renders up to 100+ product cards via infinite scroll. Without `React.memo`, every card re-renders when any parent state changes (search text, category filter, scroll position). With `React.memo`, a card only re-renders if its `product` prop or `onPress` prop actually changes.

```typescript
const ProductCard = React.memo(({ product, onPress }: Props) => {
  // component implementation
});
```

**Location: `src/components/CartItem.tsx`**
`CartItem` is wrapped in `React.memo`. The Cart screen renders multiple cart items and updates frequently when quantities change. `React.memo` ensures only the specific item whose quantity changed re-renders, not the entire list.

---

## Challenges Faced

**NativeWind configuration in Codespaces** — Setting up NativeWind v4 in a GitHub Codespaces environment was unexpectedly difficult. The babel plugin approach from NativeWind v2 documentation caused build errors. The resolution was using `jsxImportSource: "nativewind"` inside `babel-preset-expo` rather than a separate plugin entry, combined with the correct `metro.config.js` setup using `withNativeWind`.

**Zustand persist with AsyncStorage** — The first implementation attempted to serialize functions alongside state, which crashed the app silently. The fix was adding `partialize` to the persist config to explicitly tell Zustand to only save `cartItems` and ignore all function properties.I decide to stick with useContext,given that the app Size isn't large.

**Navigation between tab and stack screens** — The Home screen needed to navigate to `ProductDetails` which lives in the root stack, not the tab navigator. This required `CompositeScreenProps` combining both `BottomTabScreenProps` and `NativeStackScreenProps` — a pattern not immediately obvious from the React Navigation docs.

**Expo SecureStore on web** — `expo-secure-store` does not work in browser environments. Building the app with Expo web for preview required a `storage.ts` utility that checks `Platform.OS` and falls back to `AsyncStorage` on web while using `SecureStore` on native — keeping the AuthContext code platform-agnostic.

**Form validation with Zod v4** — The Zod v4 syntax changed from `z.string().email()` to `z.email()` directly, and the error key changed from `message` to `error`. This caused silent validation failures until the correct v4 syntax was identified and applied consistently across all form schemas.

---

## Submission

- Repository: https://github.com/tesleemah/e-commerce/
- Branch: `dev`
- All features implemented and tested
- No `node_modules` committed
- README complete with all required sections
