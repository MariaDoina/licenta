import React from "react";
import Button from "./Button";
import Image from "next/image";

const GetApp = () => {
  return (
    <section className="flexCenter w-full flex-col pb-[100px] sm:px-0 xl:px-30">
      <div className="get-app flex flex-col xl:flex-row xl:gap-12">
        <div className="z-20 flex w-full flex-1 flex-col items-start justify-center gap-6 text-black xl:max-w-[600px]">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[360px]">
            Get for free now!
          </h2>
          <p className="regular-16">Available on iOS and Android</p>
          <div className="flex w-full flex-col gap-3 whitespace-nowrap xl:flex-row">
            <Button
              type="button"
              title="App Store"
              icon="/apple.svg"
              variant="btn_white"
              full
            />
            <Button
              type="button"
              title="Play Store"
              icon="/android.svg"
              variant="btn_dark_green_outline"
              full
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center xl:w-[50%]">
          <div className="get-app-image-wrapper">
            <Image
              src="/phones.png"
              alt="phones"
              width={200}
              height={300}
              className="get-app-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetApp;
