import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            text: string;
            quoteTime: string;
            background: string;
        };
    }
}
