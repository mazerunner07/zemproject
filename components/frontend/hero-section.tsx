import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SmallTitle from "./small-title";
import Link from "next/link";
import { CustomLinkButton } from "../global/CustomLinkButton";
import StarRating from "../global/StarRating";
import { AnimatedAvatars } from "../global/avatar-circles";
import { getKitUsers } from "@/actions/users";

export default async function HeroSection() {
  const count = (await getKitUsers()) ?? 0;
  return (
    <section className="relative min-h-[100vh] w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <SmallTitle title=" Welcome to Zem Project" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
          Manage Projects & Clients effortlessly, from concept to completion.
        </h1>

        <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-lg">
          Our comprohesive Project Management System streamlines your workflows, empowering teams to collabrate effiectively and deliver results on time. Start boosting your productivity today.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full h-12 px-6 text-base"
          >
            {/* <Link href="https://coding-school-typescript.vercel.app/give-away">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link> */}
          </Button>
          <CustomLinkButton title="Start a Free Trial" href="/pages" />
          {/* <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-6 text-base"
          >
            <Link href="/pages">
              {" "}
              Explore Page sections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button> */}
        </div>
        <div className="pt-8 pb-4 flex items-center  justify-center gap-8">
          <div className="">
            <AnimatedAvatars />
          </div>
          <div className="">
            <StarRating count={5} />
            <p className="dark:text-slate-900">500+ teams delivering projects faster</p>
          </div>
        </div>
      </div>
    </section>
  );
}
