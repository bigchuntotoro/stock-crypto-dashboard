import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* 로고 */}
        <div
          className="app-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleLogoClick();
            }
          }}
        >
          <div className="app-logo-icon">📈</div>
          <div className="app-logo-text">
            <span className="app-logo-title">Stock & Crypto</span>
            <span className="app-logo-subtitle">Dashboard</span>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="app-navigation">
          <Link
            to="/"
            className={`app-nav-link ${isActive("/") ? "active" : ""}`}
          >
            <span className="app-nav-icon">📊</span>
            <span>대시보드</span>
          </Link>

          <Link
            to="/history"
            className={`app-nav-link ${isActive("/history") ? "active" : ""}`}
          >
            <span className="app-nav-icon">📋</span>
            <span>거래내역</span>
          </Link>
        </nav>

        {/* 우측 상태 */}
        <div className="app-header-right">
          <div className="connection-status">
            <span className="connection-status-dot"></span>
            <span>실시간</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
