"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 dark:bg-[#0F172A] z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DotLottieReact
        src="https://lottie.host/d83527dd-bb3f-4355-98f2-cdcfce526950/Oy6LSUx5JT.lottie"
        loop
        autoplay
        style={{ width: 400, height: 400 }}
      />
    </motion.div>
  );
};

export default Loader;
