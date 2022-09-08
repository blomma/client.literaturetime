import { LiteratureTimeResult } from "./Models/LiteratureTimeResult";
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

export const defaultStateValue: PendingState = { status: Status.Pending };

export enum ActionType {
    onFetchLiteratureTimeSuccess,
    onFetchLiteratureTimeError,
}

type Actions =
    | { type: ActionType.onFetchLiteratureTimeError; data: Error }
    | {
          type: ActionType.onFetchLiteratureTimeSuccess;
          data: LiteratureTimeResult;
      };

export const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case ActionType.onFetchLiteratureTimeSuccess:
            var quoteFirst = smartypants(action.data.quoteFirst);
            var quoteTime = smartypants(action.data.quoteTime);
            var quoteLast = smartypants(action.data.quoteLast);

            return {
                ...state,
                status: Status.Success,
                data: {
                    author: action.data.author,
                    title: action.data.title,
                    time: action.data.time,
                    quoteFirst: quoteFirst,
                    quoteTime: quoteTime,
                    quoteLast: quoteLast,
                },
            };

        case ActionType.onFetchLiteratureTimeError:
            return {
                ...state,
                status: Status.Error,
                error: action.data,
            };
    }
};
