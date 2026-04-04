const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs"); // 👈 IMPORTANT

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*"
}));

const API_KEY = "g2FN7oJ5M4hVxljAnaR0Q9kcTqYPzCGWu81tOfE3Hew6BIiKbvktERUvQ8qzlY1fgGmSebKohxuXN0wV";

/* SEND SMS */
app.post("/send-absent-sms", async (req, res) => {

    const { students, className, date, schoolName } = req.body;

    try {

        for (const s of students) {

            if (!s.phone) continue;

            // ✅ CLEAN NUMBER (IMPORTANT)
            const phone = String(s.phone).replace(/\D/g, "").slice(-10);

            const message = `Dear Parent, your ward ${s.name} (Class ${className}) was ABSENT on ${date}. - ${schoolName}`;

            const data = qs.stringify({
                route: "q",
                message: message,
                language: "english",
                flash: 0,
                numbers: phone
            });

           const response = await axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    data,
    {
        headers: {
            authorization: API_KEY,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
);

console.log("FAST2SMS RESPONSE:", response.data);
        }

        res.json({ success: true });

    } catch (err) {
        console.error("ERROR:", err.response?.data || err.message);
        res.status(500).json({ error: "SMS failed" });
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));app.get("/", (req, res) => {
    res.send("Backend running 🚀");
});
