import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const [selectedId, setSelectedId] = useState("");
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const saveSelection = () => {
        if (!selectedId) {
            alert("選手を選択してください");
            return;
        }
        navigate(`/create?player_id=${selectedId}`);
    };

    const viewSelection = () => {
        if (!selectedId) {
            alert("選手を選択してください");
            return;
        }
        navigate("/view", {
            state: {
                playerId: selectedId,
                playerName: selectedPlayer?.player_name,
                playerBelonging: selectedPlayer?.player_belonging,
            }
        });
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                console.log("fetch start");

                const res = await fetch("https://iwto-app.onrender.com/players");
                console.log("status:", res.status);

                const result = await res.json();
                console.log("result:", result);

                if (result.status === "success") {
                    setPlayers(result.data);
                    console.log("players set:", result.data);
                } else {
                    console.error("API error:", result.message);
                }
            } catch (error) {
                console.error("fetch error:", error);
            }
        };

        fetchPlayers();
    }, []);

    const filteredPlayers = players.filter(player =>
        player.player_name.includes(search) ||
        player.player_belonging.includes(search)
    );

    return (
        <>
            <div className="container">
                <div className="title-container">
                    <h2>プレー振り返り</h2>
                </div>

                <div className="form-group">
                    <label htmlFor="player">選手を選択</label>
                    <p>players件数: {players.length}</p>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="名前 or チームで検索"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />

                        <select
                            name="to_player_id"
                            id="to_player_id"
                            required
                            value={selectedId}
                            onChange={(e) => {
                                const value = e.target.value;
                                const foundPlayer = players.find(
                                    p => p.id === Number(value)
                                );

                                setSelectedId(value ? Number(value) : "");

                                if (foundPlayer) {
                                    setSelectedPlayer(foundPlayer);
                                }
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

                <div className="button-group">
                    <button onClick={saveSelection}>記録する</button>
                    <button onClick={viewSelection}>閲覧する</button>
                </div>

                <p id="output"></p>
                <div className="tennis-ball" aria-hidden="true"></div>
            </div>
        </>
    );
}

export default Home;