"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DotLottieReact
        src="https://lottie.host/b6fbb18c-4b67-44c2-b427-55a3520487a2/4F1TNVGGTN.lottie"
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
    </motion.div>
  );
};

export default Loader;
