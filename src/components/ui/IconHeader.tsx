import Image from "next/image";

interface IconHeaderProps {
  iconSrc: string;
  title: string;
  description: string;
  alt: string;
}

export default function IconHeader({
  iconSrc,
  title,
  description,
  alt,
}: IconHeaderProps) {
  return (
    <div className="text-center mb-6">
      <div className="flex justify-center mb-4">
        <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
          <Image src={iconSrc} alt={alt} width={100} height={50} />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{title}</h1>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
