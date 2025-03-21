import Image from "next/image";

type ButtonProps = {
  type: "button" | "submit";
  title: string;
  icon?: string;
  variant: string;
  className?: string;
  full?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

const Button = ({
  type,
  title,
  icon,
  variant,
  className,
  full,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`cursor-pointer flex items-center gap-3 rounded-full border ${variant} ${className} ${
        full && "w-full"
      }`}
      type={type}
      onClick={onClick}
    >
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <label className="bold-16 whitespace-nowrap cursor-pointer">
        {title}
      </label>
      {children}
    </button>
  );
};

export default Button;
