import {
  call,
  put,
  take,
  fork,
  cancel,
  cancelled,
  takeLatest,
} from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "redux-saga";
import { authService } from "../../services/authService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  checkSession,
  sessionChecked,
} from "../../features/auth/authSlice";
import type { LoginCredentials, User } from "../../types";

/**
 * Saga de login
 * Gère la connexion utilisateur avec possibilité d'annulation
 */
function* loginSaga(credentials: LoginCredentials): Generator<any, void, any> {
  try {
    // Appel au service d'authentification
    const response = yield call(authService.login, credentials);
    const { user, token } = response as { user: User; token: string };

    // Stocker le token et l'utilisateur
    yield call([localStorage, "setItem"], "token", token);
    yield call([localStorage, "setItem"], "user", JSON.stringify(user));

    // Dispatcher le succès
    yield put(loginSuccess(user));
  } catch (error: any) {
    // Dispatcher l'erreur
    yield put(loginFailure(error.message || "Erreur de connexion"));
  } finally {
    // Exécuté même si la saga est annulée
    if (yield cancelled()) {
      console.log("[Auth Saga] Login annulé");
    }
  }
}

/**
 * Saga de logout
 * Nettoie la session utilisateur
 */
function* logoutSaga(): Generator<any, void, any> {
  try {
    // Appel au service de déconnexion
    yield call(authService.logout);
  } catch (error) {
    console.error("[Auth Saga] Erreur logout:", error);
  } finally {
    // Toujours nettoyer le state
    yield put(setUser(null));
  }
}

/**
 * Saga de vérification de session
 * Restaure l'utilisateur depuis le localStorage
 */
function* checkSessionSaga(): Generator<any, void, any> {
  try {
    const token: string | null = yield call([localStorage, "getItem"], "token");

    if (token) {
      // Vérifier si le token est valide
      const isValid: boolean = yield call(authService.verifyToken, token);

      if (isValid) {
        // Récupérer l'utilisateur depuis le localStorage
        const userStr: string | null = yield call(
          [localStorage, "getItem"],
          "user"
        );

        if (userStr) {
          const user = JSON.parse(userStr) as User;
          yield put(setUser(user));
        }
      } else {
        // Token invalide, nettoyer
        yield call([localStorage, "removeItem"], "token");
        yield call([localStorage, "removeItem"], "user");
      }
    }
  } catch (error) {
    console.error("[Auth Saga] Erreur vérification session:", error);
  } finally {
    yield put(sessionChecked());
  }
}

/**
 * Watcher: Flux d'authentification complet
 * Gère le cycle login/logout avec annulation
 */
function* watchAuthFlow(): Generator<any, void, any> {
  while (true) {
    // Attendre une action de login
    const action: PayloadAction<LoginCredentials> = yield take(loginStart.type);
    const credentials = action.payload;

    // Fork le login (non-bloquant, permet l'annulation)
    const loginTask: Task = yield fork(loginSaga, credentials);

    // Attendre soit logout, soit échec du login
    const resultAction: PayloadAction = yield take([
      logout.type,
      loginFailure.type,
    ]);

    // Si logout pendant le login, annuler la tâche
    if (resultAction.type === logout.type) {
      yield cancel(loginTask);
      yield call(logoutSaga);
    }
  }
}

/**
 * Watcher: Vérification de session au démarrage
 */
function* watchCheckSession(): Generator<any, void, any> {
  yield takeLatest(checkSession.type, checkSessionSaga);
}

/**
 * Watcher: Logout explicite
 */
function* watchLogout(): Generator<any, void, any> {
  yield takeLatest(logout.type, logoutSaga);
}

/**
 * Root Saga d'authentification
 */
export function* authSaga(): Generator<any, void, any> {
  yield fork(watchAuthFlow);
  yield fork(watchCheckSession);
  yield fork(watchLogout);
}

export default authSaga;
