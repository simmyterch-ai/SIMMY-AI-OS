import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-5
        py-2.5
        text-sm
        font-semibold
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2
          size={16}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}