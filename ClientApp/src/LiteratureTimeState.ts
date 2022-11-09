import { LiteratureTimeResult } from "./Models/LiteratureTimeResult";
import {
    ErrorState,
    LoadingState,
    PendingState,
    Status,
    SuccessState,
} from "./Models/State";

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
            return {
                ...state,
                status: Status.Success,
                data: {
                    author: action.data.author,
                    title: action.data.title,
                    time: action.data.time,
                    quoteFirst: action.data.quoteFirst,
                    quoteTime: action.data.quoteTime,
                    quoteLast: action.data.quoteLast,
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
