import { memo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { useShoppingListCount } from '../context/ShoppingListContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const recipeCount = useShoppingListCount();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    if (location.pathname === '/proposer') navigate('/');
  }

  return (
    <header className="site-header">
      <nav className="header-inner" aria-label="Navigation principale">
        <NavLink className="brand" to="/" aria-label="MIJOTÉ — Retour au catalogue">
          MIJOTÉ
        </NavLink>

        <div className="nav-links">
          <NavLink className="desktop-link" to="/">
            Catalogue
          </NavLink>
          <NavLink className="desktop-link" to="/proposer">
            Proposer une recette
          </NavLink>
          <NavLink to="/courses">Courses <span className="count-badge">{recipeCount}</span></NavLink>

          {user ? (
            <div className="auth-zone">
              <span className="user-name desktop-link">{user.firstName}</span>
              <img className="avatar" src={user.image} alt={`Avatar de ${user.firstName}`} />
              <button className="link-button" type="button" onClick={handleLogout}>
                Se déconnecter
              </button>
            </div>
          ) : (
            <NavLink to="/connexion">Se connecter</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default memo(Header);
