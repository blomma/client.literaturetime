import { CSSProperties, Fragment, useEffect } from "react";
import { CircleLoader } from "react-spinners";
import { Status } from "./Models/State";
import {
    useLiteratureTimeApi,
    useLiteratureTimeState,
} from "./LiteratureTimeProvider";

import styled from "styled-components";

const StyledQuoteContainer = styled.div`
    display: flex;
    justify-content: center;
    color: ${(props) => props.theme.colors.text};
`;

const StyledQuote = styled.blockquote`
    font-size: 3vw;
    width: 70vw;
`;

const StyledQuoteTime = styled.em`
    font-weight: 900;
    font-style: normal;
    color: ${(props) => props.theme.colors.quoteTime};
`;

const StyledCiteContainer = styled.div`
    display: flex;
    justify-content: center;
    color: ${(props) => props.theme.colors.text};
`;

const StyledCite = styled.cite`
    width: 60vw;
    font-size: 1.5vw;
    display: flex;
    justify-content: flex-end;
`;

const StyledCiteBook = styled.span`
    font-style: normal;
    ::before {
        content: " ";
        white-space: pre;
    }
`;

const StyledCiteAuthor = styled.span`
    ::before {
        content: " ";
        white-space: pre;
    }
`;

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

    const override: CSSProperties = {
        display: "block",
        margin: "150px auto",
    };

    if (state.status === Status.Error)
        return (
            <>
                <StyledQuoteContainer>
                    <StyledQuote>
                        “Time is an illusion. Lunchtime doubly so.”
                    </StyledQuote>
                </StyledQuoteContainer>
                <StyledCiteContainer>
                    <StyledCite>
                        -
                        <StyledCiteBook>
                            The Hitchhiker's Guide to the Galaxy
                        </StyledCiteBook>
                        ,<StyledCiteAuthor>Douglas Adams</StyledCiteAuthor>
                    </StyledCite>
                </StyledCiteContainer>
            </>
        );

    if (state.status === Status.Loading)
        return <CircleLoader size={150} cssOverride={override} />;

    if (state.status === Status.Pending)
        return <CircleLoader size={150} cssOverride={override} />;

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
            <StyledQuoteContainer>
                <StyledQuote>
                    {quoteFragments(state.data.quoteFirst)}
                    <StyledQuoteTime>{state.data.quoteTime}</StyledQuoteTime>
                    {quoteFragments(state.data.quoteLast)}
                </StyledQuote>
            </StyledQuoteContainer>
            <StyledCiteContainer>
                <StyledCite>
                    -<StyledCiteBook>{state.data.title}</StyledCiteBook>,
                    <StyledCiteAuthor>{state.data.author}</StyledCiteAuthor>
                </StyledCite>
            </StyledCiteContainer>
        </>
    );
};
