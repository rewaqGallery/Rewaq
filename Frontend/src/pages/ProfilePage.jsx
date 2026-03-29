import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../services/userService";
import { getToken } from "../services/api";

import { governorates } from "./../utils/governorates";
import defaultAvatar from "../img/default-avatar.jpg";
import "./style/ProfilePage.css";

function MyProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("Choose Image");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: {
      city: "",
      governorate: "",
      detailedAddress: "",
    },
  });

  const token = getToken();

  if (!token) {
    return (
      <main className="profile-page">
        <h2>You must login to see your profile</h2>
      </main>
    );
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setUser(res.data);

        setForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: {
            city: res.data.address?.city || "",
            detailedAddress: res.data.address?.detailedAddress || "",
            governorate: res.data.address?.governorate || "",
          },
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        address: {
          ...form.address,
          [field]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("address", JSON.stringify(form.address));

    // formData.append("address[city]", form.address.city);
    // formData.append("address[detailedAddress]", form.address.detailedAddress);

    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const res = await updateMyProfile(formData);
      setUser(res.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.log(err);
      alert("Error updating profile");
    }
  };

  if (loading) return <p role="status">Loading...</p>;
  return (
    <main className="profile-page">
      <h1>My Profile</h1>

      <section aria-labelledby="profile-info" className="profile-info">
        <img
          src={user?.profileImage?.url || defaultAvatar}
          alt={user?.name ? `${user.name} profile picture` : "Default profile"}
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-item">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-item">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-item">
              <label htmlFor="governorate">Governorate</label>
              <select
                id="governorate"
                name="address.governorate"
                value={form.address.governorate}
                onChange={handleChange}
              >
                <option value="">Select Governorate</option>
                {Object.entries(governorates).map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-item">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-item full-width">
              <label htmlFor="detailedAddress">Detailed Address</label>
              <input
                id="detailedAddress"
                type="text"
                name="address.detailedAddress"
                value={form.address.detailedAddress}
                onChange={handleChange}
              />
            </div>

            <div className="form-item full-width">
              <label htmlFor="profileImage">Profile Image</label>

              <div
                className="file-upload"
                onClick={() => document.getElementById("profileImage").click()}
              >
                <span>{imageName}</span>
              </div>

              <input
                id="profileImage"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setImageName(file ? file.name : "Choose Image");
                }}
              />
            </div>

            <button type="submit" className="full-width">
              Update Profile
            </button>
          </div>
        </form>
      </section>

      <hr />
      <nav aria-label="Profile navigation">
        <button onClick={() => navigate("/my-orders")}>View My Orders</button>
      </nav>
    </main>
  );
}

export default MyProfile;
