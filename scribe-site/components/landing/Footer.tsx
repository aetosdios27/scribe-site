import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer aria-label="scribe footer" className="footer-simple">
      <div className="shell footer-simple-inner">
        <div className="footer-main-row">
          <div className="footer-brand-block">
            <p className="footer-brand-wordmark">scribe</p>
            <p className="footer-brand-description">
              developer-native publishing for your own site.
            </p>
            <Link className="footer-email" href="mailto:hello@scribe.dev">
              aetosdios27@gmail.com
            </Link>
          </div>

          <nav aria-label="public links" className="footer-public-links">
            <Link href="https://github.com/aetosdios27/scribe">
              GitHub
            </Link>
          </nav>
        </div>

        <div className="footer-rule" />

        <div className="footer-utility-row">
          <p>© {year} Scribe</p>
        </div>
      </div>
    </footer>
  );
}
