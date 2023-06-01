import Image from "next/image";

import FacebookLogo from "../../assets/svg/FacebookLogo";
import YoutubeLogo from "../../assets/svg/YoutubeLogo";
import LinkedinLogo from "../../assets/svg/LinkedinLogo";
import TwitterLogo from "../../assets/svg/TwitterLogo";
import InstagramLogo from "../../assets/svg/InstagramLogo";
import Link from "next/link";

const socials = [
  {
    id: 1,
    logo: <FacebookLogo />,
    link: "https://facebook.com/",
  },
  {
    id: 2,
    logo: <YoutubeLogo />,
    link: "https://facebook.com/",
  },
  {
    id: 3,
    logo: <TwitterLogo />,
    link: "https://facebook.com/",
  },
  {
    id: 4,
    logo: <LinkedinLogo />,
    link: "https://facebook.com/",
  },
  {
    id: 5,
    logo: <InstagramLogo />,
    link: "https://facebook.com/",
  },
];

const Footer = () => {
  return (
    <footer className="pt-20 text-sm bg-colorPrimary text-colorWhite">
      <div className="container pb-20">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-20 ">
          <div className="flex flex-col items-center md:items-start gap-10 max-w-[420px] ">
            <div className="w-[220px] h-[50px] relative">
              {/* <Image src={HeaderLogo} alt="Composite logo" layout="fill" /> */}

              <h2 className="text-2xl font-normal uppercase cursor-pointer text-colorWhite">
                <span className="text-4xl">R</span>entbless
              </h2>
            </div>
            <nav>
              <ul className="flex items-center flex-wrap">
                {socials &&
                  socials.map((social) => (
                    <Link key={social.id} href={social.link}>
                      <a target="_blank">
                        <li className="hover:bg-[#E8E8FF] p-4 rounded-xl transition-colors duration-300 footer-link">
                          <div className="w-5 h-5">{social.logo}</div>
                        </li>
                      </a>
                    </Link>
                  ))}
              </ul>
            </nav>
          </div>
          <ul className="hidden md:flex flex-wrap justify-between w-full gap-4">
            <li>
              <h4 className="font-semibold text-xl mb-5 text-colorWhite">
                Products
              </h4>
              <ul className="flex flex-col items-start gap-3">
                <li>{`Men's`}</li>
                <li>{`Women's`}</li>
                <li>{`kid's`}</li>
              </ul>
            </li>
            <li>
              <h4 className="font-semibold text-xl mb-5 text-colorWhite">
                Brands
              </h4>
              <ul className="flex flex-col items-start gap-3">
                <li>FAQs</li>
                <li>How if Works</li>
                <li>About As</li>
              </ul>
            </li>

            <li>
              <h4 className="font-semibold text-xl mb-5 text-colorWhite">
                Get in Touch with Us
              </h4>
              <ul className="flex flex-col items-start gap-3">
                <li>Address</li>
                <li>+123 345123 556</li>
                <li>contact@composite.digital</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-base bg-colorBlack font-semibold">
        © 2022 - Ecommerce software by website™
      </div>
    </footer>
  );
};

export default Footer;
