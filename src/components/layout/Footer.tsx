export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="footer-logo">
        majdst<span>.codes</span>
      </div>
      <div className="footer-links">
        <a href="/privacy" aria-label="Privacy Policy">Privacy</a>
        <span className="link-sep">•</span>
        <a href="/cookies" aria-label="Cookie Policy">Cookies</a>
      </div>
      <div className="footer-copy">
        Built by a dev. For devs. © {currentYear} @majdst_codes
      </div>
    </footer>
  );
}
