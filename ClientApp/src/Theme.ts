import { createGlobalStyle, DefaultTheme } from "styled-components";

export const DarkTheme: DefaultTheme = {
    colors: {
        text: "rgb(237, 230, 138)",
        quoteTime: "rgb(170, 150, 183)",
        background: "rgb(47, 48, 50)",
    },
};

export const LightTheme: DefaultTheme = {
    colors: {
        text: "dimgrey",
        quoteTime: "rgb(231, 111, 81)",
        background: "rgb(254, 252, 243)",
    },
};

export const GlobalStyle = createGlobalStyle`
    body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: "Merriweather", Times, serif;
        background-color: ${(props) => props.theme.colors.background};
    }
`;
