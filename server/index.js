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
  service: "gmail",
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

    console.log("Saved:", name);

    // 📩 Send Email
    await transporter.sendMail({
      from: "your_email@gmail.com",
      to: email,
      subject: "Join Our WhatsApp Community",
      html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111; padding:30px 10px;">
  <tr>
    <td align="center">

      <table width="100%" style="max-width:480px; background:#1c1c1c; border-radius:12px; padding:30px; font-family:Arial; color:white; text-align:center;">

        <!-- Logo / Brand -->
        <tr>
          <td>
            <h2 style="color:gold; margin:0; letter-spacing:1px;">
              FOREVER LIVING
            </h2>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding-top:20px;">
            <h3 style="margin:0;">Hey ${name} 👋</h3>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding-top:10px; color:#ccc; line-height:1.6;">
            Thanks for joining our community.<br/>
            Click below to join our WhatsApp community.
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td style="padding:25px 0;">
            <a href="${whatsappLink}" 
               style="background:#25D366; padding:14px 30px; color:white; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
               Join Now
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="font-size:12px; color:#777;">
            If you didn’t request this, you can ignore this email.
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
`,
    });

    console.log("Email sent");
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
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
