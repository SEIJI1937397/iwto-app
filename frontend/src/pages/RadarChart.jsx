import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";

import {Radar} from "react-chartjs-2";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

function RadarChart({data}){
    const chartData ={
        labels: [
            "フォア",
            "バック",
            "サーブ",
            "ボレー",
            "球種",
            "安定感",
            "威力",
            "深さ",
        ],
        datasets: [
            {
            label: "テニススキル",
            data: [    
                data.forehand,
                data.backhand,
                data.serve,
                data.volley,
                data.shot_variety,
                data.consistency,
                data.shot_power,
                data.shot_depth,
            ],
        
            backgroundColor: "rgba(0,123,255,0.2)",
            borderColor: "#007bff",
            borderWidth: 2,
            },
        ],

    };

    const options ={
        scales: {
            r:{
                min:0,
                max:5,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };
    return <Radar data={chartData} options={options}/>;
};

export default RadarChart;

