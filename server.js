import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://smartattendx.com"
}));

app.post("/send-absent-sms", async (req, res) => {

  const { students, className, date, schoolName } = req.body;

  try {

    for (const s of students) {

      const message = `Dear Parent,

Your ward ${s.name} (Class ${className}) was ABSENT on ${date}.

- ${schoolName}`;

      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: "g2FN7oJ5M4hVxljAnaR0Q9kcTqYPzCGWu81tOfE3Hew6BIiKbvktERUvQ8qzlY1fgGmSebKohxuXN0wV",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route: "v3",
          sender_id: "TXTIND",
          message: message,
          language: "english",
          numbers: s.phone
        })
      });

    }

    res.send({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "SMS failed" });
  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});