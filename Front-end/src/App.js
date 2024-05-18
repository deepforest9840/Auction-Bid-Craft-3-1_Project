import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import CreateBid from './Pages/CreateBid';
import Demo from './Components/SearchCategory/Demo'; // Importing the Demo component
import Signup from './Pages/Signup';
import MyProfile from './Pages/MyProfile';
import ForgetPassword from './Pages/ForgetPassword';
import ChangePassword from './Pages/ChangePassword';
import CreateAuction from './Pages/CreateAuction';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize isLoggedIn state

  useEffect(() => {
    // Check for token in local storage on app load
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        {/* Pass setIsLoggedIn as prop to Navbar */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/Man' element={<ShopCategory banner={men_banner} category="Man"/>}/>
          <Route path='/Women' element={<ShopCategory banner={women_banner} category="Women"/>}/>
          <Route path='/Child' element={<ShopCategory banner={kid_banner} category="Child"/>}/>

          <Route path='/Toys' element={<ShopCategory banner={men_banner} category="Toys"/>}/>
          <Route path='/Software' element={<ShopCategory banner={women_banner} category="Software"/>}/>
          <Route path='/Electronics' element={<ShopCategory banner={kid_banner} category="Electronics"/>}/>
          <Route path='/Cosmetics' element={<ShopCategory banner={men_banner} category="Cosmetics"/>}/>
          <Route path='/Computers' element={<ShopCategory banner={women_banner} category="Computers"/>}/>
          <Route path='/Mobile' element={<ShopCategory banner={kid_banner} category="Mobile"/>}/>
          <Route path='/Game' element={<ShopCategory banner={men_banner} category="Game"/>}/>
          <Route path='/Sports and Outdoor' element={<ShopCategory banner={women_banner} category="Sports and Outdoor"/>}/>
          

          <Route path='/product' element={<Product/>}>
            <Route path=':productId' element={<Product/>} />
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          {/* Pass setIsLoggedIn as prop to Login */}
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/createbid' element={<CreateBid/>}/>
          <Route path='/myprofile' element={<MyProfile/>}/>
          <Route path='/forgetpassword' element={<ForgetPassword/>}/>
          <Route path='/changepassword' element={<ChangePassword/>}/>
          <Route path='/createauction' element={<CreateAuction/>}/>
          {/* Updated route for Demo component with parameter placeholder */}
          <Route path="/demo/:searchQuery" element={<Demo />} />

        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;