import Link from "next/link";
import CTLogo from "@/components/CTLogo";
import SignOutButton from "@/components/SignOutButton";

export const metadata = {
  title: "Privacy Policy — CityTwin",
  description: "How CityTwin collects, uses, and protects your data.",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "1.25rem",
  color: "var(--navy)",
  margin: "32px 0 10px",
};

const list: React.CSSProperties = {
  margin: "0 0 16px 0",
  paddingLeft: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const listItem: React.CSSProperties = {
  fontSize: "15px",
  color: "var(--slate)",
  lineHeight: "1.6",
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
          <Link href="/find" className="nav-cta">
            Start matching →
          </Link>
          <SignOutButton className="nav-cta-outline" />
        </div>
      </nav>

      <main className="about">
        <article className="ab-inner">
          <h1 className="ab-title">Privacy Policy</h1>
          <p
            className="ab-body"
            style={{ color: "var(--slate-400)", fontSize: "13px" }}
          >
            Last updated: April 15, 2026
          </p>

          <p className="ab-body">
            This Privacy Policy describes how CityTwin LLC (&ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and protects
            your personal information when you use citytwinapp.com. By using our
            service you agree to the practices described in this policy.
          </p>

          <h2 style={heading}>1. Who We Are</h2>
          <p className="ab-body">
            CityTwin is a neighborhood matching tool operated by CityTwin LLC, a
            Virginia limited liability company. We help individuals and families
            relocating to new cities find neighborhoods that fit their lifestyle
            and personal priorities.
          </p>
          <p className="ab-body">
            For privacy-related questions contact us at{" "}
            <a
              href="mailto:privacy@citytwinapp.com"
              style={{ color: "var(--navy)" }}
            >
              privacy@citytwinapp.com
            </a>
            .
          </p>

          <h2 style={heading}>2. Information We Collect</h2>
          <p className="ab-body">
            <strong>Information you provide directly:</strong>
          </p>
          <ul style={list}>
            <li style={listItem}>
              Email address — collected when you create an account or join our
              waitlist
            </li>
          </ul>
          <p className="ab-body">
            <strong>Information collected automatically:</strong>
          </p>
          <ul style={list}>
            <li style={listItem}>
              Log and usage data — including IP address, browser type, pages
              visited, and time spent on the service
            </li>
            <li style={listItem}>
              Device data — including device type, operating system, and browser
              settings
            </li>
            <li style={listItem}>
              Location data — approximate location based on IP address, and map
              interaction data collected by Mapbox when you use the places map
              feature
            </li>
          </ul>

          <h2 style={heading}>3. How We Use Your Information</h2>
          <p className="ab-body">We use the information we collect to:</p>
          <ul style={list}>
            <li style={listItem}>
              Notify you when CityTwin launches in your city (email)
            </li>
            <li style={listItem}>
              Improve and develop our product based on usage patterns
            </li>
            <li style={listItem}>
              Understand how users interact with the service
            </li>
            <li style={listItem}>
              Request feedback to improve the user experience
            </li>
            <li style={listItem}>
              Protect the security and integrity of our service
            </li>
            <li style={listItem}>Comply with legal obligations</li>
          </ul>

          <h2 style={heading}>4. Third-Party Services</h2>
          <p className="ab-body">
            CityTwin uses the following third-party services that may collect
            data independently:
          </p>
          <ul style={list}>
            <li style={listItem}>
              <strong>Mapbox</strong> — powers our interactive neighborhood map.
              Mapbox may collect usage and location data subject to their own
              privacy policy at mapbox.com/legal/privacy
            </li>
            <li style={listItem}>
              <strong>Google Places API</strong> — provides venue data for our
              places recommendations. Subject to Google&apos;s privacy policy at
              policies.google.com/privacy
            </li>
            <li style={listItem}>
              <strong>Supabase</strong> — authentication and database
              infrastructure
            </li>
            <li style={listItem}>
              <strong>Stripe</strong> — payment processing. We never see or
              store your card details
            </li>
            <li style={listItem}>
              <strong>Vercel</strong> — hosting and infrastructure
            </li>
          </ul>
          <p className="ab-body">
            We do not sell your personal information to any third party.
          </p>

          <h2 style={heading}>5. Data Retention</h2>
          <p className="ab-body">
            We retain your email address for as long as your account is active
            or until you request removal, whichever comes first. We will not
            retain your data for longer than 2 years without renewed consent.
            You may request deletion of your data at any time by emailing{" "}
            <a
              href="mailto:privacy@citytwinapp.com"
              style={{ color: "var(--navy)" }}
            >
              privacy@citytwinapp.com
            </a>
            .
          </p>

          <h2 style={heading}>6. Your Rights</h2>
          <p className="ab-body">
            Depending on your location you may have the following rights
            regarding your personal data:
          </p>
          <ul style={list}>
            <li style={listItem}>
              The right to access the personal information we hold about you
            </li>
            <li style={listItem}>
              The right to request correction of inaccurate data
            </li>
            <li style={listItem}>The right to request deletion of your data</li>
            <li style={listItem}>
              The right to opt out of any marketing communications
            </li>
            <li style={listItem}>The right to data portability</li>
          </ul>
          <p className="ab-body">
            To exercise any of these rights contact us at{" "}
            <a
              href="mailto:privacy@citytwinapp.com"
              style={{ color: "var(--navy)" }}
            >
              privacy@citytwinapp.com
            </a>
            . We will respond within 30 days.
          </p>

          <h2 style={heading}>7. Users in the EU, UK, and Canada</h2>
          <p className="ab-body">
            If you are located in the European Union, United Kingdom,
            Switzerland, or Canada, additional privacy rights may apply to you
            under GDPR, UK GDPR, or PIPEDA respectively. Our legal basis for
            processing your data is legitimate interest — specifically to
            operate and improve our service and to notify you when your city
            becomes available. You have the right to object to this processing
            at any time.
          </p>

          <h2 style={heading}>8. Children&apos;s Privacy</h2>
          <p className="ab-body">
            CityTwin is not directed at individuals under the age of 18. We do
            not knowingly collect personal information from minors. If you
            believe we have inadvertently collected information from a minor
            please contact us and we will delete it promptly.
          </p>

          <h2 style={heading}>9. Security</h2>
          <p className="ab-body">
            We take reasonable technical and organizational measures to protect
            your personal information against unauthorized access, loss, or
            misuse. However no method of transmission over the internet is 100%
            secure and we cannot guarantee absolute security.
          </p>

          <h2 style={heading}>10. Cookies</h2>
          <p className="ab-body">
            CityTwin uses basic functional cookies to operate the service. These
            are small files stored on your device that help us remember your
            session preferences. We do not use cookies for advertising or
            cross-site tracking. You can disable cookies in your browser
            settings but this may affect the functionality of the service.
          </p>

          <h2 style={heading}>11. Changes to This Policy</h2>
          <p className="ab-body">
            We may update this Privacy Policy from time to time. When we do we
            will update the &ldquo;Last updated&rdquo; date at the top of this
            page and notify users by email. Your continued use of CityTwin after
            changes are posted constitutes your acceptance of the updated
            policy.
          </p>

          <h2 style={heading}>12. Contact Us</h2>
          <p className="ab-body">
            If you have questions or concerns about this Privacy Policy or how
            we handle your data please contact us:
          </p>
          <p className="ab-body">
            Email:{" "}
            <a
              href="mailto:privacy@citytwinapp.com"
              style={{ color: "var(--navy)" }}
            >
              privacy@citytwinapp.com
            </a>
            <br />
            Company: CityTwin LLC
            <br />
            State of formation: Virginia, United States
          </p>

          <div className="ab-cta-wrap">
            <Link href="/find" className="btn-primary">
              Find your match →
            </Link>
          </div>
        </article>
      </main>

      <footer className="footer">
        <div
          className="ft-bottom"
          style={{ borderTop: "0.5px solid var(--blue-pale)", paddingTop: 20 }}
        >
          <div className="ft-copy">
            © 2026 CityTwin LLC. All rights reserved.
          </div>
          <div className="ft-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
