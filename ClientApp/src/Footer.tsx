import { Github } from "@icons-pack/react-simple-icons";
import styled from "styled-components";

const StyledFooterContainer = styled.div`
    display: flex;
    justify-content: center;
    color: ${(props) => props.theme.colors.text};
`;

const StyledFooter = styled.footer`
    display: flex;
    justify-content: center;

    width: 70vw;
    padding-top: 10vw;
    font-size: 1.1vw;
`;

const StyledFooterLink = styled.a`
    color: inherit;
    text-decoration: none;
`;

export const Footer = () => {
    return (
        <StyledFooterContainer>
            <StyledFooter>
                <StyledFooterLink href="https://github.com/blomma/client.literaturetime">
                    <Github title="github" />
                </StyledFooterLink>
            </StyledFooter>
        </StyledFooterContainer>
    );
};
