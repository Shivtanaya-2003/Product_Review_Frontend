import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [sortType, setSortType] = useState("latest");

  useEffect(() => {
    fetch(`https://product-review-backend-ibw8.onrender.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (!data.reviews) data.reviews = [];
        setProduct(data);
      })
      .catch((err) => {
        console.error(err);
        navigate("/products");
      });
  }, [id, navigate]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const reviews = product.reviews || [];

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortType === "highest") return b.rating - a.rating;
    return b.id - a.id;  });

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  const submitReview = () => {

    if (!user) {
  toast.info("Please login to add a review");
  return;
}

    if (!rating || !reviewText) 
    {
      toast.warning("Please add rating and review");
      return;
    }

    const newReview = {
      id: Date.now(),
      user: user ? user.username : "Anonymous",
      rating,
      comment: reviewText,};

    fetch(`https://product-review-backend-ibw8.onrender.com/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviews: [...reviews, newReview],
      }),
    }).then(() => {
      setProduct({ ...product, reviews: [...reviews, newReview] });
      setShowReviewForm(false);
      setRating(0);
      setReviewText("");
      toast.success("Review submitted successfully ⭐");
       })
    .catch(() => {
      toast.error("Failed to submit review");
    });
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#6ee8ab", minHeight: "100vh" }}>
      <div className="container">

<div className="d-flex justify-content-end mb-3 gap-2">
  <button className="btn btn-dark btn-sm" onClick={() => navigate("/products")}> Products</button>

  <button className="btn btn-success btn-sm" onClick={() => navigate(`/add-review/${id}`)}>Add Your Review</button>
</div>

        <div className="card p-4 shadow">

          <div className="text-center">
            <img src={product.image} alt={product.name} className="img-fluid mb-3" style={{ maxWidth: "300px" }}/>
          </div>

          <h2 className="text-center">{product.name}</h2>
          {product.description && (<p className="text-center text-muted">{product.description}</p>)}

          <div className="text-center mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <i
                key={i}
                className={`bi ${
                  i <= Math.round(avgRating) ? "bi-star-fill text-warning" : "bi-star"
                }`}
              ></i>))}
              
            <span className="ms-2">
              ({avgRating}) –{" "}
              {avgRating >= 4.5
                ? "Best Product"
                : avgRating >= 3
                ? "Good Product"
                : avgRating > 0
                ? "Worst Product"
                : "No ratings"}
            </span>
          </div>

          <p className="text-center fw-bold">{reviews.length} people reviewed this</p>

          {user && showReviewForm && (
            <div className="mt-4">
              <h5>Add Your Review</h5>
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i
                    key={i}
                    className={`bi ${i <= rating ? "bi-star-fill text-warning" : "bi-star"} fs-4 me-1`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setRating(i)}
                  ></i>
                ))}
              </div>

              <textarea className="form-control mb-2" placeholder="Write your review..." value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>

              <button className="btn btn-success" onClick={submitReview}>Submit Review</button>

            </div>
          )}
        </div>

        <div className="card mt-4 p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Reviews</h4>
            <select className="form-select w-auto" value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="highest">Highest Rating</option>
            </select>
          </div>

          {sortedReviews.length === 0 && <p>No reviews yet</p>}

          {sortedReviews.map((r) => (
            <div key={r.id} className="border rounded p-2 mb-2">
              <strong>{r.user}</strong>
              <div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className={`bi ${i <= r.rating ? "bi-star-fill text-warning" : "bi-star"}`} ></i>
                ))}
              </div>
              <p className="mb-0">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
