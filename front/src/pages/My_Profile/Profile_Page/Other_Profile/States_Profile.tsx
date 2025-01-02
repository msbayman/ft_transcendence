import * as React from "react";
import other from "./States_Profile.module.css";
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
                categoryGapRatio: 0.4,
                barGapRatio: 0.6,
              },
            ]}
            series={[
              {
                data: [4, 3, 5, 0, 5],
                color: "#04D100",
              },
              {
                data: [1, 60, 3, 0, 1],
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
          <span className={other.text_lose}> Lose</span>
        </div>
      </div>
    </div>
  );
};

export default States_Profile;
