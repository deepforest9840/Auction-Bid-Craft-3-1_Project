import React, { useState } from 'react';
import axios from 'axios';
import './CSS/CreateAuction.css';
import { useNavigate } from 'react-router-dom';

const CreateAuction = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    condition: '',
    starting_price: '',
    auction_end_date: '',
    pic: '',
    category: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      pic: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Access token not found');
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'category') {
        formDataObj.append(key, JSON.stringify(formData[key].split(',')));
      } else if (key === 'auction_end_date') {
        const formattedDate = new Date(formData[key]).toISOString().replace('T', ' ').replace('Z', '');
        formDataObj.append(key, formattedDate);
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post('http://localhost:8000/item/create', formDataObj, config);
      alert(response.data);
      navigate('/myprofile');
    } catch (error) {
      console.error('Error creating auction item:', error);
    }
  };

  return (
    <div className="create-auction">
      <h2>Create Auction</h2>
      <form onSubmit={handleSubmit} className="auction-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Condition:</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Starting Price:</label>
          <input
            type="number"
            name="starting_price"
            value={formData.starting_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Auction End Date:</label>
          <input
            type="datetime-local"
            name="auction_end_date"
            value={formData.auction_end_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Picture:</label>
          <input
            type="file"
            name="pic"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter categories separated by commas"
            required
          />
        </div>
        <button type="submit">Create Auction</button>
      </form>
    </div>
  );
};

export default CreateAuction;
