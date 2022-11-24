namespace Client.LiteratureTime.Handlers;

using System.Text.Json;
using Client.LiteratureTime.Exceptions;
using Microsoft.AspNetCore.Mvc;

public class ProblemDetailsHandler : DelegatingHandler
{
    static readonly JsonSerializerOptions jsonSerializerOptions = new(JsonSerializerDefaults.Web);

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken
    )
    {
        var httpResponse = await base.SendAsync(request, cancellationToken);
        if (httpResponse.Content.Headers.ContentType?.MediaType == "application/problem+json")
        {
            using var contentStream = await httpResponse.Content.ReadAsStreamAsync(
                cancellationToken
            );

            ProblemDetails? problemDetails;
            try
            {
                problemDetails = await JsonSerializer.DeserializeAsync<ProblemDetails?>(
                    contentStream,
                    jsonSerializerOptions,
                    cancellationToken
                );
            }
            catch (Exception ex)
            {
                throw new ManagedresponseException(ex);
            }

            // If you pass a root literal null (the json text is null without quotation), it should be deserialized as null.
            // This is the reason we need to check for null here
            // Reference https://github.com/dotnet/runtime/discussions/60195
            problemDetails ??= new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Json Deserialize returned null",
                Detail =
                    "MediaType was application/problem+json, but for some reason Deserialize returned null"
            };

            throw new ManagedresponseException(problemDetails);
        }

        return httpResponse;
    }
}
