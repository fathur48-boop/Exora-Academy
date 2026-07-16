const VARIANTS = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-ink",
};

export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button className={`${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
