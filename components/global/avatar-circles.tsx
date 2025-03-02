"use client";
import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
const people = [
  {
    id: 1,
    name: "Vaibhav Sarvariya",
    designation: "Software Developer",
    image:
      "/images/vaibhav.jpeg",
  },
  {
    id: 2,
    name: "Rahul Devasi ",
    designation: "Software Developer",
    image:
      "/images/01.jpeg",
  },
  {
    id: 3,
    name: "Yash Vadher",
    designation: "Project Manager",
    image:
    "/images/yash.jpeg",
  },
  {
    id: 4,
    name: "Kumkum Tanwar",
    designation: "UX Designer",
    image:
      "/images/kumkum.jpeg",
  },
  {
    id: 5,
    name: "Priya Singh",
    designation: "The Explorer",
    image:
      "/images/priya.jpeg",
  },
];

export function AnimatedAvatars() {
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
