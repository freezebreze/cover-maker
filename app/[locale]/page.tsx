"use client";
import React from "react";
import { LeftResourcePanel } from "./LeftResourcePanel";
import { ComponentToImg, ComponentToImgHandle } from "./ComponentToImg";
import { ImageEditor } from "./ImageEditor";
import { RightPropertyPanel } from "./RightPropertyPanel copy";
export default function Home() {
  const [message, setMessage] = React.useState<UnsplashImgInfo>(
    {} as UnsplashImgInfo
  );
  const editRef = React.useRef<ComponentToImgHandle>(null);
  const [propertyInfo, setPropertyInfo] = React.useState<PropertyInfo>({
    font: "",
    title: "",
    subTitle: "",
    author: "Cover Maker",
    icon: "",
    color: "",
    devicon: "",
    aspect: "",
    blur: "",
    blurTrans: "",
    logoPosition: "",
  });
  const onChildData = (data: UnsplashImgInfo) => {
    setMessage(data);
  };

  const onImageDowloadClick = (imgFormat: imgType) => {
    if (editRef.current !== null) {
      editRef.current.downloadImage(imgFormat);
    }
  };

  const onPropInfoChange = (propInfo: PropertyInfo) => {
    setPropertyInfo(propInfo);
  };
  return (
    <div className="flex overflow-x-hidden">
      <div className=" min-w-80 max-w-80">
        <LeftResourcePanel onData={onChildData}></LeftResourcePanel>
      </div>
      <div className=" flex-grow bg-gray-100 overflow-x-hidden">
        <div className="flex justify-center items-center h-full w-full min-w-[800px] px-5">
          <ComponentToImg ref={editRef}>
            <ImageEditor
              message={message}
              propertyInfo={propertyInfo}
            ></ImageEditor>
          </ComponentToImg>
        </div>
      </div>
      <div className=" min-w-80 max-w-80">
        <RightPropertyPanel
          onImageDowloadClick={onImageDowloadClick}
          onPropInfoChange={onPropInfoChange}
        />
      </div>
    </div>
  );
}
