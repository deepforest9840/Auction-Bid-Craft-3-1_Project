import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Item from '../Item/Item';
import './Demo.css';
import dropdown_icon from '../Assets/dropdown_icon.png';
import no_img from '../Assets/no_img2.png';

const Demo = () => {
  const { searchQuery } = useParams(); // Assuming you are passing the search query as a parameter
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  useEffect(() => {
    // Fetch items based on search query
    fetch(`http://127.0.0.1:8000/item/search_items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: searchQuery }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error('Error fetching items:', error));
  }, [searchQuery]);

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setDropdownVisible(false);
    // Implement sorting logic based on the selected option
    // You can update the products state with sorted products
    switch (option) {
      case 'A to Z':
        setProducts([...products].sort((a, b) => a.name.localeCompare(b.name)));
        break;
      case 'Z to A':
        setProducts([...products].sort((a, b) => b.name.localeCompare(a.name)));
        break;
      case 'Price: Low to High':
        setProducts([...products].sort((a, b) => a.starting_price - b.starting_price));
        break;
      case 'Price: High to Low':
        setProducts([...products].sort((a, b) => b.starting_price - a.starting_price));
        break;
      default:
        break;
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className='shop-category'>
     
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of {products.length} Products  
        </p>
        
        <div className="shopcategory-sort">
          <span className="sort-label" onClick={toggleDropdown}>
            Sort by: {sortOption || 'Select'}
            <img src={dropdown_icon} alt="" />
          </span>
          {dropdownVisible && (
            <div className="dropdown-content">
              <button onClick={() => handleSortOptionChange('A to Z')}>A to Z</button>
              <button onClick={() => handleSortOptionChange('Z to A')}>Z to A</button>
              <button onClick={() => handleSortOptionChange('Price: Low to High')}>Price: Low to High</button>
              <button onClick={() => handleSortOptionChange('Price: High to Low')}>Price: High to Low</button>
            </div>
          )}
        </div>
        <p>{searchQuery}</p>
      </div>
      <div className="shopcategory-products">
        {products.map((product, index) => (
          <div key={index} className="product-name">
            <Item
              name={product.name}
              item_id={product.item_id}
              pic={product.pic ? `data:image/jpeg;base64,${product.pic}` : no_img}
              starting_price={product.starting_price}
              current_bid={product.current_bid}
              auction_end_date={product.auction_end_date}
              description={product.description}
            />
          </div>
        ))}
      </div>
      {/* <div className="shopcategory-loadmore">
        Explore more
      </div> */}
    </div>
  );
};

export default Demo;
