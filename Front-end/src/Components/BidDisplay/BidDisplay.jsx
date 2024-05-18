import React, { useState, useEffect, useContext } from 'react';
import './BidDisplay.css';
import { ShopContext } from '../../Context/ShopContext';
import no_img from '../Assets/no_img2.png';
import { useNavigate } from 'react-router-dom';

const BidDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(product.auction_end_date));
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(product.auction_end_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [product.auction_end_date]);

  useEffect(() => {
    if (product.item_id) {
      fetchBidHistory();
    } else {
      console.error('Product item_id is undefined');
    }
  }, [product.item_id]);

  function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const toggleBidHistory = () => {
    setShowBidHistory(!showBidHistory);
    if (!showBidHistory && product.item_id) {
      fetchBidHistory();
    }
  };

  const fetchBidHistory = () => {
    if (product.item_id) {
      fetch(`http://127.0.0.1:8000/bid/get_bid?id=${product.item_id}`)
        .then(response => response.json())
        .then(data => setBidHistory(data))
        .catch(error => console.error('Error fetching bid history:', error));
    }
  };

  const handleBid = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to place a bid.');
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const bidData = {
      item_id: product.item_id,
      bid_amount: parseFloat(bidAmount),
    };

    try {
      const response = await fetch('http://localhost:8000/bid/new', {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(bidData),
      });
      if (response.ok) {
        alert('Bid placed successfully!');
        setBidAmount('');
        fetchBidHistory();
      } else {
        const data = await response.json();
        alert(data.detail);
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };
  return (
    <div className="biddisplay-container">
      <div className="biddisplay-image">
        <img src={product.pic ? `data:image/jpeg;base64,${product.pic}` : no_img} alt="" />
      </div>
      <div className="biddisplay-details">
        <h3>{product.name}</h3>
        <p><strong>Condition: </strong>{product.condition}</p>
        <p><strong>Stock Type: </strong>Single</p>
        <div className="bidding-details">
          <p><strong>Starting Bid: </strong>${product.starting_price} (<strong>Reserve Price: </strong>${product.current_bid})</p>
          {timeLeft.total <= 0 ? (
            <p>Ended</p>
          ) : (
            <p><strong>Time Left: </strong>{timeLeft.days} days {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds</p>
          )}
          <div className="bid-section">
            <p><strong>Enter your available bid (it's free)</strong></p>
            <input
              className="bsi"
              type="number"
              placeholder="Bid Amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
            <button className="bsb" onClick={handleBid}>Place Bid</button>
          </div>
          <button onClick={toggleBidHistory}>Show Bid History</button>
          {showBidHistory && (
            <div className="bid-history">
              <h4>Bid History:</h4>
              <table>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Bid Amount</th>
                    <th>Bid Time</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {bidHistory.map((bid, index) => (
                    <tr key={index}>
                      <td>{bid.user.name}</td>
                      <td>${bid.bid_amount}</td>
                      <td>{bid.bid_time}</td>
                      <td>{bid.user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidDisplay;
