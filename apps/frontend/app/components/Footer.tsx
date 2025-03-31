import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="bottom-0  w-full bg-black h-60 flex flex-col justify-evenly text-gray-50 p-4 pl-12">
      <div className="header font-bold text-2xl">PyqPapers</div>
      <div className="header-text">
        Comprehensive platform for previous year question papers to help
        students excel in their exams with reliable, verified study materials.
      </div>
      <div className="socials flex">
        <div>
          <Image src="/assests/facebook.svg" className="bg-white rounded-full  mr-2" width={40} height={40} alt="" />
        </div>
        <div>
          <Image src="/assests/linkedin.svg" className="bg-white rounded-full ml-2 mr-2" width={40} height={40} alt="" />
        </div>
        <div>
          <Image src="/assests/instagram.svg" className="bg-white rounded-full ml-2 mr-2" width={40} height={40} alt="" />
        </div>
        <div>
          <Image src="/assests/twitter.svg"className="bg-white rounded-full ml-2 mr-2" width={40} height={40} alt="" />
        </div>
      </div>
      <div className="copyrights text-gray-300">© 2025 PyqPapers. All rights reserved.</div>
    </div>
  );
};

export default Footer;
