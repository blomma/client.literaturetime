import "./LiteratureTime.css";

export interface LiteratureTimeResult {
    time: string;
    quoteFirst: string;
    quoteTime: string;
    quoteLast: string;
    title: string;
    author: string;
}

export const LiteratureTime = ({
    literatureTime,
}: {
    literatureTime: LiteratureTimeResult;
}) => {
    return (
        <div className="LiteratureTime">
            <div id="main_text">
                <blockquote id="lit_quote">
                    {literatureTime.quoteFirst}
                    <em>{literatureTime.quoteTime}</em>
                    {literatureTime.quoteLast}
                </blockquote>
                <cite>
                    -<span id="book">{literatureTime.title}</span>,
                    <span id="author">{literatureTime.author}</span>
                </cite>
            </div>
        </div>
    );
};
