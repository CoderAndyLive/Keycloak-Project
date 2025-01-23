import Keycloak from 'keycloak-js';

let keycloak = null;

/**
 * Initialisiert die Keycloak-Instanz und verwaltet die Authentifizierung.
 * @param {Function} onAuthenticated - Callback-Funktion, die bei Authentifizierung ausgeführt wird.
 * @returns {Promise} - Ein Promise, das aufgelöst wird, wenn Keycloak initialisiert ist.
 * 
 * Integration von Keycloak in eine Frontend Applikation:
 * Diese Funktion initialisiert die Keycloak-Instanz und verwaltet die Authentifizierung des Benutzers.
 */
const initKeycloak = (onAuthenticated) => {
  if (!keycloak) {
    keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'Keycloak',
      clientId: 'myapp',
    });
  }

  if (keycloak.authenticated) {
    onAuthenticated();
    return Promise.resolve(true);
  }

  return keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
    if (authenticated) {
      onAuthenticated();
    } else {
      window.location.reload();
    }
  }).catch((error) => {
    console.error('Keycloak-Initialisierung fehlgeschlagen', error);
    throw error;
  });
};

/**
 * Ruft das aktuelle Keycloak-Token ab.
 * @returns {string} - Das Keycloak-Token.
 * 
 * Diese Funktion gibt das aktuelle Token des authentifizierten Benutzers zurück.
 */
const getToken = () => {
  return keycloak.token;
};

/**
 * Überprüft, ob der Benutzer eine bestimmte Rolle hat.
 * @param {string} role - Die zu überprüfende Rolle.
 * @returns {boolean} - True, wenn der Benutzer die Rolle hat, andernfalls false.
 * 
 * Role Based Access Control Konzept:
 * Diese Funktion überprüft, ob der authentifizierte Benutzer eine bestimmte Rolle hat.
 */
const hasRole = (role) => {
  return keycloak && keycloak.authenticated && keycloak.hasRealmRole(role);
};

/**
 * Meldet den aktuellen Benutzer ab.
 * 
 * Diese Funktion meldet den aktuell authentifizierten Benutzer ab.
 */
const logout = () => {
  keycloak.logout();
};

export { initKeycloak, getToken, hasRole, logout, keycloak };