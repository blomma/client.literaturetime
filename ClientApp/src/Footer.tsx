import Github from "./github.svg?react";

import "./Footer.css";

export const Footer = () => {
    return (
        <div className="styledFooterContainer">
            <footer>
                <a
                    href="https://github.com/blomma/client.literaturetime"
                    aria-label="Project at github"
                >
                    <Github
                        title="github"
                        fill="currentColor"
                        width={24}
                        height={24}
                    />
                </a>
            </footer>
        </div>
    );
};
