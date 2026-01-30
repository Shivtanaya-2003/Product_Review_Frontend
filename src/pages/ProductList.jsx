
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const renderStars = (rating) => {
    return "⭐".repeat(Math.round(rating));
  };

  const ratingMessage = (rating) => {
    if (rating >= 5) return "🌟 Best Product";
    if (rating >= 4) return "👍 Very Good";
    if (rating >= 3) return "🙂 Good";
    if (rating >= 2) return "⚠️ Average";
    if (rating >= 1) return "❌ Worst Product";
    return "No ratings";
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#6ee8ab", minHeight: "100vh" }}>
      <div className="container">
        <div className="row">
          {products.map(p => {
            const avgRating = p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;

            return (
              <div className="col-md-4 mb-4" key={p.id}>
                <div className="card h-100 product-card" onClick={() => navigate(`/products/${p.id}`)} style={{ cursor: "pointer" }}>

                  <img src={p.image} className="card-img-top" height="200" alt={p.name}/>

                  <div className="card-body text-center">
                    <h5>{p.name}</h5>
                    <p className="mb-1">₹{p.price}</p>

                    <p className="mb-1 fw-bold"> {ratingMessage(avgRating)}</p>

                    <p className="text-muted mb-1"> {p.reviews.length} {p.reviews.length === 1 ? "Review" : "Reviews"}</p>


                    <p className="mb-0">{avgRating ? renderStars(avgRating) : ""}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
