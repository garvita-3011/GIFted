import React from 'react';
import './style.scss';
import AppIcon from '../AppIcon';

export default function Header () {
  return (
    <header className="header elevated">
      <div className="header-text-view">
        <AppIcon />
        <h6 className="header-text">GIFted</h6>
      </div>
    </header>
  );
}
