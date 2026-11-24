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
