import { useNavigate } from "react-router-dom";
import other from "./pages/My_Profile/Profile_Page/Other_Profile/Profile_Page.module.css";

const NotFound = () => {
    const navigate = useNavigate()
  const to_home = () => {
    navigate("/Overview");
  };
  return (
    <div
      className={`${other.NotFound} flex w-screen h-[100%] m-0 justify-center gap-[40px] pb-[200px]`}
    >
      <img
        src="/ERROR_404.gif"
        className="absolute rounded-[30px] mb-[800px] h-[350px]"
        alt="Error_404"
      />

      <div className={other.Title}>Oops!</div>
      <div className={other.Title_sub}>404 - PAGE NOT FOUND</div>
      <button onClick={to_home} className={other.to_Home}>
        Back to Home ..
      </button>
    </div>
  );
};

export default NotFound;
