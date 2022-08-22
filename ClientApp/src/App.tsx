import { LiteratureTime, LiteratureTimeResult } from "./LiteratureTime";
import React, { useEffect } from "react";

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

    useEffect(() => {
        async function fetchData() {
            const request: RequestInit = {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            };
            // var offset = -new Date().getTimezoneOffset() * 60000;
            // var milliseconds = Date.now() + offset;
            var date = new Date();
            let hour = `${date.getHours()}`.padStart(2, "0");
            let minute = `${date.getMinutes()}`.padStart(2, "0");

            //var requestUrl = `/literaturetime/${milliseconds}`;
            // var requestUrl = `/literaturetime/1660960680000`;
            var requestUrl = `/literaturetime/${hour}/${minute}`;
            const response = await fetch(requestUrl, request);
            if (!response.ok) {
                await response
                    .json()
                    .then((data) => data as ProblemDetails)
                    .then((data) => {
                        console.log(data);
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
                    setData({
                        status: ApiStatus.Success,
                        data: data,
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
                return <p>LOADING</p>;
            case ApiStatus.Error:
                return <p>{data.error?.toString()}</p>;
            case ApiStatus.Success:
                return <LiteratureTime literatureTime={data.data!} />;
        }
    })();
}

export default App;
