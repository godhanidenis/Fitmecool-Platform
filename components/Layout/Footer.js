import Image from "next/image";

import FacebookLogo from "../../assets/svg/FacebookLogo";
import YoutubeLogo from "../../assets/svg/YoutubeLogo";
import LinkedinLogo from "../../assets/svg/LinkedinLogo";
import TwitterLogo from "../../assets/svg/TwitterLogo";
import InstagramLogo from "../../assets/svg/InstagramLogo";
import Link from "next/link";
import LocationIcon from "../../assets/LocationIcon.svg";
import CalIcon from "../../assets/CalIcon.svg";
import EmailIcon from "../../assets/EmailIcon.svg";
import { useSelector } from "react-redux";

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
  const { userProfile } = useSelector((state) => state.userProfile);
  return (
    <footer className="text-sm bg-colorPrimary text-colorWhite font-Nova relative">
      <div className="flex justify-between flex-wrap gap-4">
        <div className="pt-[24px] sm:pt-20 flex flex-col lg:flex-row items-start justify-between gap-8 ml-[5.5%]">
          <div className="flex flex-col sm:items-center md:items-start  max-w-[420px] ">
          <Link href={`${userProfile.user_type === "vendor" ? "/vendor/dashboard" : "/"}`}>
              <div className="cursor-pointer mb-3">
                <h2 className="sm:text-2xl text-[18px] font-semibold uppercase cursor-pointer text-colorWhite -mt-2">
                  <span className="sm:text-4xl text-[24px]">R</span>entbless
                  {/* <span className="text-4xl">B</span>ell */}
                </h2>
                {/* <Image src={HeaderLogo} alt="Rent bless Logo" layout="fill" /> */}
              </div>
            </Link>
            <div className="text-[16px] font-normal text-[#FAFCFC] mb-[25px]">
              Best information about the company gies here but now lorem ipsum is
            </div>
            <ul className="flex items-center">
              {socials &&
                socials.map((social) => (
                  <Link key={social.id} href={social.link}>
                    <a target="_blank">
                      <li className="bg-[#FFFFFF] flex justify-center items-center rounded-[50%] w-[30px] h-[30px] footer-link mr-[12px]">
                        <div className="w-4 h-4">{social.logo}</div>
                      </li>
                    </a>
                  </Link>
                ))}
            </ul>
          </div>
          <ul className="flex flex-wrap gap-36 ml-[16px] sm:ml-[80px]">
            <li>
              <h4 className="font-semibold text-[22px] mb-5 text-colorWhite">Products</h4>
              <ul className="flex flex-col items-start gap-3">
                <li className="text-[18px] font-normal text-[#FAFCFC]">{`Men's`}</li>
                <li className="text-[18px] font-normal text-[#FAFCFC]">{`Women's`}</li>
                <li className="text-[18px] font-normal text-[#FAFCFC]">{`kid's`}</li>
              </ul>
            </li>
            <li>
              <h4 className="font-semibold text-[22px] mb-5 text-colorWhite">Brands</h4>
              <ul className="flex flex-col items-start gap-3">
                <li className="text-[18px] font-normal text-[#FAFCFC]">FAQs</li>
                <li className="text-[18px] font-normal text-[#FAFCFC]">How if Works</li>
                <li className="text-[18px] font-normal text-[#FAFCFC]">About As</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="sm:border-l border-[gray]">
          <h4 className="w-[100vw] text-center sm:w-auto font-semibold text-[28px] sm:text-[32px] mb-5 text-[#FAFCFC] bg-[#29977E] sm:py-[33px] py-[23px] sm:px-[75px] px-[57px]">
            Get in Touch with Us
          </h4>
          <div className="flex flex-col items-start ml-[80px]">
            <div className="flex mb-[30px]">
              <Image width={32} src={LocationIcon} alt="" />
              <div className="ml-[20px]">
                <p className="text-[#FAFCFC] text-[18px] font-normal">Address</p>
                <p className="text-[#DEFFF8] text-[16px] font-normal">304, Angel Square, Uttran, Surat</p>
              </div>
            </div>

            <div className="flex mb-[30px]">
              <Image width={32} src={CalIcon} alt="" />
              <div className="ml-[20px]">
                <p className="text-[#FAFCFC] text-[18px] font-normal">Contact Number</p>
                <p className="text-[#DEFFF8] text-[16px] font-normal">+91 953 725 6159</p>
              </div>
            </div>
            <div className="flex mb-[25px] sm:mb-[64px]">
              <Image width={32} src={EmailIcon} alt="" />
              <div className="ml-[20px]">
                <p className="text-[#FAFCFC] text-[18px] font-normal">Email</p>
                <p className="text-[#DEFFF8] text-[16px] font-normal">info@flyontech.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-[24px] text-center text-[#FFFFFF] font-normal border-t border-[gray]">
        © 2022 - Terms & Conditions | Privacy Policy
      </div>
    </footer>
  );
};

export default Footer;
