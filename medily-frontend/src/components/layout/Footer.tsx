import React from "react";

interface FooterColumnProps {
    heading: string;
    links: { label: string; href: string }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ heading, links }) => (
    <div className="footer-column">
        <h4 className="footer-heading">{heading}</h4>
        <ul className="footer-links">
            {links.map((link) => (
                <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                </li>
            ))}
        </ul>
    </div>
);

const Footer: React.FC = () => {
    const columns: FooterColumnProps[] = [
        {
            heading: "Product",
            links: [
                { label: "Features", href: "#features" },
                { label: "Security", href: "#security" },
                { label: "Pricing", href: "#pricing" },
                { label: "Updates", href: "#updates" },
            ],
        },
        {
            heading: "For Professionals",
            links: [
                { label: "For Doctors", href: "#doctors" },
                { label: "For Clinics", href: "#clinics" },
                { label: "For Pharmacies", href: "#pharmacies" },
                { label: "API Access", href: "#api" },
            ],
        },
        {
            heading: "Resources",
            links: [
                { label: "Blog", href: "#blog" },
                { label: "Help Center", href: "#help" },
                { label: "Contact", href: "#contact" },
                { label: "FAQ", href: "#faq" },
            ],
        },
        {
            heading: "Legal",
            links: [
                { label: "Privacy Policy", href: "#privacy" },
                { label: "Terms of Service", href: "#terms" },
                { label: "HIPAA Compliance", href: "#hipaa" },
                { label: "Cookie Policy", href: "#cookies" },
            ],
        },
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-main">
                    <div className="footer-column footer-brand">
                        <h3 className="footer-logo">Medily</h3>
                        <p className="footer-tagline">
                            Your complete healthcare platform, connecting patients and
                            professionals securely.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link">Twitter</a>
                            <a href="#" className="social-link">LinkedIn</a>
                            <a href="#" className="social-link">Facebook</a>
                        </div>
                    </div>

                    {columns.map((col) => (
                        <FooterColumn key={col.heading} {...col} />
                    ))}
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">© 2024 Medily. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#privacy">Privacy</a>
                        <a href="#terms">Terms</a>
                        <a href="#accessibility">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;