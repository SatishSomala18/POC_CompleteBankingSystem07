import React from "react";

/* Reusable NexaBank monogram mark - replaces plain "colored circle + icon"
   placeholders across the app with a single consistent, polished logo. */
function BrandLogo({ size = 40, rounded = "circle" }) {
    const radius = rounded === "circle" ? "50%" : "12px";

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            style={{ borderRadius: radius, flexShrink: 0 }}
        >
            <defs>
                <linearGradient id="nbLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6d28d9" />
                    <stop offset="55%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
            </defs>
            <rect width="40" height="40" rx={rounded === "circle" ? 20 : 10} fill="url(#nbLogoGradient)" />
            <path
                d="M12 28V12h3.2l9.6 11.4V12H28v16h-3.2l-9.6-11.4V28H12z"
                fill="#fff"
            />
            <circle cx="29.5" cy="11.5" r="3" fill="#f59e0b" />
        </svg>
    );
}

export default BrandLogo;
