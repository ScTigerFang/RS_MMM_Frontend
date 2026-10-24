export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="footer-brand">TigerFang</span>
        <span>
          © {new Date().getFullYear()} Daniel Beals
          {process.env.REACT_APP_VERSION
            ? " · v" + process.env.REACT_APP_VERSION
            : ""}
        </span>
      </div>
    </footer>
  );
}
