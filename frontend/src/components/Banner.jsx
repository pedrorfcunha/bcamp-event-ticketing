import React from 'react';

const Banner = () => {
  return (
    <div className="container mx-auto">
      <div className="flex h-[100%]">
        <div className="w-1/12 p-2 border-r-[1px] border-gray-700" />
        <div className="w-10/12 py-44 px-20">
          <div className="p-10 hagrid text-5xl text-white">
            THE ULTIMATE BLOCKCHAIN <br />
            PLATFORM FOR PROMOTING
            <br />
            YOUR EVENTS.
          </div>
          <div className="px-10 text-white max-w-[500px]">
            <div className="mb-6">
              Discover the ultimate platform for turbocharging your event promotions. Our
              cutting-edge platform is meeticulously designed to catapault your events.
            </div>
            <a href="#Events">
              <button className="bg-white px-6 py-3 text-black rounded-md font-bold">
                Get Started 🚀
              </button>
            </a>
          </div>
        </div>
        <div className="w-1/12 p-2 border-l-[1px] border-gray-700" />
      </div>
    </div>
  );
};

export default Banner;
