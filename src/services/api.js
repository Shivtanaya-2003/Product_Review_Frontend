const BASE_URL = "http://localhost:5000";

export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
};

export const fetchProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};

export const addReview = async (productId, review) => {
  const product = await fetchProduct(productId);
  const updatedReviews = [...(product.reviews || []), review];
  await fetch(`${BASE_URL}/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviews: updatedReviews }),
  });
  return updatedReviews;
};

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${BASE_URL}/users?username=${username}&password=${password}`);
  const users = await res.json();
  return users[0] || null;
};
