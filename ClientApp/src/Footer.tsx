import "./Footer.css";
import { Github } from "@icons-pack/react-simple-icons";

export const Footer = () => {
    return (
        <div className="footer">
            <footer id="lit_footer">
                <a href="https://github.com/blomma/client.literaturetime">
                    <Github title="github" />
                </a>
            </footer>
        </div>
    );
};
