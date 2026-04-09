const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { Parser } = require("json2csv");
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

require("dotenv").config();
/* =========================
   📩 EMAIL CONFIG (GMAIL)
========================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

/* =========================
   📁 CSV SAVE FUNCTION
========================= */

const saveToCSV = (data) => {
  const filePath = "leads.csv";

  // Ensure all fields exist (no undefined)
  const row = {
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    profession: data.profession || "",
    gender: data.gender || "",
    goal: data.goal || "",
  };

  const values = [
    row.name,
    row.email,
    row.phone,
    row.profession,
    row.gender,
    row.goal,
  ];

  const csvLine = `"${values.join('","')}"\n`;

  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, csvLine);
  } else {
    const header = "name,email,phone,profession,gender,goal\n";
    fs.writeFileSync(filePath, header + csvLine);
  }
};

/* =========================
   🚀 MAIN API
========================= */

app.post("/api/form", async (req, res) => {
  const { name, gender, profession, goal, phone, email } = req.body;

  const whatsappLink = "https://chat.whatsapp.com/GfFOtRNuPwoH54i5ESMBZI";

  try {
    // 💾 Save to CSV
    saveToCSV({ name, gender, profession, goal, phone, email });

    console.log("STEP 1: Before transporter.verify");

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ VERIFY ERROR:", error);
  } else {
    console.log("✅ SERVER READY");
  }
});

console.log("STEP 2: Before sendMail");

await transporter.sendMail({
  from: process.env.EMAIL,
  to: email,
  subject: "Join Our WhatsApp Community",
  html: `<h1>Test Mail</h1>`,
});

console.log("STEP 3: After sendMail");

    console.log("Email sent");
        res.status(200).json({ message: "Success" });

  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ message: "Error processing form" });


  }
});

/* =========================
   🌐 TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("API Running ✅");
});

/* =========================
   ▶️ START SERVER
========================= */

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
