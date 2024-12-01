import "./ChatLayout.css";
import gojo from "../assets/gojo.png";
import info from "../assets/info.png";

export const ChatLayout = () => {
  return (
    <div className="ChatLayout">
      <div>
        <section className="UserStatus">
          <div style={{ display: "flex", gap: "10px" }}>
            <img id="pdf" src={gojo} alt="ddd" />
            <div>
              <h4>Ilyass Asrarfi</h4>
              <h6>online</h6>
            </div>
          </div>
          <img id="info" src={info} alt="ddd" />
        </section>
        <div className="centered-line"></div>
      </div>
      <div className="MessegeInput">
        <form action="input" className=" w-4/5"></form>
        {/* <button className="SendMsg">send</button> */}
        {/* <input type="text" className="Input"></input> */}
      </div>
    </div>
  );
};

export default ChatLayout;
