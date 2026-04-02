const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://smartattendx.com"
}));

const API_KEY = "g2FN7oJ5M4hVxljAnaR0Q9kcTqYPzCGWu81tOfE3Hew6BIiKbvktERUvQ8qzlY1fgGmSebKohxuXN0wV";

/* SEND SMS */
app.post("/send-absent-sms", async (req, res) => {

    const { students, className, date, schoolName } = req.body;

    try {

        for(const s of students){

            if(!s.phone) continue;

            const message = `Dear Parent,

This is to inform you that your ward ${s.name} (Class ${className}) was marked ABSENT on ${date}.

Kindly ensure regular attendance.

– ${schoolName}`;

            await axios.post("https://www.fast2sms.com/dev/bulkV2", {
                route: "v3",
                sender_id: "TXTIND",
                message: message,
                language: "english",
                numbers: s.phone
            },{
                headers: {
                    authorization: API_KEY
                }
            });

        }

        res.json({ success: true });

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "SMS failed" });
    }

});

/* PORT FIX FOR RENDER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});