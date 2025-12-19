import { all, fork } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { watchSearch } from "./searchSaga";
import { watchCart } from "./cartSaga";

/**
 * Root Saga
 * Combine toutes les sagas de l'application
 */
export function* rootSaga(): Generator {
  yield all([
    // Auth Saga - Gestion de l'authentification
    fork(authSaga),

    // Search Saga - Recherche avec debounce
    fork(watchSearch),

    // Cart Saga - Synchronisation du panier
    fork(watchCart),
  ]);
}

export default rootSaga;
