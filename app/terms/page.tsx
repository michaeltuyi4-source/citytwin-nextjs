import Link from "next/link";
import CTLogo from "@/components/CTLogo";
import NavAuth from "@/components/NavAuth";

export const metadata = {
  title: "Terms of Use - CityTwin",
  description: "Terms and conditions for using CityTwin.",
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

export default function TermsPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand">
          <CTLogo size={34} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>
        <div className="nav-actions">
          <NavAuth />
          <Link href="/find" className="nav-cta">
            Start matching →
          </Link>
        </div>
      </nav>

      <main className="about">
        <article className="ab-inner">
          <h1 className="ab-title">Terms of Use</h1>
          <p
            className="ab-body"
            style={{ color: "var(--slate-400)", fontSize: "13px" }}
          >
            Last updated: June 22, 2026
          </p>

          <p className="ab-body">
            These Terms of Use govern your access to and use of CityTwin,
            operated by CityTwin LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;). By using citytwinapp.com you agree to these
            Terms. If you do not agree, please do not use our service.
          </p>

          <h2 style={heading}>1. About CityTwin</h2>
          <p className="ab-body">
            CityTwin is a neighborhood matching tool that helps individuals and
            families relocating to new cities find neighborhoods that fit their
            lifestyle, daily routine, and personal priorities. Our service
            provides informational recommendations only and does not constitute
            real estate, legal, or financial advice.
          </p>

          <h2 style={heading}>2. Accounts</h2>
          <p className="ab-body">
            Some features require you to create an account. You are responsible
            for keeping your account credentials secure and for all activity
            that occurs under your account. You agree to provide accurate
            information when you sign up and to keep it current. Notify us
            promptly if you believe your account has been accessed without your
            permission.
          </p>

          <h2 style={heading}>3. Use of the service</h2>
          <p className="ab-body">
            You may use CityTwin for personal and internal business purposes. By
            using our service you agree not to:
          </p>
          <ul style={list}>
            <li style={listItem}>
              Use the service for any unlawful purpose or in violation of any
              regulations.
            </li>
            <li style={listItem}>
              Attempt to gain unauthorized access to any part of the service or
              its infrastructure.
            </li>
            <li style={listItem}>
              Scrape, copy, or reproduce content from the service without
              permission.
            </li>
            <li style={listItem}>
              Interfere with or disrupt the integrity or performance of the
              service.
            </li>
            <li style={listItem}>
              Transmit any harmful, offensive, or disruptive content through the
              service.
            </li>
            <li style={listItem}>
              Impersonate any person or entity, or misrepresent your
              affiliation.
            </li>
            <li style={listItem}>
              Use the service to advertise or offer to sell goods or services.
            </li>
          </ul>

          <h2 style={heading}>4. Paid features and payment</h2>
          <p className="ab-body">
            CityTwin offers a paid tier that unlocks additional features for a
            one-time fee. Payment is processed securely by Stripe. By purchasing
            the paid tier, you authorize us to charge the payment method you
            provide. Prices are shown at the point of purchase and may change
            over time, but a change in price will not affect a purchase you have
            already completed.
          </p>

          <h2 style={heading}>5. Refunds</h2>
          <p className="ab-body">
            The paid tier is a one-time purchase that unlocks digital features
            immediately. If something goes wrong with your purchase or you
            believe you were charged in error, contact us at{" "}
            <a
              href="mailto:support@citytwinapp.com"
              style={{ color: "var(--navy)" }}
            >
              support@citytwinapp.com
            </a>{" "}
            and we will work with you in good faith to make it right. Except
            where a refund is required by law, refunds are provided at our
            discretion.
          </p>

          <h2 style={heading}>6. Informational purpose only</h2>
          <p className="ab-body">
            CityTwin provides neighborhood recommendations based on lifestyle
            priorities you provide. These recommendations are for informational
            purposes only. We do not guarantee the accuracy, completeness, or
            suitability of any neighborhood information. You should independently
            verify all information before making any relocation or housing
            decision. CityTwin is not a licensed real estate broker or advisor.
          </p>

          <h2 style={heading}>7. Intellectual property</h2>
          <p className="ab-body">
            All content, features, and functionality of CityTwin, including but
            not limited to the matching algorithm, neighborhood data, design,
            text, and graphics, are owned by CityTwin LLC and protected by
            applicable intellectual property laws. You may not reproduce,
            distribute, or create derivative works without our express written
            permission.
          </p>

          <h2 style={heading}>8. Privacy</h2>
          <p className="ab-body">
            Your use of CityTwin is also governed by our{" "}
            <Link href="/privacy" style={{ color: "var(--navy)" }}>
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference. By using the
            service you consent to the data practices described in our Privacy
            Policy.
          </p>

          <h2 style={heading}>9. Third-party services</h2>
          <p className="ab-body">
            CityTwin uses third-party services, including Mapbox for mapping and
            Google Places for venue data. Your use of these features is subject
            to the respective terms of those providers. We are not responsible
            for the accuracy or availability of third-party data.
          </p>

          <h2 style={heading}>10. Disclaimer of warranties</h2>
          <p className="ab-body">
            CityTwin is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis without warranties of any kind, either
            express or implied. We do not warrant that the service will be
            uninterrupted, error-free, or free of viruses or other harmful
            components. We make no warranties regarding the accuracy or
            reliability of neighborhood recommendations.
          </p>

          <h2 style={heading}>11. Limitation of liability</h2>
          <p className="ab-body">
            To the fullest extent permitted by law, CityTwin LLC shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of or inability to use the
            service. Our total liability to you for any claim arising from these
            Terms or your use of the service shall not exceed the greater of the
            amount you have paid to us in the twelve months preceding the claim,
            or ten US dollars.
          </p>

          <h2 style={heading}>12. Dispute resolution</h2>
          <p className="ab-body">
            Any dispute arising from these Terms or your use of CityTwin will
            first be addressed through informal negotiation. You agree to
            contact us at{" "}
            <a
              href="mailto:legal@citytwinapp.com"
              style={{ color: "var(--navy)" }}
            >
              legal@citytwinapp.com
            </a>{" "}
            and give us 30 days to resolve the issue before pursuing any formal
            proceedings. If informal resolution fails, disputes will be resolved
            through binding arbitration in Virginia, United States, rather than
            in court. You have two years from the date a cause of action arises
            to bring a claim against CityTwin.
          </p>

          <h2 style={heading}>13. Governing law</h2>
          <p className="ab-body">
            These Terms are governed by the laws of the Commonwealth of
            Virginia, United States, without regard to its conflict of law
            provisions. Any litigation that proceeds in court rather than
            arbitration shall take place in Virginia.
          </p>

          <h2 style={heading}>14. Changes to these Terms</h2>
          <p className="ab-body">
            We may update these Terms from time to time. When we do, we will
            update the &ldquo;Last updated&rdquo; date at the top of this page.
            For significant changes, we will notify users by email. Your
            continued use of CityTwin after changes are posted constitutes your
            acceptance of the updated Terms.
          </p>

          <h2 style={heading}>15. Contact us</h2>
          <p className="ab-body">
            If you have questions about these Terms, please contact us:
          </p>
          <p className="ab-body">
            Email:{" "}
            <a
              href="mailto:legal@citytwinapp.com"
              style={{ color: "var(--navy)" }}
            >
              legal@citytwinapp.com
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
