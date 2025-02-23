import "./Page_Three.css";
import Button from "@mui/material/Button";

function Page_Three() {
  return (
    <div id="l_p_3" className="main_p3">
      <div className="first_empty"></div>
      <div className="main_box_p3">
        <div className="faq_box">
          <div className="FAQ_dev">FAQ</div>
          <p className="questions_style">
            What is the purpose of the PingPong website ?
          </p>
          <p className="answer_style">
            The website is about a game based of a game ping pong but more
            updated .
          </p>
          <p className="questions_style">Is it a free game ?</p>
          <p className="answer_style">
            Yes, it's completely free but you can make in-game purchases .
          </p>
          <p className="questions_style">How can i play ?</p>
          <p className="answer_style">
            Is easy, just by clicking the arrow keys .
          </p>
          <p className="questions_style">Is it safe ?</p>
          <p className="answer_style">Yes, is more secure and safe .</p>
        </div>

        <p className="text_box">
          What are waiting for, upgrade your skills by Join us Now !!
        </p>
        <div className="btn_box">
          <Button id="str">
          <a href="login">Play now</a>
          </Button>
        </div>
      </div>
      <div className="empty_footer"></div>
    </div>
  );
}

export default Page_Three;
