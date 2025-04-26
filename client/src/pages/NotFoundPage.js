import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="notfound-page" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>404 – Page Not Found</h2>
      <p>Oops! We can’t find the page you’re looking for.</p>
      <Link to="/" className="btn">Go back home</Link>
    </div>
  );
}
