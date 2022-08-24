namespace Client.Literature.Models;

public record ProblemDetailsWithStackTrace(
    string Type,
    string Title,
    int Status,
    string Detail,
    string Instance,
    string StackTrace
);
