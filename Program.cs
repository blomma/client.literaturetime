using Client.LiteratureTime.Exceptions;
using Client.LiteratureTime.Handlers;
using Client.LiteratureTime.Models;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Events;
using System.Text.Json;

Log.Logger = new LoggerConfiguration().MinimumLevel
    .Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.MimeTypes = new[] { "application/javascript", "text/css", "text/javascript" };
});

builder.Host.UseSerilog(
    (context, services, configuration) =>
        configuration.ReadFrom.Configuration(context.Configuration).ReadFrom.Services(services)
);

builder.Services
    .AddHttpClient(
        Options.DefaultName,
        client =>
        {
            client.BaseAddress = new Uri(
                builder.Configuration.GetConnectionString("api.literaturetime")
                    ?? throw new Exception()
            );
        }
    )
    .AddHttpMessageHandler<ProblemDetailsHandler>();

builder.Services.AddMvcCore();

builder.Services.AddHttpLogging(logging =>
{
    logging.RequestHeaders.Add("Referer");
    logging.RequestHeaders.Add("X-Forwarded-For");
    logging.RequestHeaders.Add("X-Forwarded-Host");
    logging.RequestHeaders.Add("X-Forwarded-Port");
    logging.RequestHeaders.Add("X-Forwarded-Proto");
    logging.RequestHeaders.Add("X-Forwarded-Server");
    logging.RequestHeaders.Add("X-Real-Ip");
    logging.RequestHeaders.Add("Upgrade-Insecure-Requests");
    logging.LoggingFields = HttpLoggingFields.All;
    logging.RequestBodyLogLimit = 4096;
    logging.ResponseBodyLogLimit = 4096;
});

builder.Services.AddTransient<ProblemDetailsHandler>();

var app = builder.Build();
app.UseHttpLogging();
app.UseResponseCompression();

var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

app.MapGet(
        "/api/literature/{hour}/{minute}/{hash?}",
        async (
            CancellationToken cancellationToken,
            [FromServices] HttpClient httpClient,
            [FromServices] IConfiguration configuration,
            string hour,
            string minute,
            string? hash
        ) =>
        {
            var requestUrl =
                hash != null
                    ? $"/api/literature/{hour}/{minute}/{hash}"
                    : $"/api/literature/{hour}/{minute}";

            var response = await httpClient.GetAsync(requestUrl, cancellationToken);

            using var contentStream = await response.Content.ReadAsStreamAsync(cancellationToken);
            var literaturetime = await JsonSerializer.DeserializeAsync<LiteratureTime>(
                contentStream,
                jsonOptions,
                cancellationToken
            );

            return Results.Ok(literaturetime);
        }
    )
    .WithName("GetLiteratureTime")
    .AddEndpointFilter(
        async (invocationContext, next) =>
        {
            try
            {
                return await next(invocationContext);
            }
            catch (ManagedresponseException ex)
            {
                return Results.Problem(ex.ProblemDetails);
            }
        }
    );

app.UseStaticFiles(
    new StaticFileOptions
    {
        OnPrepareResponse = ctx =>
        {
            var cacheControl =
                ctx.File.PhysicalPath != null
                    ? ctx.File.PhysicalPath.Contains("static")
                        ? "public, max-age=31536000"
                        : "no-cache"
                    : "no-cache";

            ctx.Context.Response.Headers.Append("Cache-Control", cacheControl);
        }
    }
);

app.MapFallbackToFile(
    "index.html",
    new StaticFileOptions
    {
        OnPrepareResponse = ctx =>
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "no-cache");
        }
    }
);

app.Run();
