import PropTypes from "prop-types";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
