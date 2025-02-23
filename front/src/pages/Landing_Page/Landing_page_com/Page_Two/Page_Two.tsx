import "./Page_Two.css";
function Page_Two() {
  return (
    <div id="l_p_2">
      <div className="l_p_2_top">
        <img className="cards_landing_page" src="/Home_page/cards/card_multiplayer.svg" alt="multiplayer" />
        <img className="cards_landing_page" id="challenges" src="/Home_page/cards/card_challenges.svg" alt="challenges" />
        <img className="cards_landing_page" src="/Home_page/cards/card_easy.svg" alt="easy to play" />
      </div>

      <div className="l_p_2_buttom">
        <img id="info_card" src="/Home_page/cards/infos_card.svg" alt="infos" />
        <img id="info_card_v" src="/Home_page/cards/infos_card_v.svg" alt="infos" />
      </div>
    </div>
  );
}

export default Page_Two;
