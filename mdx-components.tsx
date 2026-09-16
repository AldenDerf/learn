import { Footer, useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import { Callout } from "nextra/components";
import type { MDXComponents } from "nextra/mdx-components";

const themeComponents = getThemeComponents();
const ThemeWrapper = themeComponents.wrapper;

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...themeComponents,
        wrapper(props) {
            // Keep the footer inside Nextra's article so the sidebar's sticky
            // container extends through the end of the reading column.
            const isWebSystems = /(?:^|\/)web-systems\//.test(
                props.metadata.filePath.replaceAll("\\", "/")
            );
            return (
                <ThemeWrapper
                    {...props}
                    bottomContent={
                        <>
                            {props.bottomContent}
                            {isWebSystems ? (
                                <Footer className="x:text-sm">Learn by AldenDerf</Footer>
                            ) : null}
                        </>
                    }
                />
            );
        },
        Callout,
        ...components
    }
}
