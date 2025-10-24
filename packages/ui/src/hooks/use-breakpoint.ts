import * as React from "react";

const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

type BreakpointSize = keyof typeof BREAKPOINTS;

type Props = {
    size?: BreakpointSize;
    breakpoint?: number;
};

export function useBreakpoint({ size = "md", breakpoint }: Props = {}) {
    const breakpointValue = breakpoint ?? BREAKPOINTS[size];

    const [matches, setMatches] = React.useState<boolean>(false);

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpointValue - 1}px)`);
        const onChange = () => {
            setMatches(window.innerWidth < breakpointValue);
        };
        mql.addEventListener("change", onChange);
        setMatches(window.innerWidth < breakpointValue);
        return () => mql.removeEventListener("change", onChange);
    }, [breakpointValue]);

    return matches;
}
