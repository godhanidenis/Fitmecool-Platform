import Image from "next/image";
import Link from "next/link";
import { assets, footerData } from "../../constants";
import AppLogo from "./AppLogo";

const Footer = () => {
  return (
    <footer className="text-sm bg-colorPrimary text-colorWhite font-Nova relative">
      <div className="flex justify-between flex-wrap gap-10">
        <div className="pt-[24px] sm:pt-20 flex flex-col lg:flex-row flex-wrap items-start justify-between gap-8 ml-[5.5%]">
          <div className="flex flex-col sm:items-center md:items-start max-w-[420px] -mt-6">
            <AppLogo />
            {/* <div className="text-[16px] font-normal text-[#FAFCFC] mb-[25px] mt-2">
              Best information about the company gies here but now lorem ipsum
              is
            </div> */}
            <ul className="flex items-center mt-6">
              {footerData.socialMediaList.map((social) => (
                <Link key={social.id} href={social.link}>
                  <a target="_blank">
                    <li className="bg-[#FFFFFF] flex justify-center items-center rounded-[50%] w-[30px] h-[30px] mr-[12px]">
                      <div className="w-4 h-4">
                        <Image
                          src={social.logo}
                          width={16}
                          height={16}
                          alt="Socials Logo"
                        />
                      </div>
                    </li>
                  </a>
                </Link>
              ))}
            </ul>
          </div>
          <ul className="flex flex-wrap sm:gap-36 gap-28 ml-[16px] sm:ml-[80px]">
            {footerData.dataList.map((footer, index) => (
              <li key={index}>
                <h4 className="font-semibold text-[22px] mb-5 text-colorWhite">
                  {footer.name}
                </h4>
                <ul className="flex flex-col items-start gap-3">
                  {footer.data.map((itm, idx) => (
                    <li
                      key={idx}
                      className="text-[18px] font-normal text-[#FAFCFC]"
                    >
                      {itm}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:border-l border-[gray]">
          <h4 className="w-screen text-center md:w-auto font-semibold text-[28px] sm:text-[32px] mb-5 text-[#FAFCFC] bg-colorGreen sm:py-[33px] py-[23px] sm:px-[75px] px-[57px]">
            Get in Touch with Us
          </h4>
          <div className="flex flex-col items-start sm:ml-[80px] ml-[57px]">
            <div className="flex mb-[30px]">
              <Image
                src={assets.locationIcon}
                width={32}
                height={32}
                alt="locationIcon"
              />
              <div className="ml-[20px]">
                <p className="text-[#FAFCFC] text-[18px] font-normal">
                  Address
                </p>
                <p className="text-[#DEFFF8] text-[16px] font-normal">
                  304, Angel Square, Uttran, Surat
                </p>
              </div>
            </div>

            <div className="flex mb-[30px]">
              <Image
                src={assets.callIcon}
                width={32}
                height={32}
                alt="callIcon"
              />
              <div className="ml-[20px]">
                <p className="text-[#FAFCFC] text-[18px] font-normal">
                  Contact Number
                </p>
                <p className="text-[#DEFFF8] text-[16px] font-normal">
                  +91 953 725 6159
                </p>
              </div>
            </div>
            <div className="flex mb-[25px] sm:mb-[64px]">
              <Image
                src={assets.emailIcon}
                width={32}
                height={32}
                alt="emailIcon"
              />
              <div className="ml-[20px]">
                <p className="text-[#FAFCFC] text-[18px] font-normal">Email</p>
                <p className="text-[#DEFFF8] text-[16px] font-normal">
                  info@flyontech.com
                </p>
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
