const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { google } = require("googleapis");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   📁 CSV SAVE FUNCTION
========================= */
const saveToCSV = (data) => {
  const filePath = "leads.csv";

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
   📊 GOOGLE SHEETS SETUP
========================= */
let sheets;

try {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheets = google.sheets({ version: "v4", auth });

  console.log("✅ Google Sheets connected");

} catch (err) {
  console.error("❌ Google Sheets ERROR:", err);
}

const SPREADSHEET_ID = "1KjCIqLeneyxf_xhmX7-zeKhYj4YFl37UCVvH1inALT0";

/* =========================
   🚀 MAIN API
========================= */
app.post("/api/form", async (req, res) => {
  const { name, gender, profession, goal, phone, email } = req.body;

  try {
    // 💾 Save to CSV
    saveToCSV({ name, gender, profession, goal, phone, email });

    // 📊 Save to Google Sheets
    if (sheets) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[name, email, phone, profession, gender, goal]],
        },
      });
    }

    console.log("✅ Saved:", name);

    res.status(200).json({ message: "Success" });

  } catch (error) {
    console.error("❌ ERROR:", error);
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
  console.log("🚀 Server running on port", PORT);
});