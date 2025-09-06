"use client";

import ImageModal from "@/features/products/ImageModal";
import { Product } from "@/types/product-type";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  Droplet,
  Facebook,
  FlaskRoundIcon as Flask,
  HomeIcon,
  Instagram,
  Leaf,
  Linkedin,
  Package,
  Scissors,
  Shirt,
  Star,
  Twitter,
  User,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { label: "Makeup", Icon: Package },
  { label: "Skincare", Icon: Shirt },
  { label: "Haircare", Icon: Scissors },
  { label: "Fragrances", Icon: Flask },
  { label: "Bath & Body", Icon: Droplet },
  { label: "Men's Grooming", Icon: User },
  { label: "Beauty Tools & Accessories", Icon: Wrench },
  { label: "Wellness & Self-Care", Icon: Leaf },
];

const socialLinks = [
  { href: "#", Icon: Facebook, color: "hover:text-blue-600" },
  { href: "#", Icon: Twitter, color: "hover:text-blue-400" },
  { href: "#", Icon: Instagram, color: "hover:text-pink-600" },
  { href: "#", Icon: Linkedin, color: "hover:text-blue-700" },
];

export const ProductDetailPage = ({ product }: { product?: Product }) => {
  console.log("product", product);
  // console.log("product.categories :>> ", product?.categories);
  const images = [
    "http://multi-media-server.naimurrhman.com/uploads/img/1744627430617-339961119.jpg",
    "http://multi-media-server.naimurrhman.com/uploads/img/1744566154755-14651985.jpg",
    "http://multi-media-server.naimurrhman.com/uploads/img/1745580373811-76572101.jpg",
    "http://multi-media-server.naimurrhman.com/uploads/img/1744566154755-14651985.jpg",
    "http://multi-media-server.naimurrhman.com/uploads/img/1745580373811-76572101.jpg",
  ];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const sizes = ["200ml", "50ml", "300ml", "500ml"];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  return (
    <div className="container mx-auto px-4  md:px-6 ">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px]">
        {/* Main Product Content */}
        <div>
          {/* Breadcrumb */}
          <nav className="my-5">
            <ol className="flex items-center space-x-1">
              <li className="flex items-center gap-1 hover:text-purple-600">
                <HomeIcon className="w-5 text-purple-600" />
                <Link href="/">Home</Link>
              </li>
              <li>
                <span className="mx-1">/</span>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600">
                  {product?.slug}
                </Link>
              </li>
              <li>
                <span className="mx-1">/</span>
              </li>
              <li>{product?.name}</li>
            </ol>
          </nav>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid gap-4">
              {/* Main Image */}

              <ImageModal selectedImage={selectedImage} />

              {/* Thumbnails */}
              <div className="flex gap-2 pb-2">
                {images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Product thumbnail ${index + 1}`}
                    width={90}
                    height={90}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square h-24 w-24 p-2 cursor-pointer rounded-sm object-cover transition ring-offset-2 ${
                      selectedImage === img
                        ? "ring-1 ring-gray-300"
                        : "ring-1 ring-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-semibold md:text-2xl">
                {product?.name}
              </h1>
              <div className="text-sm flex flex-col gap-3 text-muted-foreground">
                <p>
                  <span className="font-semibold text-lg text-foreground">
                    Category:
                  </span>{" "}
                  {product?.slug}
                </p>
                <p>
                  <span className="font-semibold text-lg text-foreground">
                    Warranty:
                  </span>{" "}
                  {product?.warranty}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-muted stroke-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  (1 Reviews)
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-purple-600">
                  {product?.discountPrice}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {" "}
                  ৳{product?.price}৳
                </span>
              </div>
              <div className=" flex gap-5 text-base text-muted-foreground">
                <p>
                  <span className="font-medium text-base text-foreground">
                    Total:
                  </span>{" "}
                  {product?.stock}
                </p>
                <p>
                  <span className="font-medium text-foreground">Sold:</span> 5
                </p>
              </div>
              <p className="text-sm font-medium text-green-700">In Stock</p>
              <p className="text-base mb-1 leading-relaxed lineheight-6 ">
                {product?.description}
              </p>
              <hr className="my-2" />

              {/* Size Selection */}
              <div className="flex gap-3">
                <Label className="text-base">Size :</Label>

                {sizes.map((size) => (
                  <Label
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex cursor-pointer items-center justify-center rounded-sm border px-4 py-2 text-sm font-medium transition-colors
                    hover:bg-accent hover:text-accent-foreground
            ${
              selectedSize === size
                ? "bg-[#7922E6] text-white"
                : "bg-transparent text-black"
            }`}
                  >
                    {size}
                  </Label>
                ))}
              </div>

              {/* Color Selection */}
              <div className="flex gap-2">
                <Label htmlFor="color" className="text-base">
                  Color
                </Label>

                <Label
                  htmlFor="color-rose-pink"
                  className="flex cursor-pointer bg-[#7922E6] text-white items-center rounded-sm justify-center  border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:bg-primary [&:has(:checked)]:text-primary-foreground"
                >
                  Rose Pink
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button className="flex-1 bg-[#7922E6] hover:bg-[#7922E6] cursor-pointer text-white">
                  Add To Cart
                </Button>
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                  Buy Now
                </Button>
              </div>

              {/* Social Media Share */}
              <div>
                <p className="text-base mb-2 ">Share Social Media:-</p>
                <div className="flex gap-3 ">
                  {socialLinks.map(({ href, Icon, color }) => (
                    <Link
                      key={href + Icon.name}
                      href={href}
                      className={`text-gray-600 ${color} bg-[#7922E6] text-white p-3 rounded-full`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8 my-6">
          {/* Related Products */}
          <div className="border p-5 shadow-lg  rounded-lg">
            <h2 className="text-xl  font-semibold">Related Products</h2>
            <div className="my-3 h-1 w-16 bg-purple-600"></div>

            <div className="flex gap-4">
              <Image
                src={product?.photoURL || ""}
                alt="FOCALLURE Skin Evolution Liquid Foundation"
                width={60}
                height={40}
                className="aspect-square w-20 h-20 border p-2   object-cover"
              />
              <div className="grid ">
                <h3 className="text-base">FOCALLURE Skin Evolution</h3>
                <p className="text-lg font-semibold text-purple-600">৳400</p>
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <Star className="h-3 w-3 fill-muted stroke-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    (1 Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border p-5 shadow-lg  rounded-lg">
            <h2 className="text-xl  font-semibold">Categories</h2>
            <div className="my-3 h-1 w-16 bg-purple-600"></div>
            <div className="grid gap-2">
              {categories.map(({ label, Icon }) => (
                <Link
                  key={label}
                  href="#"
                  className="flex items-center gap-3   p-4 hover:bg-accent border-b last:border-b-0"
                >
                  <Icon className="h-7 w-7  text-[#7922E6]" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
