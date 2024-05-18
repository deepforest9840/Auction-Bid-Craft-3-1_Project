import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import my_profile from '../Assets/my_profile.jpg'
import drop_icon from '../Assets/three_dott.png';
import { ShopContext } from '../../Context/ShopContext';
import axios from "axios";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menu, setMenu] = useState('shop');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false); // State to manage navigation visibility

  // Function to toggle the navigation bar
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  // Function to close the navigation bar when a category link is clicked
  const handleCategoryClick = () => {
    setNavOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value); // Update the searchValue state as the user types
  };

  const handleMyProfile = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
    alert('Please log in to go to your profile.');
    navigate('/login');
    } 
    else {
    navigate('/myprofile');
  }
};

  const handleCreateAuction = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
      alert('Please log in to create an auction.');
      navigate('/login');
      } 
      else {
      navigate('/createauction');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Access token not found');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Call the backend logout endpoint to invalidate the token
      const response = await axios.post('http://localhost:8000/logout', {}, config);
      
      // Handle response and token invalidation logic
      console.log('Logout successful:', response.data);
  
      setIsLoggedIn(false); // Update the isLoggedIn state to false
      localStorage.removeItem('accessToken'); // Remove the access token from localStorage
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="navbar">
      <img className="three_dot" src={drop_icon} alt="" onClick={toggleNav} />
      {/* Render the navigation bar conditionally with dynamic class */}
      <div className={`sidenav ${navOpen ? 'open' : ''}`}>
        <Link style={{ textDecoration: 'none' }} to='/Man'>
          <p onClick={handleCategoryClick}>Man</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Women'>
          <p onClick={handleCategoryClick}>Women</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Child'>
          <p onClick={handleCategoryClick}>Child</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Toys'>
          <p onClick={handleCategoryClick}>Toys</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Software'>
          <p onClick={handleCategoryClick}>Software</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Electronics'>
          <p onClick={handleCategoryClick}>Electronics</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Cosmetics'>
          <p onClick={handleCategoryClick}>Cosmetics</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Computers'>
          <p onClick={handleCategoryClick}>Computers</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Mobile'>
          <p onClick={handleCategoryClick}>Mobile</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Game'>
          <p onClick={handleCategoryClick}>Game</p>
        </Link>
        <Link style={{ textDecoration: 'none' }} to='/Sports and Outdoor'>
          <p onClick={handleCategoryClick}>Sports and Outdoor</p>
        </Link>
      </div>

        <Link style={{ textDecoration: 'none' }} to="/" onClick={() => setSearchValue('')}>
            <div className="nav-logo">
               <img src={logo} alt="" />
               <p>BidCraft</p>
            </div>
        </Link>


      <div className="nav-search">
        <input
          type="text"
          placeholder="Search an item..."
          value={searchValue}
          onChange={handleInputChange} // Call handleInputChange when the input value changes
        />
        {/* Use Link to navigate to the product page with the search query included */}
        <Link to={`/demo/${searchValue}`}>
          <button>Search</button>
        </Link>
      </div>

      {/* <ul className="nav-menu">
        <li onClick={() => setMenu('shop')}>
          <Link style={{ textDecoration: 'none' }} to="/">
            Shop
          </Link>
          {menu === 'shop' ? <hr /> : <></>}
        </li>
      </ul> */}

      <div className="nav-login-cart">
        <div className="nav-create-bid">
            <button onClick={handleCreateAuction}>Create Auction</button>
        </div>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login / Signup</button>
          </Link>
        )}
        <img onClick={handleMyProfile} src={my_profile} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
