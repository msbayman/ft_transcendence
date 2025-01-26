import Password_component from "./Password_component";
import TwoFA_Component from "./TwoFA-component";

interface player_data {
  newPassword: string;
  oldPassword: string;
}

interface ProfileSideProps {
  setPlayerData: React.Dispatch<React.SetStateAction<Partial<player_data>>>;
}

function Security_box({ setPlayerData }: ProfileSideProps) {
  return (
    <div className="from-box security">
      <Password_component setPlayerData={setPlayerData} />
      <TwoFA_Component />
    </div>
  );
}

export default Security_box;
