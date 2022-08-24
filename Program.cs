using Client.Literature.Configurations;
using Client.Literature.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();

builder.Services.Configure<ApiLiteratureOptions>(
    builder.Configuration.GetSection(ApiLiteratureOptions.ApiLiterature)
);

var app = builder.Build();

var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

app.MapGet("/literaturetime/{hour}/{minute}", async (
    [FromServices] HttpClient httpClient,
    [FromServices] IOptions<ApiLiteratureOptions> options,
    string hour,
    string minute) =>
{
    var url = $"{options.Value.Endpoint}/api/1.0/literature/{hour}/{minute}";
    var httpRequestMessage = new HttpRequestMessage(
            HttpMethod.Get,
            url)
    { };

    var httpResponse = await httpClient.SendAsync(httpRequestMessage);
    using var contentStream = await httpResponse.Content.ReadAsStreamAsync();

    if (
        !httpResponse.IsSuccessStatusCode &&
        httpResponse.Content.Headers.ContentType?.MediaType == "application/problem+json"
        )
    {
        var problemDetails = await JsonSerializer.DeserializeAsync<ProblemDetailsWithStackTrace>(contentStream, jsonOptions);
        return Results.Problem(problemDetails.Detail, problemDetails.Instance, problemDetails.Status, problemDetails.Title, problemDetails.Type);
    }

    var literaturetime = await JsonSerializer.DeserializeAsync<LiteratureTime>(contentStream, jsonOptions);
    return Results.Ok(literaturetime);
})
.WithName("GetLiteratureTime");

app.UseStaticFiles();
app.UseRouting();

app.MapFallbackToFile("index.html");

app.Run();