import { cn } from "@/lib/utils";
import { Marquee } from "./magicui/marquee";
import Link from "next/link";
import Image from "next/image";
import { ProjectWithUser } from "@/types/types";

const Card = ({
  img,
  name,
  slug
}: {
  img: string;
  name: string;
  slug:string
}) => {
  return (
    <Link href ={`/public/project/${slug}`}
      className={cn(
        "relative h-full w-96 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
  >
     <Image src={img} alt="" width={1080} height={1080} className ="w-full" />
      <blockquote className="mt-2 text-sm">{name}</blockquote>
    </Link>
  );
};

export function OtherPortfolioProjects({otherProjects}: {otherProjects:ProjectWithUser[]}) {
  return (
    <div className="dark:bg-[#121212]  relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="max-w-2xl mx-auto">
      <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight lg:text-5xl">
        My Other Projects
      </h1>
      <p className="leading-7  [&:not(:first-child)]:mt-6">
        These are some of my other Projects.
      </p>
      </div>
      <Marquee pauseOnHover className="[--duration:10s]">
        {otherProjects.map((project) => (
          <Card key={project.id} img = {project?.thumbnail??""} name={project.name} slug={project.slug} />
        ))}
      </Marquee>
      {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <Card key={review.username} {...review} />
        ))}
      </Marquee> */}
      
    </div>
  );
}
