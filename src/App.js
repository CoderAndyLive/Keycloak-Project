// src/App.js
import React, { useEffect, useState } from 'react';
import { initKeycloak, getToken, logout, keycloak } from './KeyCloakService';

/**
 * Hauptanwendungskomponente.
 * @returns {JSX.Element} - Die gerenderte Komponente.
 * 
 * Entwicklung einer Komponente zur Autorisierung des Users auf einer Seite:
 * Diese Komponente stellt sicher, dass der Benutzer authentifiziert ist, bevor er auf die Anwendung zugreifen kann.
 * Sie zeigt unterschiedliche Inhalte basierend auf den Rollen des Benutzers an.
 */
function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    initKeycloak(() => {
      setAuthenticated(true);
    }).catch((error) => {
      console.error('Keycloak initialization failed', error);
    });
  }, []);

  /**
   * Überprüft, ob der Benutzer eine bestimmte Rolle hat.
   * @param {string} role - Die zu überprüfende Rolle.
   * @returns {boolean} - True, wenn der Benutzer die Rolle hat, andernfalls false.
   * 
   * Role Based Access Control Konzept:
   * Diese Funktion überprüft, ob der authentifizierte Benutzer eine bestimmte Rolle hat.
   * Basierend auf den Rollen des Benutzers werden unterschiedliche Inhalte angezeigt.
   */
  const hasRole = (role) => {
    return keycloak.hasRealmRole(role);
  };

  return (
    <div>
      <h1>Meine App</h1>
      {authenticated ? (
        <div>
          <p>Willkommen!</p>
          {!hasRole('user') && <p>Ihr Token: {getToken() || 'Kein Token verfügbar'}</p>}
          {hasRole('admin') && <p>Sie haben Admin-Zugriff!</p>}
          {hasRole('user') && <p>Sie haben Basis Zugriff</p>}
          <button onClick={logout}>Abmelden</button>
        </div>
      ) : (
        <p>Laden...</p>
      )}
    </div>
  );
}

export default App;