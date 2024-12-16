import "./FriendsList.css";
import MessageIcon from "../assets/msg.png";
import gojo from "../assets/gojo.png";

export const OnlineFriend = () => {
  return (
    <div className="gap-5 bg-[#3A0CA3] rounded-[8px]">
      <img src={gojo} alt="pdf" />
      <h1>user</h1>
    </div>
  );
};

export const FriendsList = () => {
  return (
    <section className="FriendsList">
      <div className="MessagesHeader">
        <h1>Messages</h1>
        <img src={MessageIcon} alt="icon" />
      </div>
      <h1 className="text-[#ffffff] pl-10 mb-2" style={{ fontSize: "24px" }}>
        Friends
      </h1>
      <div className="OnlineFriends flex justify-around  w-full">
        <OnlineFriend></OnlineFriend>
        <OnlineFriend></OnlineFriend>
        <OnlineFriend></OnlineFriend>
        <OnlineFriend></OnlineFriend>
        <OnlineFriend></OnlineFriend>
        <OnlineFriend></OnlineFriend>
      </div>
      <div className="Search m-9 bg-[#ffffff] w-4/5 rounded h-6">
        <input
          placeholder="  username"
          className=" w-3/5 rounded  h-5"
          type="text"
          name="sds"
          id=""
        />
      </div>
    </section>
  );
};

export default FriendsList;
