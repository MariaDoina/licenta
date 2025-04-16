"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const CreateRecipe = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-gray-800 text-center mb-4"
      >
        Your Digital Kitchen
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-lg text-gray-600 max-w-xl text-center mb-12"
      >
        Create perfect recipes with the help of artificial intelligence or add
        and organize your own favorite recipes.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl px-4">
        {/* AI Card */}
        <Link href="/create_recipe/ai">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl shadow-md bg-white p-8 flex flex-col items-center text-center hover:shadow-lg"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 mb-4">
              <Image src="/wand.svg" alt="AI Chef" width={32} height={32} />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Generate with AI
            </h2>
            <p className="text-gray-600 text-md">
              Let AI suggest recipes based on the ingredients you have or your
              culinary preferences.
            </p>
          </motion.div>
        </Link>

        {/* Manual Card */}
        <Link href="/create_recipe/manual">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl shadow-md bg-white p-8 flex flex-col items-center text-center hover:shadow-lg"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 mb-4">
              <Image
                src="/book.svg"
                alt="Manual Recipe"
                width={32}
                height={32}
              />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Add your own recipes
            </h2>
            <p className="text-gray-600 text-md">
              Prefer the classic way? Add your ingredients and instructions step
              by step.
            </p>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default CreateRecipe;
