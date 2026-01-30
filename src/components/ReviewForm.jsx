
import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AddReview = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      productId: parseInt(id),
      userId: user.id,
      rating,
      comment,
    };

    fetch("http://localhost:5000/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    })
      .then((res) => res.json())
      .then((review) => {
        fetch(`http://localhost:5000/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviews: [...(review.product?.reviews || []), review.id] }),
        }).then(() => navigate(`/products/${id}`));
      });
  };

  return (
    <div className="add-review">
      <h2>Add Your Review</h2>
      <form onSubmit={handleSubmit}>
        <label>Rating (1-5):</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min={1}
          max={5}
          required/>
        <label>Comment:</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required/>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;
