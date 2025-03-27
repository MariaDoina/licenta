import { motion } from "framer-motion";

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
        <ul className="mt-5 leading-loose">
          <li>
            ✔ Input Your Ingredients – Just enter what you have on hand, and let
            our AI do the rest.
          </li>
          <li>
            ✔ Generate a Recipe – Watch as our AI crafts a detailed,
            step-by-step recipe tailored to your ingredients.
          </li>
          <li>
            ✔ Visualize Your Dish – Get a mouth-watering, AI-generated image to
            see what’s cooking before you even start.
          </li>
          <li>
            ✔ Cook & Enjoy – Follow the recipe and savor a delicious, customized
            meal!
          </li>
        </ul>
      </div>
    </section>
  );
};

export default HowToUse;
