import Link from 'next/link';
import CTLogo from '@/components/CTLogo';

export const metadata = {
  title: 'Terms of Use — CityTwin',
  description: 'Terms and conditions for using CityTwin.',
};

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.25rem',
  color: 'var(--navy)',
  margin: '32px 0 10px',
};

const list: React.CSSProperties = {
  margin: '0 0 16px 0',
  paddingLeft: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const listItem: React.CSSProperties = {
  fontSize: '15px',
  color: 'var(--slate)',
  lineHeight: '1.6',
};

export default function TermsPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand">
          <CTLogo size={34} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>
        <div className="nav-actions">
          <Link href="/find" className="nav-cta">Start matching →</Link>
        </div>
      </nav>

      <main className="about">
        <article className="ab-inner">
          <div className="ab-eyebrow">Legal</div>
          <h1 className="ab-title">Terms of Use</h1>
          <p className="ab-body" style={{ color: 'var(--slate-400)', fontSize: '13px' }}>
            Last updated: June 20, 2026
          </p>

          <p className="ab-body">
            These Terms of Use govern your access to and use of CityTwin (citytwinapp.com), operated by CityTwin LLC. By using CityTwin, you agree to these terms.
          </p>

          <h2 style={heading}>The service</h2>
          <p className="ab-body">
            CityTwin is a neighborhood matching tool. We help you find neighborhoods that fit your lifestyle based on your stated preferences. Our matches are informational and based on available data. They are not a guarantee of any outcome, including housing availability, business availability, or quality of life.
          </p>

          <h2 style={heading}>Your account</h2>
          <p className="ab-body">
            You must provide a valid email address to create an account. You are responsible for keeping your login credentials secure. You may not share your account or use CityTwin on behalf of others without their consent.
          </p>
          <p className="ab-body">
            You must be at least 18 years old to use CityTwin.
          </p>

          <h2 style={heading}>Payments and refunds</h2>
          <p className="ab-body">
            CityTwin offers a one-time $9 lifetime access purchase. This grants you permanent access to all three neighborhood matches and any cities added in the future.
          </p>
          <p className="ab-body">
            Payments are processed by Stripe and are non-refundable except where required by law. If you believe you were charged in error, contact us at hello@citytwinapp.com within 14 days of the charge.
          </p>

          <h2 style={heading}>Acceptable use</h2>
          <p className="ab-body">You agree not to:</p>
          <ul style={list}>
            <li style={listItem}>Use CityTwin for any unlawful purpose</li>
            <li style={listItem}>Attempt to reverse-engineer, scrape, or extract data from the service</li>
            <li style={listItem}>Interfere with the service or its infrastructure</li>
            <li style={listItem}>Create multiple accounts to circumvent access restrictions</li>
            <li style={listItem}>Misrepresent your identity or affiliation</li>
          </ul>

          <h2 style={heading}>Intellectual property</h2>
          <p className="ab-body">
            All content, design, and code on CityTwin is owned by CityTwin LLC or its licensors. You may not reproduce, distribute, or create derivative works without our written permission.
          </p>

          <h2 style={heading}>Disclaimer of warranties</h2>
          <p className="ab-body">
            CityTwin is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that match results will meet your expectations. Neighborhood data is sourced from third parties and may not be fully accurate or current.
          </p>

          <h2 style={heading}>Limitation of liability</h2>
          <p className="ab-body">
            To the maximum extent permitted by law, CityTwin LLC is not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>

          <h2 style={heading}>Termination</h2>
          <p className="ab-body">
            We may suspend or terminate your account if you violate these terms. You may delete your account at any time by contacting hello@citytwinapp.com.
          </p>

          <h2 style={heading}>Changes to these terms</h2>
          <p className="ab-body">
            We may update these terms as the service evolves. We will notify you by email if changes are material. Continued use of CityTwin after changes take effect constitutes acceptance of the updated terms.
          </p>

          <h2 style={heading}>Governing law</h2>
          <p className="ab-body">
            These terms are governed by the laws of the State of Maryland, United States, without regard to conflict of law principles.
          </p>

          <h2 style={heading}>Contact</h2>
          <p className="ab-body">
            Questions about these terms? Email us at <a href="mailto:hello@citytwinapp.com" style={{ color: 'var(--navy)' }}>hello@citytwinapp.com</a>.
          </p>

          <div className="ab-cta-wrap">
            <Link href="/find" className="btn-primary">Find your match →</Link>
          </div>
        </article>
      </main>

      <footer className="footer">
        <div className="ft-bottom" style={{ borderTop: '0.5px solid var(--blue-pale)', paddingTop: 20 }}>
          <div className="ft-copy">© 2026 CityTwin LLC. All rights reserved.</div>
          <div className="ft-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
