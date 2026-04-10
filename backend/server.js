import express from "express";
import cors from "cors";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/players", async (req, res) => {
  const { data, error } = await supabase
    .from("players")
    .select("*");

  if (error) {
    console.error("players error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }

  res.json({
    status: "success",
    data
  });
});

app.post("/feedback", async (req, res) => {
  try {
    const data = req.body;

    const { error } = await supabase
      .from("feedbacks")
      .insert([{
        from_player_id: data.fromPlayerId,
        to_player_id: data.toPlayerId,
        forehand: data.shotsValues.forehand,
        backhand: data.shotsValues.backhand,
        serve: data.shotsValues.serve,
        volley: data.shotsValues.volley,
        shot_variety: data.skillsValues.shotVariety,
        consistency: data.skillsValues.consistency,
        shot_power: data.skillsValues.shotPower,
        shot_depth: data.skillsValues.shotDepth,
        playstyle: data.playstyle,
        strengths: data.strengths,
        weaknesses: data.weaknesses
      }]);

    if (error) {
      console.error("feedback insert error:", error);
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }

    res.json({ status: "success" });
  } catch (err) {
    console.error("POST /feedback error:", err);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

app.get("/feedback", async (req, res) => {
  try {
    const player_id = req.query.player_id;

    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("to_player_id", player_id);

    if (error) {
      console.error("feedback get error:", error);
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }

    res.json({ status: "success", data });
  } catch (err) {
    console.error("GET /feedback error:", err);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

process.on("exit", (code) => {
  console.log("exit code:", code);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});