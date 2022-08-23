using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

app.MapGet("/literaturetime/{hour}/{minute}", async ([FromServices] HttpClient httpClient, string hour, string minute) =>
{
    var httpRequestMessage = new HttpRequestMessage(
            HttpMethod.Get,
            $"http://api-literature.192.168.1.11.nip.io/api/1.0/literature/{hour}/{minute}")
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

// app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapFallbackToFile("index.html");

app.Run();

public record ProblemDetailsWithStackTrace(
    string Type,
    string Title,
    int Status,
    string Detail,
    string Instance,
    string StackTrace
);

public record LiteratureTime(
    string Time,
    string QuoteFirst,
    string QuoteTime,
    string QuoteLast,
    string Title,
    string Author
);