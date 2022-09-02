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
        <>
            <div className="quote">
                <blockquote id="lit_quote">
                    {literatureTime.quoteFirst}
                    <em>{literatureTime.quoteTime}</em>
                    {literatureTime.quoteLast}
                </blockquote>
            </div>
            <div className="cite">
                <cite id="lit_cite">
                    -<span id="book">{literatureTime.title}</span>,
                    <span id="author">{literatureTime.author}</span>
                </cite>
            </div>
        </>
    );
};

export const LiteratureTimeMissing = () => {
    return (
        <>
            <div className="quote">
                <blockquote id="lit_quote">
                    “Time is an illusion. Lunchtime doubly so.”
                </blockquote>
            </div>
            <div className="cite">
                <cite id="lit_cite">
                    -<span id="book">The Hitchhiker's Guide to the Galaxy</span>
                    ,<span id="author">Douglas Adams</span>
                </cite>
            </div>
        </>
    );
};
