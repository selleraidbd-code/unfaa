import type { NextPage } from "next";
import Image from "next/image";

import NotFoundImage from "@/assets/images/img-404.png";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

const NotFoundPage: NextPage = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute left-1/2 top-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 transform items-center justify-center text-center">
        <div className="w-[600]">
          <Image
            src={NotFoundImage}
            alt="404 Not Found"
            height={282}
            width={570}
          />
          <h1 className="mt-4 text-3xl md:text-[40px]">Page Not Found</h1>
          <p className="mt-1 text-sm md:text-base">
            {"The page you are looking for couldn't be found."}
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Go Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
