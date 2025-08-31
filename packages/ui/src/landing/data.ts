import { About01, about01Data } from "./about/index.js";
import {
  Banner01,
  banner01Data,
  Banner02,
  banner02Data,
  Banner03,
  banner03Data,
  Banner04,
  banner04Data,
  Banner05,
  banner05Data,
  Banner06,
  banner06Data,
} from "./banner/index.js";

import { EComponentType } from "./types.js";
import {
  Features01,
  features01Data,
  Features02,
  features02Data,
  Features03,
  features03Data,
  Features04,
  features04Data,
  Features05,
  features05Data,
  Features06,
  features06Data,
} from "./features/index.js";
import { Footer01, footer01Data } from "./footer/index.js";
import { Testimonial01, testimonial01Data } from "./testimonials/index.js";

export const data = [
  {
    category: "Banner",
    components: [
      {
        name: "Banner01",
        component: Banner01,
        defaultValue: banner01Data,
        description:
          "Banner1 is a component that displays a banner with a title, description, and an image.",
        fieldLabel: {
          title: "Title By naimur",
          description: "Description By naimur",
          image: "Image",
          buttonText: "Button Text By Naimur",
          sectionList: {
            title: "Title By naimur",
            description: "Description By naimur",
            image: "Image",
          },
        },
      },
      {
        name: "Banner02",
        component: Banner02,
        defaultValue: banner02Data,
        description:
          "Banner2 is a component that displays a banner with a title, description, and an image.",
      },
      {
        name: "Banner03",
        component: Banner03,
        defaultValue: banner03Data,
        description:
          "Banner3 is a component that displays a banner with a title, description, and an image.",
      },
      {
        name: "Banner04",
        component: Banner04,
        defaultValue: banner04Data,
        description:
          "Banner4 is a component that displays a banner with a title, description, and an image.",
      },
      {
        name: "Banner05",
        component: Banner05,
        defaultValue: banner05Data,
        description:
          "Banner5 is a component that displays a banner with a title, description, and an image.",
      },
      {
        name: "Banner06",
        component: Banner06,
        defaultValue: banner06Data,
        description:
          "Banner6 is a component that displays a banner with a title, description, and an image.",
      },
    ],
  },
  {
    category: "About",
    components: [
      {
        name: "About01",
        component: About01,
        defaultValue: about01Data,
        description:
          "About1 is a component that displays a about with a title, description, and an image.",
      },
    ],
  },
  {
    category: "Features",
    components: [
      {
        name: "Features01",
        component: Features01,
        defaultValue: features01Data,
        description:
          "Features1 is a component that displays a list of features with a title, description, and an image.",
      },
      {
        name: "Features02",
        component: Features02,
        defaultValue: features02Data,
        description:
          "Features2 is a component that displays a list of features with a title, description, and an image.",
      },
      {
        name: "Features03",
        component: Features03,
        defaultValue: features03Data,
        description:
          "Features3 is a component that displays a list of features with a title, description, and an image.",
      },
      {
        name: "Features04",
        component: Features04,
        defaultValue: features04Data,
        description:
          "Features4 is a component that displays a list of features with a title, description, and an image.",
      },
      {
        name: "Features05",
        component: Features05,
        defaultValue: features05Data,
        description:
          "Features5 is a component that displays a list of features with a title, description, and an image.",
      },
      {
        name: "Features06",
        component: Features06,
        defaultValue: features06Data,
        description:
          "Features6 is a component that displays a list of features with a title, description, and an image.",
      },
    ],
  },
  {
    category: "Testimonials",
    components: [
      {
        name: "Testimonial01",
        component: Testimonial01,
        defaultValue: testimonial01Data,
        description:
          "Testimonial1 is a component that displays a testimonial with a title, description, and an image.",
      },
    ],
  },
  {
    category: "Footer",
    components: [
      {
        name: "Footer01",
        component: Footer01,
        defaultValue: footer01Data,
        description:
          "Footer1 is a component that displays a footer with a title, description, and an image.",
      },
    ],
  },
];

export const allComponentsTypeOptions = [
  {
    id: "banner",
    title: "Banner",
    description:
      "A prominent strip that highlights important announcements or promotions.",
    color: "bg-purple-100",
    iconColor: "text-purple-500",
    type: EComponentType.BANNER,
  },
  {
    id: "about",
    title: "About",
    description: "A section that introduces your company, team, or product.",
    color: "bg-blue-100",
    iconColor: "text-blue-500",
    type: EComponentType.ABOUT,
  },
  {
    id: "features",
    title: "Features",
    description:
      "Highlight the key features and benefits of your product or service.",
    color: "bg-red-100",
    iconColor: "text-red-500",
    type: EComponentType.FEATURES,
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description:
      "Social proof from satisfied customers to build trust with potential customers.",
    color: "bg-indigo-100",
    iconColor: "text-indigo-500",
    type: EComponentType.TESTIMONIALS,
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Clear pricing information for your products or services.",
    color: "bg-pink-100",
    iconColor: "text-pink-500",
    type: EComponentType.PRICING,
  },
  {
    id: "faq",
    title: "FAQ",
    description:
      "Answers to common questions to help users make informed decisions.",
    color: "bg-teal-100",
    iconColor: "text-teal-500",
    type: EComponentType.FAQ,
  },
  {
    id: "cta",
    title: "CTA",
    description:
      "Call-to-action sections that encourage users to take the next step.",
    color: "bg-orange-100",
    iconColor: "text-orange-500",
    type: EComponentType.CTA,
  },
  {
    id: "footer",
    title: "Footer",
    description:
      "The bottom section of your website with important links and information.",
    color: "bg-cyan-100",
    iconColor: "text-cyan-500",
    type: EComponentType.FOOTER,
  },
];
