import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchNavigation } from "../../services/navigationService";
import SkeletonLoader from "../../SkeletonLoader/SkeletonLoader";
import "./Navigation.css";

interface NavigationItem {
  name: string;
  path: string;
  children?: NavigationItem[];
}

const Navigation = () => {
  const [routes, setRoutes] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        setLoading(true);
        setError(null);
        const navRoutes = await fetchNavigation();
        // Transform flat routes into hierarchical structure
        const hierarchicalRoutes = buildHierarchy(navRoutes);
        setRoutes(hierarchicalRoutes);
      } catch (err) {
        setError("Failed to load navigation");
      } finally {
        setLoading(false);
      }
    };
    loadNavigation();
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const buildHierarchy = (routes: string[]): NavigationItem[] => {
    const root: NavigationItem[] = [];
    const map = new Map<string, NavigationItem>();

    routes.forEach((route) => {
      const parts = route.split("/");
      let currentPath = "";
      let currentParent: NavigationItem[] = root;

      parts.forEach((part) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const existingItem = map.get(currentPath);

        if (!existingItem) {
          const newItem: NavigationItem = {
            name: part.replace(/-/g, " "),
            path: currentPath,
          };
          map.set(currentPath, newItem);
          currentParent.push(newItem);
          currentParent = newItem.children = [];
        } else {
          currentParent = existingItem.children || (existingItem.children = []);
        }
      });
    });

    return root;
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = location.pathname === `/${item.path}`;
    const hasActiveChild = (item.children || []).some(
      (child) =>
        location.pathname === `/${child.path}` ||
        (child.children &&
          child.children.some(
            (grand) => location.pathname === `/${grand.path}`
          ))
    );
    return (
      <li key={item.path}>
        <Link to={`/${item.path}`} className={isActive ? "active" : undefined}>
          {item.name}
        </Link>
        {item.children && item.children.length > 0 && (
          <ul className={hasActiveChild ? "has-active-child" : undefined}>
            {item.children.map((child) => renderNavigationItem(child))}
          </ul>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <nav className="navigation loading">
        <div className="nav-logo">
          <SkeletonLoader width="120px" height="24px" />
        </div>
        <ul>
          <li>
            <SkeletonLoader width="60px" height="20px" />
          </li>
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <SkeletonLoader width="100px" height="20px" />
              <ul>
                {[1, 2].map((j) => (
                  <li key={j}>
                    <SkeletonLoader width="80px" height="18px" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="navigation error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="nav-hamburger"
        aria-label="Open navigation menu"
        onClick={() => setSidebarOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="nav-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <nav className={`navigation${sidebarOpen ? " open" : ""}`}>
        <div className="nav-logo">Acme CMS</div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {routes.map((item) => renderNavigationItem(item))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
