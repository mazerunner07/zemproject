"use client"; // ✅ Mark it as a Client Component

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SmallTitle from "./small-title";
import Link from "next/link";
import { CustomLinkButton } from "../global/CustomLinkButton";
import StarRating from "../global/StarRating";
import { AnimatedAvatars } from "../global/avatar-circles";

interface HeroSectionProps {
  count: number;
}

export default function HeroSection({ count }: HeroSectionProps) {
  return (
    <section className="relative min-h-[100vh] w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <SmallTitle title="Welcome to Zem Project" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
          Manage Projects & Clients effortlessly, from concept to completion.
        </h1>

        <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-lg">
          Our comprehensive Project Management System streamlines your workflows, empowering teams to collaborate effectively and deliver results on time. Start boosting your productivity today.
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
        </div>

        <div className="pt-8 pb-4 flex items-center justify-center gap-8">
          <div>
            <AnimatedAvatars />
          </div>
          <div>
            <StarRating count={5} />
            <p className="dark:text-slate-900">
              Building success, one project at a time. {count} users onboarded!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
