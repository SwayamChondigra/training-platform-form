const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { Parser } = require("json2csv");
const { Resend } = require("resend");
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
const resend = new Resend(process.env.RESEND_API_KEY);

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

app.post("/api/form", (req, res) => {
  const { name, gender, profession, goal, phone, email } = req.body;

  try {
    saveToCSV({ name, gender, profession, goal, phone, email });

    console.log("Saved:", name);

    // ✅ send response
    res.status(200).json({ message: "Success" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving data" });
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
