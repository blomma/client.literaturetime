using System.Runtime.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace Client.Literature.Exceptions;


[Serializable]
public class ManagedresponseException : Exception
{
    public ProblemDetails ProblemDetails { get; set; } = new();

    public ManagedresponseException(Exception exception)
    {
        var problemDetails = new ProblemDetails
        {
            Title = exception.Message,
            Status = StatusCodes.Status500InternalServerError,
            Detail = exception.Message
        };

        ProblemDetails = problemDetails;
    }

    public ManagedresponseException(ProblemDetails problemDetails)
    {
        ProblemDetails = problemDetails;
    }

    protected ManagedresponseException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}