// src/components/Footer.js

function Footer() {
  return (
    <footer style={{ textAlign: "center", marginTop: "50px" }}>
      Version: {process.env.REACT_APP_VERSION}
    </footer>
  );
}

export default Footer;
