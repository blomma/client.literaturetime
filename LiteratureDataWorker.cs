using System.Text.Encodings.Web;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

namespace Client.LiteratureTime;

public class LiteratureDataWorker(IMemoryCache memoryCache) : BackgroundService
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

            foreach (var item in groupedLiteratureTimes)
            {
                memoryCache.Set<List<Models.LiteratureTime>>(item.Key, [.. item]);
            }
        }
        catch (OperationCanceledException)
        {
            // When the stopping token is canceled, for example, a call made from services.msc,
            // we shouldn't exit with a non-zero exit code. In other words, this is expected...
        }

        return Task.CompletedTask;
    }
}
