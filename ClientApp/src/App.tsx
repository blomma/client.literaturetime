import {
    LiteratureTime,
    LiteratureTimeMissing,
    LiteratureTimeResult,
} from "./LiteratureTime";
import React, { CSSProperties, useEffect } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import smartypants from "./smartypants";

export enum ApiStatus {
    // API request is being made
    Loading,
    // API call was successful
    Success,
    // API resulted in an error
    Error,
}

interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    stackTrace: string;
}

interface IApiData {
    status: ApiStatus;
    error?: Error;
    data?: LiteratureTimeResult;
}

function App() {
    const [data, setData] = React.useState<IApiData>({
        status: ApiStatus.Loading,
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
            // var requestUrl = `/literaturetime/01/13`;
            const response = await fetch(requestUrl, request);
            if (!response.ok) {
                await response
                    .json()
                    .then((data) => data as ProblemDetails)
                    .then((data) => {
                        setData({
                            status: ApiStatus.Error,
                            error: Error(data.detail),
                        });
                    });

                return;
            }

            await response
                .json()
                .then((data) => data as LiteratureTimeResult)
                .then((data) => {
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

                    setData({
                        status: ApiStatus.Success,
                        data: literatureTimeResult,
                    });
                })
                .catch((err: Error) => {
                    setData({
                        status: ApiStatus.Error,
                        error: err,
                    });
                });
        }

        fetchData();
    }, []);

    return (() => {
        switch (data.status) {
            case ApiStatus.Loading:
                return <CircleLoader size={150} cssOverride={override} />;
            case ApiStatus.Error:
                return <LiteratureTimeMissing />;
            case ApiStatus.Success:
                return <LiteratureTime literatureTime={data.data!} />;
        }
    })();
}

export default App;
