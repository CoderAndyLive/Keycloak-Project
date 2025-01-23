// src/App.js
import React, { useEffect, useState } from 'react';
import { initKeycloak, getToken, logout, keycloak } from './KeyCloakService';

/**
 * Main application component.
 * @returns {JSX.Element} - The rendered component.
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
   * Checks if the user has a specific role.
   * @param {string} role - The role to check.
   * @returns {boolean} - True if the user has the role, false otherwise.
   */
  const hasRole = (role) => {
    return keycloak.hasRealmRole(role);
    
  };

  return (
    <div>
      <h1>My App</h1>
      {authenticated ? (
        <div>
          <p>Welcome!</p>
          {!hasRole('user') && <p>Your token: {getToken()}</p>}
          {hasRole('admin') && <p>You have admin access!</p>}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    
  );
}

export default App;