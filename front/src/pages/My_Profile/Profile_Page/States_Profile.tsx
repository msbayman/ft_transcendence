// import * as React from "react";
import "./States_Profile.css";
import { BarChart } from "@mui/x-charts/BarChart";
import { usePlayer } from "../PlayerContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import Cookies from "js-cookie";


// const getLast5Days = () => {
//   const days = [];
//   const currentDate = new Date();

//   for (let i = 4; i >= 0; i--) {
//     const day = new Date(currentDate);
//     day.setDate(currentDate.getDate() - i);
//     days.push(day.toLocaleDateString());
//   }
//   return days;
// };

export const States_Profile = () => {
  const token = Cookies.get("access_token");
    const [winData, setWinData] = useState([0, 0, 0, 0, 0]); // Wins for last 5 days
    const [lossData, setLossData] = useState([0, 0, 0, 0, 0]); // Losses for last 5 days
    const getLast5Days = () => {
      const days = [];
      const currentDate = new Date();
      for (let i = 4; i >= 0; i--) {
        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() - i);
        days.push(day.toLocaleDateString());
      }
      return days;
    };
 const { HOST_URL } = config;
  const my_data = usePlayer();
  const my_username = my_data.playerData?.username;

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const response = await axios.get(
          `${HOST_URL}/api/game/last_5_days/${my_data.playerData?.username}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const matches = response.data;
        // Initialize win and loss counts for the last 5 days
        const last5Days = getLast5Days();
        const winCounts = new Array(5).fill(0);
        const lossCounts = new Array(5).fill(0);

        // Process each match
        matches.forEach((match: any) => {
          const matchDate = new Date(match.date).toLocaleDateString();
          const dayIndex = last5Days.indexOf(matchDate);

          if (dayIndex !== -1) {
            if (match.player1 === my_data.playerData?.username) {
              if (match.player1_score > match.player2_score) {
                winCounts[dayIndex] += 1; // Increment win count
              } else {
                lossCounts[dayIndex] += 1; // Increment loss count
              }
            } else if (match.player2 === my_data.playerData?.username) {
              if (match.player1_score > match.player2_score) {
                lossCounts[dayIndex] += 1; // Increment loss count
              } else {
                winCounts[dayIndex] += 1; // Increment win count
              }
            }
          }
        });
        // Update state with the processed data
        setWinData(winCounts);
        setLossData(lossCounts);
      } catch (err) {
        console.error("Error fetching Matches:", err);
      }
    };
    fetchMatchHistory();
  }, [my_username]);

  const last5day = getLast5Days();
  return (
    <div className="all_content_stat">
      <div className="Title_stat">STATES</div>
      <div className="Content_stat">
        <div className="the_table_stats">
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: last5day,
                // categoryGapRatio: 0.4,
                // barGapRatio: 0.6,
              },
            ]}
            series={[
              {
                data: winData,
                color: "#04D100",
              },
              {
                data: lossData,
                color: "red",
              },
            ]}
            borderRadius={30}
            width={500}
            height={300}
            sx={{
              stroke: "white",
              "& .MuiChartsAxis-line": {
                stroke: "white",
              },
              "& .MuiChartsAxis-label": {
                color: "white",
              },
              "& .MuiChartsAxis-tick": {
                stroke: "white",
              },
            }}
          />
        </div>
        <div className="info_table_stats">
          <span className="win_info"></span>
          <span className="text_win"> win</span>
          <span className="lose_info"></span>
          <span className="text_lose"> Lose</span>
        </div>
      </div>
    </div>
  );
};

export default States_Profile;
