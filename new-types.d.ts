interface PropertyInfo {
  font: string;
  title: string;
  subTitle: string;
  author: string;
  icon: string;
  color: string;
  devicon: string;
  aspect: string;
  blur: string;
  blurTrans: string;
  logoPosition: string | number;
}
type PropertyInfoPartial = Partial<PropertyInfo>;
type imgType = "jpg" | "png" | string | undefined;
interface UnsplashImgInfo {
  src: string;
  url: string;
  key?: string;
  alt?: string;
  width: number;
  height: number;
  name: string;
  avatar: string;
  profile: string;
  downloadLink?: string;
}
