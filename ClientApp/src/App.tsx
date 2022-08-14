import "./App.css";
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
        const request: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        var requestUrl = `https://localhost:6001/literaturetime/${Date.now()}`;
        fetch(requestUrl, request)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response
                    .json()
                    .then((data) => data as LiteratureTimeResult);
            })
            .then((data) => {
                setData({
                    status: ApiStatus.Success,
                    data: data,
                });
            })
            .catch((err: Error) => {
                switch (err.message) {
                    default:
                        setData({
                            status: ApiStatus.Error,
                            error: err,
                        });
                }
            });
    }, []);

    return (() => {
        switch (data.status) {
            case ApiStatus.Loading:
                return <p>LOADING</p>;
            case ApiStatus.Error:
                return <p>{data.error?.message.toString()}</p>;
            case ApiStatus.Success:
                return <LiteratureTime literatureTime={data.data!} />;
        }
    })();
}

export default App;
