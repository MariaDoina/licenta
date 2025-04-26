"use client";
import { motion } from "framer-motion";

import CreateRecipeForm from "@/components/forms/CreateRecipeForm";

export default function CreateRecipe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Recipe Oasis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Create and save your favorite recipes in one place. Share with
            friends or keep them as your culinary secrets.
          </motion.p>
        </div>

        {/* Include CreateRecipeForm component here */}
        <CreateRecipeForm />
      </div>
    </div>
  );
}
