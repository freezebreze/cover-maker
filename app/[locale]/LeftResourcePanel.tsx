"use client";
import React, { ChangeEvent } from "react";
import {
  Input,
  ListboxItem,
  Chip,
  ScrollShadow,
  Avatar,
  AvatarIcon,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Spinner,
  Button,
} from "@nextui-org/react";
import unsplash from "./unsplashConfig";
import PhotoAlbum from "react-photo-album";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslations } from "next-intl";
import { Logo } from "./Logo";
import { SearchIcon } from "./SearchIcon";
const PHOTO_SPACING = 8;
const KEY_CODE_ENTERN = 13;
const PHOTO_COUNT_PER_PAGE = 30;
const TARGET_ROW_HEIGHT = 110;
const ROW_CONSTRAINTS = { maxPhotos: 2 };
interface LeftResourcePanelProps {
  onData: (data: UnsplashImgInfo) => any;
}

export const LeftResourcePanel = (props: LeftResourcePanelProps) => {
  const t = useTranslations("default.LeftResourcePanel");
  const [imageList, setImageList] = React.useState<UnsplashImgInfo[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [isNeedRandomPhoto, setIsNeedRandomPhoto] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [unsplashPage, setUnsplashPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [hasSetFirstRandomPhoto, setHasSetFirstRandomPhoto] =
    React.useState(false);
  const [windowHeight, setWindowHeight] = React.useState(0);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0] != null) {
      console.log(event.target.files);
      const file = URL.createObjectURL(event.target.files[0]);
      props.onData({
        url: file,
        name: "Cover Maker",
        avatar: "default-author.jpg",
        profile: "default",
        downloadLink: "",
        src: "",
        width: 0,
        height: 0,
      });
    }
  };

  const searchImages = (searchText: string = "dev", pageNum: number = 1) => {
    unsplash.search
      .getPhotos({
        query: searchText,
        page: pageNum,
        perPage: PHOTO_COUNT_PER_PAGE,
      })
      .then((result) => {
        if (result.type === "success") {
          let photos: UnsplashImgInfo[] = result.response.results.map(
            (item) => {
              return {
                src: item.urls.small,
                url: item.urls.regular,
                key: item.id,
                alt: item.alt_description ?? "",
                width: item.width,
                height: item.height,
                name: item.user.name,
                avatar: item.user.profile_image.small,
                profile: `${item.user.links.html}?utm_source=PicProse&utm_medium=referral`,
              };
            }
          );
          if (photos.length < PHOTO_COUNT_PER_PAGE) {
            setHasMore(false);
          }
          if (pageNum == 1) {
            setImageList(photos);
          } else {
            setImageList([...imageList, ...photos]);
          }
        }
      });
  };

  const fetchRandomPhotos = () => {
    unsplash.photos
      .getRandom({
        count: PHOTO_COUNT_PER_PAGE,
      })
      .then((result) => {
        var photos = result.response
          ? (result.response as any[]).map((item) => {
              return {
                src: item.urls.small,
                url: item.urls.regular,
                key: item.id,
                alt: item.alt_description,
                width: item.width,
                height: item.height,
                name: item.user.name,
                avatar: item.user.profile_image.small,
                profile: `${item.user.links.html}?utm_source=PicProse&utm_medium=referral`,
              };
            })
          : [];
        if (photos.length < PHOTO_COUNT_PER_PAGE) {
          setHasMore(false);
        }
        if (!hasSetFirstRandomPhoto) {
          setHasSetFirstRandomPhoto(true);
          selectImage(Math.floor(Math.random() * 20), photos);
        }
        setImageList([...imageList, ...photos]);
      });
  };

  const inputImage = () => {
    if (!inputRef.current) return false;
    inputRef.current.click();
  };
  const selectImage = (index: number, imageList: UnsplashImgInfo[]) => {
    props.onData(imageList[index]);
  };
  const onSearchKeydown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KEY_CODE_ENTERN) {
      fetchImage();
    }
  };

  const fetchImage = () => {
    if (searchValue === "") {
      return;
    }

    setIsNeedRandomPhoto(false);
    setHasMore(true);
    const pageNum = 1;
    setUnsplashPage(pageNum);
    searchImages(searchValue, pageNum);
  };

  const onScrollToBottom = () => {
    if (isNeedRandomPhoto) {
      // fetch more random image
      fetchRandomPhotos();
    } else {
      // search more image
      const pageNum = unsplashPage + 1;
      setUnsplashPage(pageNum);
      searchImages(searchValue, pageNum);
    }
  };

  React.useEffect(() => {
    setWindowHeight(window.innerHeight);

    fetchRandomPhotos();

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 清除事件监听器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className=" w-full flex flex-col h-screen">
      <Navbar
        classNames={{
          wrapper: "px-4",
        }}
      >
        <NavbarBrand>
          <Logo></Logo>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Avatar
              isBordered
              src="https://avatars.githubusercontent.com/u/65845619?v=4"
            ></Avatar>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex-grow relative">
        <InfiniteScroll
          dataLength={imageList.length}
          loader={
            <div className="grid justify-items-center ">
              <Spinner className="my-4" />
            </div>
          }
          height={windowHeight - 130}
          next={onScrollToBottom}
          hasMore={hasMore}
          endMessage={
            <div className="grid justify-items-center ">
              <div className="my-4">{t("search_end")}</div>
            </div>
          }
        >
          <PhotoAlbum
            photos={imageList}
            layout="rows"
            targetRowHeight={TARGET_ROW_HEIGHT}
            rowConstraints={ROW_CONSTRAINTS}
            spacing={PHOTO_SPACING}
            onClick={({ index }) => selectImage(index, imageList)}
          />
        </InfiniteScroll>
        <div className="absolute bottom-0 left-0 m-4 w-40 h-6 bg-black bg-opacity-65  rounded-xl">
          <div className="flex items-center ml-2">
            <span className="leading-6 text-xs text-white text-center">
              {t("powered_by")}
            </span>
            <a
              href="https://unsplash.com/?utm_source=PicProse&utm_medium=referral"
              target="_blank"
            >
              <img className="w-20 h-4" src="./Unsplash_Logo_Full.svg" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Navbar
          classNames={{
            wrapper: "px-4",
          }}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={inputRef}
          />
          <Button
            variant="flat"
            color="primary"
            isIconOnly
            onClick={inputImage}
          >
            <svg
              className="w-5 h-5 text-[#2F6EE7] dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.3"
                d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2M12 4v12m0-12 4 4m-4-4L8 8"
              />
            </svg>
          </Button>
          <Input
            type="search"
            placeholder={t("input_search")}
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={(e) => onSearchKeydown(e)}
          />

          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                isIconOnly
                variant="flat"
                color="primary"
                onClick={() => {
                  fetchImage();
                }}
              >
                <SearchIcon className="text-[#2F6EE7] mb-0.5 dark:text-white/90 text-slate-450 pointer-events-none flex-shrink-0" />
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </div>
    </div>
  );
};
