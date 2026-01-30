import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AddReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [username, setUsername] = useState(user?.username || "");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState("");
  const [quality, setQuality] = useState("");

  useEffect(() => {
    fetch(`https://product-review-backend-ibw8.onrender.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.reviews) data.reviews = [];
        setProduct(data);
      })
      .catch(() => {
        toast.error("Failed to load product");
      });
  }, [id]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const submitReview = () => {
    if (!username || !rating || !comment) {
      toast.error("Please fill all required fields");
      return;
    }

   const newReview = {
  id: Date.now(),
  userId: user.id,
  user: user.username,
  rating,
  comment,
  recommend,
  quality,
  date: new Date().toISOString()
};

    fetch(`https://product-review-backend-ibw8.onrender.com/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviews: [...product.reviews, newReview]
      })
    })
      .then(() => {
        toast.success("Review submitted successfully!");
        setTimeout(() => {
          navigate(`/products/${id}`);
        }, 1500);
      })
      .catch(() => {
        toast.error("Failed to submit review");
      });
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#6ee8ab", minHeight: "100vh" }}>
      <div className="container">
        <div className="card p-4 shadow">

          <h3 className="text-center mb-3">Add Your Review</h3>

          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Rate this product</label>
            <div>
              {[1, 2, 3, 4, 5].map((i) => (
                <i
                  key={i}
                  className={`bi ${
                    i <= rating ? "bi-star-fill text-warning" : "bi-star"
                  } fs-4 me-1`}
                  style={{ cursor: "pointer" }} onClick={() => setRating(i)}></i>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Your Review</label>
            <textarea className="form-control" rows="3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Would you recommend?</label>
            <select className="form-select" value={recommend} onChange={(e) => setRecommend(e.target.value)}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Product Quality</label>
            <select className="form-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
              <option value="">Select</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Average</option>
              <option>Poor</option>
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={() => navigate(`/products/${id}`)}>Cancel</button>

            <button className="btn btn-success" onClick={submitReview}>Submit Review</button>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddReview;
