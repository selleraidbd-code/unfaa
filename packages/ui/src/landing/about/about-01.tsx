import { ComponentProps } from "@workspace/ui/landing/types.js";

export const About01 = ({ data, Image }: ComponentProps) => {
  const ImageComponent = Image || "img";
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl  text-primary font-bold tracking-tighter sm:text-5xl">
              {data?.title}
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {data?.subTitle}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <ImageComponent
            src="http://multi-media-server.naimurrhman.com/uploads/img/1745854643956-518310540.jpg"
            width={400}
            height={400}
            alt="Designer Portrait"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Hi, I'm Alex</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                With over 5 years of experience in UX/UI design, I specialize in
                creating user-centered digital experiences that are both
                beautiful and functional. My approach combines strategic
                thinking with creative problem-solving to deliver designs that
                exceed expectations.
              </p>
              <p className="text-gray-500 md:text-lg/relaxed">
                I'm proficient in industry-standard tools including Figma, Adobe
                XD, Sketch, and Webflow, and I'm constantly expanding my
                skillset to stay at the forefront of design innovation.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Career Highlights</h3>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span className="text-gray-500">
                    Led UX redesign for a SaaS platform, increasing user
                    engagement by 40%
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span className="text-gray-500">
                    Designed mobile app interfaces for Fortune 500 clients
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span className="text-gray-500">
                    Created design systems that improved team efficiency by 30%
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
