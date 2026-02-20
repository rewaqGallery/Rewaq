import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../services/userService";
import "./style/ProfilePage.css";
import { getToken } from "../services/api";
function MyProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: {
      city: "",
      detailedAddress: "",
    },
  });

  const token = getToken();

  if (!token) {
    return (
      <div className="profile-page">
        <h2>You must login to see your profile</h2>
      </div>
    );
  }

  // fetch user data
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <img
        src={user?.profileImage?.url || "/default-avatar.png"}
        alt="profile"
        style={{ width: "150px", borderRadius: "50%" }}
      />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address.city"
          placeholder="City"
          value={form.address.city}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address.detailedAddress"
          placeholder="Detailed-Address"
          value={form.address.detailedAddress}
          onChange={handleChange}
        />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit">Update Profile</button>
      </form>

      <hr />

      <button onClick={() => navigate("/my-orders")}>My Orders</button>
    </div>
  );
}

export default MyProfile;
