// import { LucideIcon } from "lucide-react";
import { UrlObject } from "url";

export interface ComponentProps {
  data?: Section;
  Link?: React.ComponentType<
    React.ComponentProps<"a"> & { href: string | UrlObject }
  >;
  Image?: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>;
}

export type QueryParams = {
  [key: string]: string | string[] | number | undefined;
};

export type Section = {
  id: string;
  componentName: string;
  title?: string;
  subTitle?: string;
  imgURL?: string;
  bgURL?: string;
  description?: string;
  customizeDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
  index: number;
  createdAt: Date;
  updatedAt: Date;
  sectionType: EComponentType;
  sectionList: SectionList[];
};

export interface SectionList {
  id: string;
  title?: string;
  subTitle?: string;
  imgURL?: string;
  bgURL?: string;
  icon?: any;
  description?: string;
  customizeDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
  booleanValue?: boolean;
  sectionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EComponentType {
  BANNER = "BANNER",
  ABOUT = "ABOUT",
  FEATURES = "FEATURES",
  FAQ = "FAQ",
  BLOG = "BLOG",
  TESTIMONIALS = "TESTIMONIALS",
  TIMELINE = "TIMELINE",
  PRICING = "PRICING",
  CTA = "CTA",
  CONTACT = "CONTACT",
  FOOTER = "FOOTER",
  OTHER = "OTHER",
}

export interface Component {
  id: string;
  name: string;
  imgURL: string;
  type: EComponentType;
  requiredFiledId: string;
  requiredFiled: {
    title: string;
    subTitle: string;
    description: string;
    componentName: string;
    sectionType: string;
    customizeDescription: string;
    index: number;
    buttonText: string;
    buttonUrl: string;
    imgURL: string;
    shopId: null | string;
    bgURL: string;
    sectionList: {
      title: string;
      subTitle: string;
      description: string;
      customizeDescription: string;
      buttonText: string;
      buttonUrl: string;
      imgURL: string;
      bgURL: string;
      booleanValue: boolean;
    }[];
  };
}

export interface ComponentData {
  name: string;
  component: React.ComponentType<{ data: Section }>;
  category: string;
  description: string;
  fieldLabel?: string | unknown;
  defaultValue?: Section;
}
