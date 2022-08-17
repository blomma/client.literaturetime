using System;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapGet("/literaturetime/{milliseconds:long}", async ([FromServices] HttpClient httpClient, long milliseconds) =>
{
    var url = $"http://192.168.1.11/literaturetime/{milliseconds}";
    var response = await httpClient.GetStringAsync(url);

    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };
    var literaturetime = JsonSerializer.Deserialize<LiteratureTime>(response, options);

    return literaturetime;
})
.WithName("GetLiteratureTime");

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapFallbackToFile("index.html");

app.Run();

public record LiteratureTime(
    string Time,
    string QuoteFirst,
    string QuoteTime,
    string QuoteLast,
    string Title,
    string Author
);