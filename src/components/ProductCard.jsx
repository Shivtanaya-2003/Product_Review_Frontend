import React from "react";

const ProductCard = ({ title, body }) => {
  return (
    <div className="product-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
};

export default ProductCard;
