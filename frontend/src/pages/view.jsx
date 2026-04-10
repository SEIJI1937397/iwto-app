import {useLocation} from "react-router-dom";
import "./view.css";
import {useState, useEffect} from "react";
import RadarChart from "./RadarChart";
import {useNavigate} from "react-router-dom";

function View(){
    const[feedbacks, setFeedbacks] = useState([]);
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);
    console.log("data:", data);

    useEffect(() => {
        const fetchFeedbacks = async () =>{
            try{
                const res = await fetch(`http://localhost:3000/feedback?player_id=${data.playerId}`);
                const result = await res.json();

                if (result.status === "success"){
                    setFeedbacks(result.data);
                }else{
                    console.log(result.message);
                }
            }catch(error){
                console.log(error);
            }
        };

        if(data?.playerId){
            fetchFeedbacks();
        }
        
    },[data]);


    return(
        <>
        <h1>フィードバック一覧</h1>

        <div className="recipient">
        <div className="name">{data?.playerName}</div>
        <div className="belonging">{data?.playerBelonging}</div>
        </div>
        <div id="feedback-data">
            {feedbacks.map((fb, index) => {
    const isOpen = openIndex === index;

    return (
        <div key={index} className="accordion-item">
            {/* タイトル部分 */}
            <div
                className="accordion-header"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                style={{ cursor: "pointer", background: "#eee", padding: "10px", marginTop: "10px" }}
            >
                <h3>
                    {fb.from_player_name} ({fb.from_player_belonging})
                </h3>
            </div>

            {/* 中身（開いたときだけ表示） */}
            {isOpen && (
                <div className="accordion-content" style={{ padding: "10px", border: "1px solid #ccc" }}>
                    <p>{fb.playstyle}</p>
                    <p>強み: {fb.strengths}</p>
                    <p>弱み: {fb.weaknesses}</p>
                    <RadarChart data={fb} />
                </div>
            )}
        </div>
    );
})}
        </div>
        <button className="back-button" onClick={() => navigate("/")}>ホームに戻る</button>
        </>
    )
}

export default View;