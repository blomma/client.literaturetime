using System.Text.Encodings.Web;
using System.Text.Json;

namespace Client.LiteratureTime.Workers;

public class LiteratureDataWorker() : BackgroundService
{
    private static string PrefixKey(string key) => $"literature:time:{key}";

    private static readonly JsonSerializerOptions jsonSerializerOptions =
        new()
        {
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            PropertyNameCaseInsensitive = true,
        };

    public IEnumerable<Models.LiteratureTime> ImportLiteratureTimes()
    {
        List<Models.LiteratureTime> literatureTimeImports = [];
        var files = Directory.EnumerateFiles(
            "Quotes",
            "literatureTimes.json",
            SearchOption.AllDirectories
        );

        foreach (var file in files)
        {
            var content = File.ReadAllText(file);
            var result = JsonSerializer.Deserialize<List<Models.LiteratureTime>>(
                content,
                jsonSerializerOptions
            );

            if (result != null)
            {
                literatureTimeImports.AddRange(result);
            }
        }

        return literatureTimeImports;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            var literatureTimes = ImportLiteratureTimes();
            var groupedLiteratureTimes = literatureTimes.GroupBy(l => l.Time);
        }
        catch (OperationCanceledException)
        {
            // When the stopping token is canceled, for example, a call made from services.msc,
            // we shouldn't exit with a non-zero exit code. In other words, this is expected...
        }

        return Task.CompletedTask;
    }
}
