import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import { Callout } from "nextra/components";
import type { MDXComponents } from "nextra/mdx-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...getThemeComponents(),
        Callout,
        ...components
    }
}
