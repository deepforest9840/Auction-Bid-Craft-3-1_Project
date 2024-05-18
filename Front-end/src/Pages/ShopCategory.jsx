import React, { useState, useEffect } from 'react';
import './CSS/ShopCategory.css';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import no_img from '../Components/Assets/no_img2.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const [itemIds, setItemIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [props.category]);

  const fetchItems = async () => {
    try {
      const category = getCategoryVariable(props.category);
      const response = await fetch('http://127.0.0.1:8000/category/get_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: category })
      });
      const data = await response.json();
      const ids = data.items.map(item => item.item_id);
      setItemIds(ids);
      fetchProducts(ids);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchProducts = async (ids) => {
    try {
      const promises = ids.map(id =>
        fetch(`http://127.0.0.1:8000/item/get_item?id=${id}`)
          .then(response => response.json())
      );
      const productsData = await Promise.all(promises);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getCategoryVariable = (category) => {
    const categoryMap = {
      'Man': 'Man',
      'Women': 'Women',
      'Child':'Child',
      'Toys': 'Toys',
      'Software': 'Software',
      'Electronics':'Electronics',
      'Cosmetics': 'Cosmetics',
      'Computers': 'Computers',
      'Mobile':'Mobile',
      'Game': 'Game',
      'Sports and Outdoor': 'Sports and Outdoor',
      
    };
    return categoryMap[category] || category;
  };

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
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing </span>  {itemIds.length} Products
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
        <p>{getCategoryVariable(props.category)}</p>
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
      <div className="shopcategory-loadmore">
          Explore more
      </div>
    </div>
  );
};

export default ShopCategory;
