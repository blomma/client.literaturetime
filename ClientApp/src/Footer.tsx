import { SiGithub } from "@icons-pack/react-simple-icons";

import "./Footer.css";

export const Footer = () => {
    return (
        <div className="styledFooterContainer">
            <footer>
                <a href="https://github.com/blomma/client.literaturetime">
                    <SiGithub title="github" />
                </a>
            </footer>
        </div>
    );
};
