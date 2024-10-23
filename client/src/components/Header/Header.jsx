import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../css/header.css';
import '../../css/shopdropdown.css';
import DropdownCategories from './DropDownCategories.jsx';
import DropDownProfile from './DropDownProfile.jsx';
import SearchBar from './SearchBar.jsx'
import { Badge } from 'antd';
import { useCart } from '../../context/CartContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from '../../context/UserContext.jsx'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { faHouse, faShop, faBoxOpen, faAddressCard, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import publicAxiosInstance from '../../utils/publicAxiosInstance.js';
import { MenuOutlined } from '@ant-design/icons';

const Header = () => {

  const { cart } = useCart();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isDropdownVisible2, setDropdownVisible2] = useState(false)
  const dropdownRef = useRef(null);
  const { user } = useUserContext();
  const [categories, setCategories] = useState([]);
  const [isMobileNavVisible, setMobileNavVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicAxiosInstance.get('/get-subCategories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response || error.message);
      }
    };

    fetchCategories();
  }, []);

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
          <Link to={'/'}>
            <div className="header-logo">
              <h1>Rasheed Stationers</h1>
            </div>
          </Link>
          <SearchBar />
          <div className="header-actions">

            <Link to={'/mycart'}>
              <Badge size='small' count={cart.length}>
                <ShoppingCartOutlined style={{ fontSize: '28px' }} />
              </Badge>
            </Link>

            {user ? (
              <>
                <DropDownProfile isLoggedIn={true} />
              </>
            ) : (
              <>
                <DropDownProfile isLoggedIn={false} />
              </>
            )}


          </div>
        </div>

        <div className='header-main-section-2'>
          <div className='header-main-section2-dropdown'>
            <DropdownCategories />
          </div>


          <div className="header-main-section2-nav-1">
            <nav onMouseLeave={() => setDropdownVisible(false)}>
              <ul>
                <Link to={'/'}>
                  <li>
                    <FontAwesomeIcon icon={faHouse} size="sm" />
                    Home
                  </li>
                </Link>
                <li
                  className="navbar-item shop-item"
                  onMouseEnter={() => setDropdownVisible(true)}
                >
                  <FontAwesomeIcon icon={faShop} size="sm" />
                  Shop
                  {isDropdownVisible && (
                    <div
                      className="dropdown-menu"
                      ref={dropdownRef}
                    >
                      <div className="dropdown-grid">
                        {categories.map((category) => (
                          <div className="dropdown-column" key={category._id}>
                            <h4>{category.name}</h4>
                            <div className="home-dropdown-option">
                              {category.types.map((type) => (
                                <Link
                                  key={type._id}
                                  to={`/products?type=${encodeURIComponent(type.name)}`}
                                >
                                  <span onClick={() => setDropdownVisible(false)}>{type.name}</span>
                                </Link>
                              ))}
                            </div>


                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
                <Link to={'/products'}>
                  <li>
                    <FontAwesomeIcon icon={faBoxOpen} size="sm" />
                    Products
                  </li>
                </Link>


                <Link to={'/about'}>
                  <li>
                    <FontAwesomeIcon icon={faAddressCard} size="sm" />
                    About
                  </li>
                </Link>

                <li>
                  <FontAwesomeIcon icon={faAddressBook} size="sm" />
                  Contact
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-main-section2-nav-2">
            <nav onMouseLeave={() => setDropdownVisible2(false)}>
              <ul>
                <li
                  className="navbar-item shop-item"
                  onMouseEnter={() => setDropdownVisible2(true)}
                >
                  <FontAwesomeIcon icon={faShop} size="sm" />
                  Shop
                  {isDropdownVisible2 && (
                    <div
                      className="dropdown-menu"
                      ref={dropdownRef}
                    >
                      <div className="dropdown-grid">
                        {categories.map((category) => (
                          <div className="dropdown-column" key={category._id}>
                            <h4>{category.name}</h4>
                            <div className="home-dropdown-option">
                              {category.types.map((type) => (
                                <Link
                                  key={type._id}
                                  to={`/products?type=${encodeURIComponent(type.name)}`}
                                >
                                  <span onClick={() => setDropdownVisible2(false)}>{type.name}</span>
                                </Link>
                              ))}
                            </div>


                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
                <Link to={'/products'}>
                  <li>
                    <FontAwesomeIcon icon={faBoxOpen} size="sm" />
                    Products
                  </li>
                </Link>
              </ul>
            </nav>
          </div>

          <div className="hamburger-menu" onClick={() => setMobileNavVisible(!isMobileNavVisible)}>
            <MenuOutlined />
          </div>

        </div>

        <div className={`mobile-nav ${isMobileNavVisible ? 'active' : ''}`}>
          <ul>
            <li>
              <Link to="/" onClick={() => setMobileNavVisible(false)}>Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMobileNavVisible(false)}>About</Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMobileNavVisible(false)}>Contact</Link>
            </li>
          </ul>
        </div>

      </header>


    </>
  );
};

export default Header;