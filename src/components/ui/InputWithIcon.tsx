import Image from "next/image";

interface InputWithIconProps {
  iconSrc: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
}

export default function InputWithIcon({
  iconSrc,
  value,
  onChange,
  placeholder,
  type = "text",
}: InputWithIconProps) {
  return (
    <div className="relative">
      <Image
        src={iconSrc}
        alt="input-icon"
        width={20}
        height={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
      />

      <input
        className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
