import { useState } from "react";
import Nav_Bar from "./Nav_Bar/Nav_Bar";
import Page_One from "./Page_One/Page_One";
import Page_Two from "./Page_Two/Page_Two";
import Page_Three from "./Page_Three/Page_Three";
import Sd_Bar_Landing from "./Sd_Bar_Landing/Sd_Bar_Landing";

function Landing_Page() {
  const [side_bar, setbar] = useState(false);

  const show_hide_sd_bar = () => {
    setbar(!side_bar);
  };

  return (
    <div className="bg-[#300488]">
      {side_bar && <Sd_Bar_Landing />}
      <Nav_Bar show_hide_sd_bar={show_hide_sd_bar} />
      <Page_One />
      <Page_Two />
      <Page_Three />
    </div>
  );
}

export default Landing_Page;
