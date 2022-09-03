import { CSSProperties } from "react";
import { CircleLoader } from "react-spinners";
import { Status } from "./Models/State";
import { useLiteratureTime } from "./UseLiteratureTime";

import "./LiteratureTime.css";

export const LiteratureTime = () => {
    const state = useLiteratureTime();

    const override: CSSProperties = {
        display: "block",
        margin: "150px auto",
    };

    if (state.status === Status.Error)
        return (
            <>
                <div className="quote">
                    <blockquote id="lit_quote">
                        “Time is an illusion. Lunchtime doubly so.”
                    </blockquote>
                </div>
                <div className="cite">
                    <cite id="lit_cite">
                        -
                        <span id="book">
                            The Hitchhiker's Guide to the Galaxy
                        </span>
                        ,<span id="author">Douglas Adams</span>
                    </cite>
                </div>
            </>
        );

    if (state.status === Status.Loading)
        return <CircleLoader size={150} cssOverride={override} />;

    if (state.status === Status.Pending)
        return <CircleLoader size={150} cssOverride={override} />;

    return (
        <>
            <div className="quote">
                <blockquote id="lit_quote">
                    {state.data.quoteFirst}
                    <em>{state.data.quoteTime}</em>
                    {state.data.quoteLast}
                </blockquote>
            </div>
            <div className="cite">
                <cite id="lit_cite">
                    -<span id="book">{state.data.title}</span>,
                    <span id="author">{state.data.author}</span>
                </cite>
            </div>
        </>
    );
};
