export enum Status {
    Pending,
    Loading,
    Success,
    Error,
}

export interface PendingState {
    status: Status.Pending;
}

export interface LoadingState {
    status: Status.Loading;
}

export interface SuccessState<TType> {
    status: Status.Success;
    data: TType;
}

export interface ErrorState {
    status: Status.Error;
    error: Error;
}
