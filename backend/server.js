import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// DB接続
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "iwto_app"
});

db.connect(err => {
  if (err) {
    console.error("DB接続エラー:", err);
    return;
  }
  console.log("DB接続成功");
});

// 🔥 プレイヤー取得
app.get("/players", (req, res) => {
  db.query("SELECT id, player_name, player_belonging FROM players", (err, results) => {
    if (err) {
      return res.json({ status: "error", message: err.message });
    }
    res.json({ status: "success", data: results });
  });
});

// 🔥 フィードバック保存
app.post("/feedback", (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO feedbacks
    (from_player_id, to_player_id, forehand, backhand, serve, volley,
     shot_variety, consistency, shot_power, shot_depth,
     playstyle, strengths, weaknesses, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())
  `;

  const values = [
    data.fromPlayerId,
    data.toPlayerId,
    data.shotsValues.forehand,
    data.shotsValues.backhand,
    data.shotsValues.serve,
    data.shotsValues.volley,
    data.skillsValues.shotVariety,
    data.skillsValues.consistency,
    data.skillsValues.shotPower,
    data.skillsValues.shotDepth,
    data.playstyle,
    data.strengths,
    data.weaknesses
  ];

  db.query(sql, values, (err) => {
    if (err) {
      return res.json({ status: "error", message: err.message });
    }
    res.json({ status: "success" });
  });
});

// 🔥 フィードバック取得
app.get("/feedback", (req, res) => {
  const player_id = req.query.player_id;

  const sql = `
    SELECT 
      f.*,
      p1.player_name AS to_player_name,
      p1.player_belonging AS to_player_belonging,
      p2.player_name AS from_player_name,
      p2.player_belonging AS from_player_belonging
    FROM feedbacks f
    JOIN players p1 ON f.to_player_id = p1.id
    JOIN players p2 ON f.from_player_id = p2.id
    WHERE f.to_player_id = ?
  `;

  db.query(sql, [player_id], (err, results) => {
    if (err) {
      return res.json({ status: "error", message: err.message });
    }

    res.json({
      status: "success",
      data: results
    });
  });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});