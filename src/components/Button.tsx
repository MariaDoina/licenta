import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

type ButtonProps = {
  type: "button" | "submit";
  title: string;
  icon?: string;
  variant: string;
  className?: string;
  full?: boolean;
  href?: string; // Adăugat href
  onClick?: () => void;
  children?: React.ReactNode;
  loading?: boolean;
};

const Button = ({
  type,
  title,
  icon,
  variant,
  className,
  full,
  href,
  onClick,
  children,
  loading,
}: ButtonProps) => {
  const buttonContent = (
    <button
      className={`cursor-pointer flex items-center gap-2  border ${variant} ${className} ${
        full && "w-full"
      }`}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading && <LoadingSpinner size="sm" />}
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <label className="bold-16 whitespace-nowrap cursor-pointer">
        {title}
      </label>
      {children}
    </button>
  );

  // Dacă există un href, redirecționează cu Link
  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
};

export default Button;
