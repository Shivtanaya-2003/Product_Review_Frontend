import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, login } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const API = "https://product-review-backend-ibw8.onrender.com";

  useEffect(() => {
    if (!user || !user.id) return;

    fetch(`${API}/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
        });
        toast.success("Profile loaded successfully", { toastId: "profile-loaded" }); 
      })
      .catch(() => toast.error("Failed to load profile"));

fetch(`${API}/products`)
    .then(res => res.json())
    .then(products => {
      const userReviews = products.flatMap(product =>
        (product.reviews || [])
          .filter(review => review.userId.toString() === user.id.toString())
          .map(review => ({
            ...review,
            productId: product.id,
            productName: product.name,
            date: review.date || "Not available"
          }))
      );

      console.log("User reviews found:", userReviews); // debug
      setReviews(userReviews);
    })
    .catch(err => {
      console.error(err);
      toast.error("Failed to load reviews");
    });
}, [user]);

  const handleProfileUpdate = () => {
    fetch(`${API}/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        login(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Information saved successfully");
        setIsEditingProfile(false);
      })
      .catch(() => toast.error("Profile update failed"));
  };

  if (!user) return <p>Loading...</p>;

const startEditingProfile = () => {
  setIsEditingProfile(true);
  toast.info("Edit profile mode enabled", { toastId: "edit-mode" });
};

const cancelEditProfile = () => {
  setIsEditingProfile(false);
  toast.warning("Profile editing cancelled", { toastId: "edit-cancel" });
};

  return (
    <div style={{ background: "#6ee8ab", minHeight: "100vh", padding: 20 }}>

      <div className="container">

        <div className="card p-4 mb-4 text-center">
          <img src={defaultAvatar} alt="profile"  style={{ width: 120, borderRadius: "50%" }} />

          {isEditingProfile ? (
            <>

              <input className="form-control my-2"  value={profileData.firstName} onChange={(e) =>  setProfileData({ ...profileData, firstName: e.target.value })  } />

              <input className="form-control my-2" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value }) }/>

              <input className="form-control my-2" value={profileData.username}  onChange={(e) => setProfileData({ ...profileData, username: e.target.value }) }/>

              <input className="form-control my-2" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value }) }/>

              <div className="d-flex justify-content-center gap-3 mt-3">
        
              <button className="btn btn-success btn-sm" style={{ height: "50px", width: "120px" }} onClick={handleProfileUpdate}>Save</button>

              <button className="btn btn-secondary btn-sm" style={{ height: "50px", width: "120px" }} onClick={cancelEditProfile}> Cancel</button>

             </div>
            </>
          ) : (
            <>
              <h4 className="mt-3">  {profileData.firstName} {profileData.lastName} </h4>
              <p><b>Username:</b> {profileData.username}</p>
              <p><b>Email:</b> {profileData.email}</p>

              <button className="btn btn-primary btn-sm" onClick={startEditingProfile} style={{ height:"50px", width:"120px", display:"block", margin:"20px auto" }}>  Edit Profile</button>
            </>
          )}
        </div>

        <div className="card p-4 mb-4">
          <h4>Products You Reviewed</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            <ul className="list-group">
              {reviews.map((r) => (
                <li key={r.id} className="list-group-item">
                  <b>{r.productName}</b>
                  <br />
                  <small className="text-muted"> Reviewed on: {r.date}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-4">
          <h4>Your Reviews</h4>
          {reviews.map((r) => (
            <div key={r.id} className="border p-3 mb-3">
              <p><b>Product:</b> {r.productName}</p>
              <p><b>Rating:</b> ⭐ {r.rating}</p>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;
