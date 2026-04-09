/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./App.css";
import eagle from "./assets/eagle.png";

function App() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    profession: "",
    goal: "",
    phone: "",
    email: "",
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://training-platform-form.onrender.com/api/form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      if (res.status === 200) {

        setTimeout(() => {
          window.location.href =
            "https://chat.whatsapp.com/GfFOtRNuPwoH54i5ESMBZI";
        }, 1500);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  if (submitted) {
  return (
    <div className="success-page">
      <div className="success-card">
        <img src={eagle} alt="eagle" className="success-logo" />
        <h2>You're In!</h2>
        <p>Redirecting you to WhatsApp...</p>
      </div>
    </div>
  );
}
  
  return (
    <div className="page">
      <div className="card">
        <div className="brand">
          <img src={eagle} alt="eagle" />
          <h2>FOREVER LIVING</h2>
        </div>

        <h1>Join Our Community</h1>
        <p className="subtitle">
          Fill in your details and get access instantly
        </p>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          {/* Gender */}
          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            name="profession"
            placeholder="Profession"
            onChange={handleChange}
          />

          <input
            name="goal"
            placeholder="Main Goal for Joining"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Mobile Number"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <button type="submit">Get Access</button>
        </form>
      </div>
    </div>
  );
}

export default App;
