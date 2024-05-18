import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BidDisplay from '../Components/BidDisplay/BidDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import cart_icon from '../Components/Assets/cart_icon.png';
import no_img from '../Components/Assets/no_img2.png'; // Import placeholder image

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [qna, setQna] = useState([]);

  useEffect(() => {
    // Fetch product details
    fetch(`http://127.0.0.1:8000/item/get_item?id=${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));

    // Fetch Q&A sections
    fetch(`http://127.0.0.1:8000/item/QA?item_id=${productId}`)
      .then(response => response.json())
      .then(data => setQna(data))
      .catch(error => console.error('Error fetching Q&A:', error));
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      
      <BidDisplay product={product} />
      <DescriptionBox product={product} qna={qna} /> {/* Pass Q&A data to DescriptionBox */}
      <RelatedProducts />
    </div>
  );
};

export default Product;
