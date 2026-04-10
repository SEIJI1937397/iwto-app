import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import "./create.css"

function Create(){
    const [playerId, setPlayerId] = useState("");
    const [forehand,setForehand] = useState(3);
    const [backhand,setBackhand] = useState(3);
    const [serve,setServe] = useState(3);
    const [volley,setVolley] = useState(3);
    const [shotVariety,setShotVariety] = useState(3);
    const [consistency,setConsistency] = useState(3);
    const [shotPower,setShotPower] = useState(3);
    const [shotDepth,setShotDepth] = useState(3);
    const[playStyle,setPlayStyle] = useState("");
    const[textInput1,setTextInput1] = useState("");
    const[textInput2,setTextInput2] = useState("");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [players, setPlayer] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [searchParams] = useSearchParams();
    const fromPlayerId = searchParams.get("player_id");

const sendData = async () => {
        // ❌ 未選択チェック
        if (!playerId) {
            setModalMessage("対戦相手を選択してください");
            setIsModalOpen(true);
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fromPlayerId: Number(fromPlayerId),
                    toPlayerId: playerId,
                    shotsValues: {
                        forehand,
                        backhand,
                        serve,
                        volley
                    },
                    skillsValues: {
                        shotVariety,
                        consistency,
                        shotPower,
                        shotDepth
                    },
                    playstyle: playStyle,
                    strengths: textInput1,
                    weaknesses: textInput2
                })
            });

            const data = await res.json();
            console.log(data);

            if (data.status === "success") {
                setModalMessage("送信が完了しました！");
            } else {
                setModalMessage("エラー: " + data.message);
            }

            setIsModalOpen(true);

        } catch (error) {
            console.error(error);
            setModalMessage("通信エラーが発生しました");
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
  const fetchPlayers = async () => {
    const res = await fetch("http://localhost:3000/players");
    const result = await res.json();

    if (result.status === "success") {
      setPlayer(result.data);
    }
  };

  fetchPlayers();
}, []);

    const filteredPlayers = players.filter(player =>
        player.player_name.includes(search) ||
        player.player_belonging.includes(search)
    );

    const getData = async () => {
  const res = await fetch("http://localhost:3000/feedback");
  const data = await res.json();

  console.log(data);
};
    return(
    <>
    <div>
  </div>
        <h2 className="title">スキルフィードバック</h2>

            {isModalOpen && (
            <div className="modal">
                <div className="modal-content">
                    <p>{modalMessage}</p>
                    <button onClick={() => setIsModalOpen(false)}>
                        閉じる
                    </button>
                </div>
            </div>
        )}

        <div className="form-group">
            <label htmlFor="to_player_id">対戦相手を選択</label>
    <div className="form-group">

    {/* 検索欄 */}
    <input
        type="text"
        placeholder="名前 or チームで検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
    />

    {/* セレクト */}
    <select
  value={playerId}
  onChange={(e) => {
    const value = e.target.value;
    setPlayerId(value ? Number(value) : "");
  }}
>
        <option value="">選手を選択してください</option>

        {filteredPlayers.map(player => (
            <option key={player.id} value={player.id}>
                {player.player_name} ({player.player_belonging})
            </option>
        ))}
    </select>
    </div>
        </div>


        <div className="wrap" id="radar">
            <h3>各ショット</h3>
            <div className="input-area" >
            <div className="item"><label>フォア</label><input type="range" id="forehand" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setForehand(Number(e.target.value))}/></div>
            <div className="item"><label>バック</label><input type="range" id="backhand" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setBackhand(Number(e.target.value))}/></div>
            <div className="item"><label>サーブ</label><input type="range" id="serve" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setServe(Number(e.target.value))}/></div>
            <div className="item"><label>ボレー</label><input type="range" id="volley" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setVolley(Number(e.target.value))}/></div>
        </div>

        <h3>各技術</h3>
            <div className="input-area" >
            <div className="item"><label>球種の多さ</label><input type="range" id="shotVariety" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setShotVariety(Number(e.target.value))}/></div>
            <div className="item"><label>安定感</label><input type="range" id="consistency" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setConsistency(Number(e.target.value))}/></div>
            <div className="item"><label>威力</label><input type="range" id="shotPower" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setShotPower(Number(e.target.value))}/></div>
            <div className="item"><label>返球の深さ</label><input type="range" id="shotDepth" min="1" max="5" step="1" defaultValue="3" onChange={(e)=>setShotDepth(Number(e.target.value))}/></div>
        </div>

        <h3>プレイスタイルを選んでください</h3>
            
            <div className="input-area" id="playStyle">
                <label><input type="radio" name="playstyle" value="アグレッシブベースライナー" onChange={(e)=>setPlayStyle(e.target.value)}/> アグレッシブベースライナー</label>
                <label><input type="radio" name="playstyle" value="カウンターパンチャー" onChange={(e)=>setPlayStyle(e.target.value)}/> カウンターパンチャー</label>
                <label><input type="radio" name="playstyle" value="ネットプレイヤー" onChange={(e)=>setPlayStyle(e.target.value)}/> ネットプレイヤー</label>
                <label><input type="radio" name="playstyle" value="オールラウンダー" onChange={(e)=>setPlayStyle(e.target.value)}/> オールラウンダー</label>
            </div>

            <div className="input-area">
            <h3>相手の強みを書いてください</h3>
            <input type="text" id="textInput1" name="strengths" placeholder="強みを入力" size="30" onChange={(e)=>setTextInput1(e.target.value)}/>
            <h3>相手の弱みを書いてください</h3>
            <input type="text" id="textInput2" name="weaknesses" placeholder="弱みを入力" size="30" onChange={(e)=>setTextInput2(e.target.value)}/>
            </div>
            
        <button id="sendButton" onClick={sendData} >データ送信</button>
        <button className="back-button" onClick={() => navigate("/")}>ホームに戻る</button>

    </div>
    </>
    )
}

export default Create;