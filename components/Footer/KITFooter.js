import Image from "next/image";
import Link from "next/link";

import logo from "../../public/images/logo/logo.png";
import logoLight from "../../public/images/dark/logo/logo-light.png";

import SingleFooter from "./FooterProps/SingleFooter";
import CopyRight from "./CopyRight";
import { useAppContext } from "@/context/Context";

const KITFooter = () => {
  const { isLightTheme } = useAppContext();

  const footer = {
    quicklinks: [
      { label: "About Us", href: "/about" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "Members", href: "/members" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
    ],
    quicklinks2: [
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Alumni Directory", href: "/alumni" },
    ],
    description: "To impart quality technical education emphasizing innovations and research with social and ethical values.",
    phone: "0422 3502440",
    mail: "info@karpagamtech.ac.in",
    address:
      "S.F.No.247,248, L&T Bypass Road, Seerapalayam Village, Coimbatore – 641 105",
  };

  return (
    <>
      <footer className="rbt-footer footer-style-1 ">
        <div className="footer-top">
          <div className="container">
            <div className="row row--15 mt_dec--30">
              <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt--30">
                <div className="footer-widget">
                  <div className="logo">
                    <Link href="/">
                      {isLightTheme ? (
                        <Image
                          src={logo}
                          width={152}
                          height={50}
                          priority={true}
                          alt="Education Logo"
                        />
                      ) : (
                        <Image
                          src={logoLight}
                          width={152}
                          height={50}
                          priority={true}
                          alt="Education Logo"
                        />
                      )}
                    </Link>
                  </div>

                  <p className="description mt--20">{footer.description}</p>

                  <div className="contact-btn mt--30">
                    <Link
                      className="rbt-btn hover-icon-reverse btn-border-gradient radius-round"
                      href="/contact"
                    >
                      <div className="icon-reverse-wrapper">
                        <span className="btn-text">Contact With Us</span>
                        <span className="btn-icon">
                          <i className="feather-arrow-right"></i>
                        </span>
                        <span className="btn-icon">
                          <i className="feather-arrow-right"></i>
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <SingleFooter
                classOne="offset-lg-1 col-lg-2 col-md-6 col-sm-6 col-12 mt--30"
                title="Useful Links"
                footerType={footer.quicklinks}
              />

              <SingleFooter
                classOne="col-lg-2 col-md-6 col-sm-6 col-12 mt--30"
                // title="Our Company"
                footerType={footer.quicklinks2}
              />

              <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--30">
                <div className="footer-widget">
                  <h5 className="ft-title">Get Contact</h5>
                  <ul className="ft-link">
                    <li>
                      <span>Phone:</span>
                      {footer.phone ? (
                        <Link href={`tel:${footer.phone}`}>{footer.phone}</Link>
                      ) : null}
                    </li>
                    <li>
                      <span>E-mail:</span>
                      {footer.mail ? (
                        <Link href={`mailto:${footer.mail}`}>
                          {footer.mail}
                        </Link>
                      ) : null}
                    </li>
                    <li>
                      <span>Location:</span> {footer.address}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <CopyRight />
    </>
  );
};

export default KITFooter;
