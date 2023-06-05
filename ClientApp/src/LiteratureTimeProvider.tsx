import React, { ReactNode, useContext, useMemo, useReducer } from "react";
import {
    ActionType,
    defaultStateValue,
    reducer,
    State,
} from "./LiteratureTimeState";
import { LiteratureTimeResult } from "./Models/LiteratureTimeResult";
import { ProblemDetails } from "./Models/ProblemDetails";

interface Api {
    getLiteratureTime: (hour: string, minute: string, hash?: string) => void;
}

const LiteratureTimeStateContext =
    React.createContext<State>(defaultStateValue);

const LiteratureTimeApiContext = React.createContext<Api>({} as Api);

export const LiteratureTimeProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [state, dispatch] = useReducer(reducer, defaultStateValue);

    const api = useMemo(() => {
        const getLiteratureTime = async (
            hour: string,
            minute: string,
            hash?: string
        ) => {
            const request: RequestInit = {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            };

            const requestUrl =
                hash !== undefined
                    ? `/api/literature/${hour}/${minute}/${hash}`
                    : `/api/literature/${hour}/${minute}`;

            const response = await fetch(requestUrl, request);
            if (!response.ok) {
                await response.json().then((data: ProblemDetails) => {
                    dispatch({
                        type: ActionType.onFetchLiteratureTimeError,
                        data: Error(data.detail),
                    });
                });

                return;
            }

            await response
                .json()
                .then((data: LiteratureTimeResult) => {
                    dispatch({
                        type: ActionType.onFetchLiteratureTimeSuccess,
                        data: data,
                    });
                })
                .catch((err: Error) => {
                    dispatch({
                        type: ActionType.onFetchLiteratureTimeError,
                        data: err,
                    });
                });
        };

        return { getLiteratureTime };
    }, []);

    return (
        <LiteratureTimeApiContext.Provider value={api}>
            <LiteratureTimeStateContext.Provider value={state}>
                {children}
            </LiteratureTimeStateContext.Provider>
        </LiteratureTimeApiContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLiteratureTimeState = () =>
    useContext<State>(LiteratureTimeStateContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useLiteratureTimeApi = () =>
    useContext<Api>(LiteratureTimeApiContext);
