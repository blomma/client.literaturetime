import React, { ReactNode, useContext, useEffect, useState } from "react";
import { LiteratureTimeResult } from "./Models/LiteratureTimeResult";
import { ProblemDetails } from "./Models/ProblemDetails";
import {
    ErrorState,
    LoadingState,
    PendingState,
    Status,
    SuccessState,
} from "./Models/State";
import smartypants from "./smartypants";

export type State =
    | PendingState
    | LoadingState
    | SuccessState<LiteratureTimeResult>
    | ErrorState;

const defaultValue: PendingState = { status: Status.Pending };
const Context = React.createContext<State>(defaultValue);

export const LiteratureTimeProvider = ({
    children,
    hour,
    minute,
}: {
    children: ReactNode;
    hour: string;
    minute: string;
}) => {
    const [state, setState] = useState<State>(defaultValue);

    useEffect(() => {
        async function fetchData() {
            const request: RequestInit = {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            };

            var requestUrl = `/literaturetime/${hour}/${minute}`;
            const response = await fetch(requestUrl, request);
            if (!response.ok) {
                await response.json().then((data: ProblemDetails) => {
                    setState({
                        status: Status.Error,
                        error: Error(data.detail),
                    });
                });

                return;
            }

            await response
                .json()
                .then((data: LiteratureTimeResult) => {
                    var quoteFirst = smartypants(data.quoteFirst);
                    var quoteTime = smartypants(data.quoteTime);
                    var quoteLast = smartypants(data.quoteLast);

                    var literatureTimeResult: LiteratureTimeResult = {
                        author: data.author,
                        title: data.title,
                        time: data.time,
                        quoteFirst: quoteFirst,
                        quoteTime: quoteTime,
                        quoteLast: quoteLast,
                    };

                    setState({
                        status: Status.Success,
                        data: literatureTimeResult,
                    });
                })
                .catch((err: Error) => {
                    setState({
                        status: Status.Error,
                        error: err,
                    });
                });
        }

        fetchData();
    }, [hour, minute]);

    return <Context.Provider value={state}>{children}</Context.Provider>;
};

export const useLiteratureTime = () => {
    return useContext<State>(Context);
};
