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
          Turn your kitchen into a gourmet haven with SmartBite! Whether you
          prefer generating personalized recipes with the power of AI or
          crafting your own from scratch, SmartBite gives you the freedom to
          cook your way. Just enter the ingredients you have or write your own
          recipe—perfect for both beginners and seasoned chefs. Say goodbye to
          food waste and hello to endless culinary inspiration!
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
            "✔ Input Your Ingredients – Enter what you have on hand or write your own recipe from scratch.",
            "✔ Generate a Recipe – Watch as our AI crafts a detailed, step-by-step recipe tailored to your ingredients, or take full control and write your own.",
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
