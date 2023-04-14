import { Fragment, useEffect } from "react";
import { Status } from "./Models/State";
import {
    useLiteratureTimeApi,
    useLiteratureTimeState,
} from "./LiteratureTimeProvider";

import "./LiteratureTime.css";

export const LiteratureTime = () => {
    const state = useLiteratureTimeState();
    const { getLiteratureTime } = useLiteratureTimeApi();

    useEffect(() => {
        var date = new Date();
        let hour = `${date.getHours()}`.padStart(2, "0");
        let minute = `${date.getMinutes()}`.padStart(2, "0");

        getLiteratureTime(hour, minute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (state.status === Status.Error)
        return (
            <>
                <div className="styledQuoteContainer">
                    <blockquote>
                        “Time is an illusion. Lunchtime doubly so.”
                    </blockquote>
                </div>
                <div className="styledCiteContainer">
                    <cite>
                        -
                        <span className="book">
                            The Hitchhiker's Guide to the Galaxy
                        </span>
                        ,<span className="author">Douglas Adams</span>
                    </cite>
                </div>
            </>
        );

    if (state.status === Status.Loading) return <></>;
    if (state.status === Status.Pending) return <></>;

    const quoteFragments = (quote: string) => {
        return quote.split("\n").map((value, index, array) => {
            var renderBreak =
                array.length - 1 !== index || quote.endsWith("\n");

            return renderBreak ? (
                <Fragment key={index}>
                    {value}
                    <br />
                </Fragment>
            ) : (
                <Fragment key={index}>{value}</Fragment>
            );
        });
    };

    return (
        <>
            <div className="styledQuoteContainer">
                <blockquote>
                    {quoteFragments(state.data.quoteFirst)}
                    <em>{state.data.quoteTime}</em>
                    {quoteFragments(state.data.quoteLast)}
                </blockquote>
            </div>
            <div className="styledCiteContainer">
                <cite>
                    -<span className="book">{state.data.title}</span>,
                    <span className="author">{state.data.author}</span>
                </cite>
            </div>
        </>
    );
};
