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

interface RecipeCardProps {
  href: string;
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
}

const RecipeCard = ({
  href,
  imageSrc,
  altText,
  title,
  description,
}: RecipeCardProps) => {
  return (
    <Link href={href}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="rounded-2xl shadow-md bg-white p-8 flex flex-col items-center text-center hover:shadow-lg"
      >
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 mb-4">
          <Image src={imageSrc} alt={altText} width={32} height={32} />
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-md">{description}</p>
      </motion.div>
    </Link>
  );
};

export default RecipeCard;
