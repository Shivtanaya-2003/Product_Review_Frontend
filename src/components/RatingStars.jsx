import React from "react";

const RatingStars = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i}>{i < rating ? "★" : "☆"}</span>
  ));

  return <div className="rating-stars">{stars}</div>;
};

export default RatingStars;
