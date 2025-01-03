import React from "react";
import "./Recent_Game.css"

export const Recent_Game = () => {
    return (
        <div className="all_content_recent">
            <div className="rece_title">
                <div className="Title_Recent">RECENT GAMES</div>
                <div className="subTitle_Recent">(LAST 10 PLAYED)</div>
            </div>
            <div className="content_Recent"></div>
        </div>
    )
}

export default Recent_Game