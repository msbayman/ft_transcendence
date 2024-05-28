
import Nav_Bar from './Nav_Bar/Nav_Bar';
import Page_One from './Page_One/Page_One';
import Page_Two from './Page_Two/Page_Two';
import Page_Three from './Page_Three/Page_Three';

function Landing_Page() {
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

export default Landing_Page