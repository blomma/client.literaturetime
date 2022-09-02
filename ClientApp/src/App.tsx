import {
    LiteratureTime,
    LiteratureTimeMissing,
    LiteratureTimeResult,
} from "./LiteratureTime";
import React, { CSSProperties, useEffect } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import smartypants from "./smartypants";

enum Status {
    Pending,
    Loading,
    Success,
    Error,
}

interface PendingState {
    status: Status.Pending;
}

interface LoadingState {
    status: Status.Loading;
}

interface SuccessState {
    status: Status.Success;
    data: LiteratureTimeResult;
}

interface ErrorState {
    status: Status.Error;
    error: Error;
}

interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    stackTrace: string;
}

type State = PendingState | LoadingState | SuccessState | ErrorState;

function App() {
    const [state, setState] = React.useState<State>({
        status: Status.Loading,
    });

    const override: CSSProperties = {
        display: "block",
        margin: "150px auto",
    };

    useEffect(() => {
        async function fetchData() {
            const request: RequestInit = {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            };
            var date = new Date();
            let hour = `${date.getHours()}`.padStart(2, "0");
            let minute = `${date.getMinutes()}`.padStart(2, "0");

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
    }, []);

    return (
        <main>
            {state.status === (Status.Loading || Status.Pending) && (
                <CircleLoader size={150} cssOverride={override} />
            )}

            {state.status === Status.Error && <LiteratureTimeMissing />}

            {state.status === Status.Success && (
                <LiteratureTime literatureTime={state.data} />
            )}
        </main>
    );
}

export default App;
