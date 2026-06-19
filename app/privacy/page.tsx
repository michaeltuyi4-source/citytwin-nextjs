import Link from 'next/link';
import CTLogo from '@/components/CTLogo';

export const metadata = {
  title: 'Privacy Policy — CityTwin',
  description: 'How CityTwin collects, uses, and protects your data.',
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

export default function PrivacyPage() {
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
          <h1 className="ab-title">Privacy Policy</h1>
          <p className="ab-body" style={{ color: 'var(--slate-400)', fontSize: '13px' }}>
            Last updated: June 20, 2026
          </p>

          <p className="ab-body">
            CityTwin LLC (&ldquo;CityTwin,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) operates citytwinapp.com. This policy explains what data we collect, how we use it, and your rights.
          </p>

          <h2 style={heading}>What we collect</h2>
          <p className="ab-body">
            <strong>Account information.</strong> When you create an account, we collect your email address and a hashed password via Supabase Auth.
          </p>
          <p className="ab-body">
            <strong>Quiz responses.</strong> Your lifestyle priorities and city preferences are stored locally in your browser (sessionStorage and localStorage). We do not transmit this data to our servers unless you are signed in.
          </p>
          <p className="ab-body">
            <strong>Payment information.</strong> Payments are processed by Stripe. We never see or store your card number. We receive a confirmation of payment and your email address from Stripe upon a successful transaction.
          </p>
          <p className="ab-body">
            <strong>Usage data.</strong> We collect standard server logs including IP address, browser type, and pages visited. We use this to maintain and improve the service.
          </p>

          <h2 style={heading}>How we use your data</h2>
          <p className="ab-body">We use your data to:</p>
          <ul style={list}>
            <li style={listItem}>Provide and improve the CityTwin matching service</li>
            <li style={listItem}>Process payments and verify your account tier</li>
            <li style={listItem}>Send transactional emails (account confirmation, payment receipts)</li>
            <li style={listItem}>Respond to support requests</li>
          </ul>
          <p className="ab-body">
            We do not sell your personal data. We do not use your data for advertising.
          </p>

          <h2 style={heading}>Data retention</h2>
          <p className="ab-body">
            We retain your account data for as long as your account is active. You may request deletion at any time by emailing hello@citytwinapp.com. We will delete your account and associated data within 30 days.
          </p>

          <h2 style={heading}>Your rights (GDPR and CCPA)</h2>
          <p className="ab-body">Depending on where you live, you may have the right to:</p>
          <ul style={list}>
            <li style={listItem}>Access the personal data we hold about you</li>
            <li style={listItem}>Correct inaccurate data</li>
            <li style={listItem}>Request deletion of your data</li>
            <li style={listItem}>Object to or restrict processing of your data</li>
            <li style={listItem}>Data portability</li>
          </ul>
          <p className="ab-body">
            To exercise any of these rights, email us at hello@citytwinapp.com.
          </p>

          <h2 style={heading}>Third-party services</h2>
          <p className="ab-body">CityTwin uses the following third-party services, each governed by their own privacy policies:</p>
          <ul style={list}>
            <li style={listItem}><strong>Supabase</strong> — authentication and database</li>
            <li style={listItem}><strong>Stripe</strong> — payment processing</li>
            <li style={listItem}><strong>Mapbox</strong> — mapping and location data</li>
            <li style={listItem}><strong>Vercel</strong> — hosting and infrastructure</li>
          </ul>

          <h2 style={heading}>Cookies</h2>
          <p className="ab-body">
            We use session cookies to keep you signed in. We do not use tracking or advertising cookies.
          </p>

          <h2 style={heading}>Changes to this policy</h2>
          <p className="ab-body">
            We may update this policy as the service evolves. We will notify you by email if changes are material. Continued use of CityTwin after changes take effect constitutes acceptance of the updated policy.
          </p>

          <h2 style={heading}>Contact</h2>
          <p className="ab-body">
            Questions about this policy? Email us at <a href="mailto:hello@citytwinapp.com" style={{ color: 'var(--navy)' }}>hello@citytwinapp.com</a>.
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
