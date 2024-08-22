import React, { useState, useEffect, useRef } from 'react';
import '../css/header.css';
import '../css/shopdropdown.css';
import DropdownCategories from './DropDownCategories.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHouse, faShop, faBoxOpen, faAddressCard, faAddressBook } from '@fortawesome/free-solid-svg-icons';


const Header = () => {

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <>
      <header className="header-main">
        <div className='header-main-section-1'>
          <div className="logo">
            <h1>Rasheed Stationers</h1>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="actions">
            <button>Login/Register</button>
            <button className="heart-icon">❤️</button>
            <button className="cart-icon">🛒</button>
          </div>
        </div>
      </header>

      <div className='header-main-section-2'>
        <div className='header-main-section2-dropdown'>
          <DropdownCategories />
        </div>
        <div className='header-main-section2-nav'>
          <nav>
            <ul>
              <li>
                <FontAwesomeIcon icon={faHouse} size="sm" />
                Home
              </li>
              <li
                className="navbar-item shop-item"
                onMouseEnter={() => setDropdownVisible(true)}
              >
                <FontAwesomeIcon icon={faShop} size="sm" />
                Shop
                {isDropdownVisible && (
                  <div
                    className="dropdown-menu"
                    onMouseLeave={() => setDropdownVisible(false)}
                    ref={dropdownRef}
                  >
                    <div className="dropdown-grid">

                      <div className="dropdown-column">
                        <h4>Planners</h4>
                        <ul>
                          <li>2025 Planners</li>
                          <li>2025 Planner Refills</li>
                          <li>2024 Planner Refills</li>
                          <li>2024 Digital Planner</li>
                          <li>Undated Planners</li>
                          <li>Twinbooks (Planner + Notebook)</li>
                        </ul>
                      </div>
                      <div className="dropdown-column">
                        <h4>Sketchbooks</h4>
                        <ul>
                          <li>Threadbound Sketchbooks</li>
                          <li>Wirebound Sketchbooks</li>
                        </ul>
                      </div>
                      <div className="dropdown-column">
                        <h4>Notebooks</h4>
                        <ul>
                          <li>Threadbound Notebooks</li>
                          <li>Wirebound Notebooks</li>
                          <li>Self-Care Journals</li>
                          <li>Journaling Kit</li>
                          <li>Mossery Introspect</li>
                        </ul>
                      </div>
                      <div className="dropdown-column">
                        <h4>Notebooks</h4>
                        <ul>
                          <li>Threadbound Notebooks</li>
                          <li>Wirebound Notebooks</li>
                          <li>Self-Care Journals</li>
                          <li>Journaling Kit</li>
                          <li>Mossery Introspect</li>
                        </ul>
                      </div>
                      <div className="dropdown-column">
                        <h4>Notebooks</h4>
                        <ul>
                          <li>Threadbound Notebooks</li>
                          <li>Wirebound Notebooks</li>
                          <li>Self-Care Journals</li>
                          <li>Journaling Kit</li>
                          <li>Mossery Introspect</li>
                        </ul>
                      </div>
                      {/* Add more columns as needed */}
                    </div>
                  </div>
                )}
              </li>
              <li>
                <FontAwesomeIcon icon={faBoxOpen} size="sm" />
                Products
              </li>
              <li>
                <FontAwesomeIcon icon={faAddressCard} size="sm" />
                About
              </li>
              <li>
                <FontAwesomeIcon icon={faAddressBook} size="sm" />
                Contact
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;