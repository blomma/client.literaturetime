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
}) => (
    <div className="App">
        <header className="App-header">
            <p>{literatureTime?.time}</p>
            <p>{literatureTime?.quoteFirst}</p>
            <p>{literatureTime?.quoteTime}</p>
            <p>{literatureTime?.quoteLast}</p>
            <p>{literatureTime?.title}</p>
            <p>{literatureTime?.author}</p>
        </header>
    </div>
);
