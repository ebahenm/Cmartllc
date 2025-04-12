import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <h2 className="logo">CMART LLC - Driver</h2>
        <nav>
          <ul className="nav-list">
            <li><a href="/">Dashboard</a></li>
            {/* You can add more links if needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
