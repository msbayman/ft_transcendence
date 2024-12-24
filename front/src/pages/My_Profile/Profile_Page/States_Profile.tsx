import * as React from "react";
import "./States_Profile.css";
import { BarChart } from "@mui/x-charts/BarChart";



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


export const States_Profile = () => {

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
                categoryGapRatio: 0.4,
                barGapRatio: 0.6,
              },
            ]}
            series={[
              {
                data: [4, 3, 5, 1, 5],
                color: "green",
              },
              {
                data: [1, 6, 3, 0, 1],
                color: "red",
              },
            ]}
            borderRadius={30}
            width={500}
            height={300}
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
