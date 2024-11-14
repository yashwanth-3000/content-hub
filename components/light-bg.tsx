"use client";
import { Chip } from "@nextui-org/react";
import React from "react";

function LightBg() {
  return (
    <div className="flex-col justify-center items-center mx-auto mt-10 relative text-center">
      <div className="flex justify-center items-center text-cente mb-2">
      
        <Chip variant="flat" color="secondary">
          Meetings
        </Chip>
      </div>
      <h1 className="text-2xl lg:text-4xl font-semibold z-10 relative">
        Never Loose Information
      </h1>
      <h1 className="text-lg lg:text-xl font-normal z-10 relative max-w-[600px] text-center flex mx-auto justify-center items-center text-gray-500 mt-2">
      Keep track of all your meetings and what was discussed.
Import events quickly with our Google Calendar and Outlook integrations.
      </h1>

      <img alt="meetings" src="/meetings.svg" />
    </div> 
  );
}

export default LightBg;
