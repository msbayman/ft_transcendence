import Nav_Bar from "./components/Nav_Bar/Nav_Bar";
import Page_One from "./components/Page_One/Page_One";
import Page_Two from "./components/Page_Two/Page_Two";
import Page_Three from "./components/Page_Three/Page_Three";
import "./App.css";

function App() {
  return (
    <>
      <div className="bg-[#300488]">
        <Nav_Bar />
        <Page_One />
        <Page_Two />
        <Page_Three />
      </div>
    </>
  );
}

export default App;
