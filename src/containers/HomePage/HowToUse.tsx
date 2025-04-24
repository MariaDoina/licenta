"use client";
import { motion } from "framer-motion";

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const HowToUse = () => {
  return (
    <section className="max-container padding-container flex flex-col p-10 xl:px-30">
      <div>
        <p className="text-xl pb-5">
          Turn your kitchen into a gourmet haven with SmartBite! Simply enter
          the ingredients you have, and our advanced AI will craft delicious,
          personalized recipes just for you. Whether you're a beginner or a
          seasoned chef, SmartBite makes cooking effortless and fun. Say goodbye
          to food waste and hello to endless culinary inspiration!
        </p>
      </div>

      <div>
        <h1 className="text-3xl font-bold">How To Use</h1>
        <hr className="text-gray-500" />

        <motion.ul
          className="mt-5 leading-loose space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={listVariants}
        >
          {[
            "✔ Input Your Ingredients – Just enter what you have on hand, and let our AI do the rest.",
            "✔ Generate a Recipe – Watch as our AI crafts a detailed, step-by-step recipe tailored to your ingredients.",
            "✔ Visualize Your Dish – Get a mouth-watering, AI-generated image to see what’s cooking before you even start.",
            "✔ Cook & Enjoy – Follow the recipe and savor a delicious, customized meal!",
          ].map((text, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.7 }}
            >
              {text}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default HowToUse;
