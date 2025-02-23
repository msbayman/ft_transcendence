// import * as React from "react";
import other from "./States_Profile.module.css";
import { BarChart } from "@mui/x-charts/BarChart";
import { useState, useEffect } from "react";
import axios from "axios";
import { data_of_player } from "./interface";
import { config } from "../../../../config";
import Cookies from "js-cookie";

interface data_interface {
  other_data: data_of_player | null;
}

export const States_Profile = ({ other_data }: data_interface) => {
  const token = Cookies.get("access_token");
  const { HOST_URL } = config;
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

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const response = await axios.get(
          `${HOST_URL}/api/game/last_5_days/${other_data?.username}/`,
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

        matches.forEach((match: any) => {
          const matchDate = new Date(match.date).toLocaleDateString();
          const dayIndex = last5Days.indexOf(matchDate);

          if (dayIndex !== -1) {
            if (match.player1 === other_data?.username) {
              if (match.player1_score > match.player2_score) {
                winCounts[dayIndex] += 1; // Increment win count
              } else {
                lossCounts[dayIndex] += 1; // Increment loss count
              }
            } else if (match.player2 === other_data?.username) {
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
  }, [other_data?.username]);
  const last5day = getLast5Days();
  return (
    <div className={other.all_content_stat}>
      <div className={other.Title_stat}>STATES</div>
      <div className={other.Content_stat}>
        <div className={other.the_table_stats}>
          <BarChart
            className={`css-132pz3d-MuiChartsAxis-root-MuiChartsXAxis-root MuiChartsAxis-line css-10d7jww-MuiChartsAxis-root-MuiChartsYAxis-root MuiChartsAxis-tick`}
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
          />
        </div>
        <div className={other.info_table_stats}>
          <span className={other.win_info}></span>
          <span className={other.text_win}> win</span>
          <span className={other.lose_info}></span>
          <span className={other.text_win}> win</span>
        </div>
      </div>
    </div>
  );
};

export default States_Profile;
