import React from "react";
import classNames from "classnames";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  return (
    <span
      className={classNames(
        "inline-block px-3 py-1 text-sm rounded-full font-medium bg-gray-100 text-gray-800",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
