// Siyahamba settings.
//
// Leave this as null to run in demo mode: each phone keeps its own requests,
// so passengers and drivers on different phones won't see each other.
//
// To share requests live between passengers and drivers, create a free
// Firebase project and paste its web app settings here (see README.md).
// These keys are safe to publish: access is controlled by firestore.rules.
window.SIYAHAMBA_FIREBASE = {
  apiKey: "AIzaSyAKtPco6W-Cyw8GGXFvlsNKu6bLNNOJSEE",
  authDomain: "siyahamba-group-taxi.firebaseapp.com",
  projectId: "siyahamba-group-taxi",
  storageBucket: "siyahamba-group-taxi.firebasestorage.app",
  messagingSenderId: "482480534689",
  appId: "1:482480534689:web:25ebb0be2bceea77836ce0"
};

/* Example:
window.SIYAHAMBA_FIREBASE = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
*/

// Google Maps key (optional). It adds place search, real driving distances
// and a route map. Leave it as "" to use the built-in places and estimates.
// Setup steps are in README.md under "Google Maps".
window.SIYAHAMBA_GOOGLE_MAPS_KEY = "";


// How drivers pay you for credit. Shown on the driver's "My credit" panel.
window.SIYAHAMBA_TOPUP_INFO = "Bank: Capitec Business\nAccount name: Malita (Pty) Ltd\nAccount number: 1055794123\nBranch code: 450105\nAccount type: Current";

// Business info. Shown on the "About" panel for referal and support. You can leave these as "…" if you don't want to show them.
window.SIYAHAMBA_BUSINESS = { Name: "Malita (Pty) Ltd", RegistrationNumber: "2026/660069/07", Address: "Shemula Area, Ingwavuma, KwaZulu-Natal, 3968", Email: "sbugzoh2@gmail.com", Phone: "+27 83 212 0333" };
window.SIYAHAMBA_REFERRAL_REWARD = 50;
