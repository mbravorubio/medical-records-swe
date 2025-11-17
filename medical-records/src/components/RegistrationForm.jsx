// src/components/RegistrationForm.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2️⃣ Generate patient_id
      const patient_id = Date.now();

      // 3️⃣ Add patient to Patients collection
      await addDoc(collection(db, "Patients"), {
        ...formData,
        patient_id,
        user_id: user.uid,
        phone_number: Number(formData.phone_number),
        emergency_contact_phone: String(formData.emergency_contact_phone),
        date_of_birth: formData.date_of_birth ? Timestamp.fromDate(new Date(formData.date_of_birth)) : null,
        created_at: Timestamp.now()
      });

      // 4️⃣ Add user to Users collection for login
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: formData.email,
        role: "patient",
        created_at: Timestamp.now()
      });

      setStatus("✅ Patient registered successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        address: "",
        date_of_birth: "",
        gender: "",
        phone_number: "",
        emergency_contact_name: "",
        emergency_contact_phone: ""
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      setStatus("❌ Error adding patient. Check console.");
    }
  };

  return ( 
    <div className="form-card">
      <h2 className="form-title">Patient Registration</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="last_name">Last name</label>
            <input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="date_of_birth">Date of birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="phone_number">Phone number</label>
            <input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="emergency_contact_phone">
              Emergency contact phone
            </label>
            <input
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="emergency_contact_name">
            Emergency contact name
          </label>
          <input
            id="emergency_contact_name"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            required
          />
        </div>

        <button className="primary-button" type="submit">
          Register patient
        </button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </div>

  );
}

