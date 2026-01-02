// src / components / Button.jsx
const Button = ({
  text,
  children,
  onClick = () => {},
  className = "",
  type = "button",
  variant = "primary",
  disabled = false,
  noHover = false,
  loading = false,
  href = null,
  size = "md",
}) => {
  const variants = {
    primary: "bg-primary text-white border border-primary",
    secondary: "bg-white text-black border border-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const hoverClasses =
    !noHover &&
    (variant === "primary"
      ? "hover:bg-hover hover:border-none"
      : "hover:bg-gray-50");

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-md transition-all
    cursor-pointer hover:rounded-full
    ${variants[variant]}
    ${sizes[size]}
    ${hoverClasses}
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  const spinnerColor = variant === "primary" ? "border-white" : "border-black";

  const content = loading ? (
    <span
      className={`animate-spin border-2 border-t-transparent ${spinnerColor} rounded-full w-4 h-4`}
    />
  ) : (
    children || text
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        onClick={!disabled && !loading ? onClick : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onClick : undefined}
      className={baseClasses}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;
