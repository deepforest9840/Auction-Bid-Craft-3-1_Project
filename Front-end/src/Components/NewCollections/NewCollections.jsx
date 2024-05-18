import React, { useState, useEffect } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import a_logo from '../Assets/1.jpg'
import cart_icon from '../Assets/cart_icon.png';
import no_img from '../Assets/no_img2.png';
const NewCollections = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/item/get_items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div className='newcollection'>
      <h1>NEW Collections</h1>
      <hr />
      <div className="newcollection-item">
        {items
          .filter(item => item.item_id % 2 !== 0) // Filter even item_id
          .map((item) => (
            <div key={item.item_id} className="item-container">
              <Item
                name={item.name}
                item_id={item.item_id}
                pic={item.pic ? `data:image/jpeg;base64,${item.pic}` : no_img}
                starting_price={item.starting_price}
                current_bid={item.current_bid}
                auction_end_date={item.auction_end_date}
                description={item.description}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default NewCollections;
