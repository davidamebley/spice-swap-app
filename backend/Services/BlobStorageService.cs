using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;

public class BlobStorageService
{
    private readonly string _connectionString;
    private readonly string _containerName;

    public BlobStorageService(string connectionString, string containerName)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _containerName = containerName ?? throw new ArgumentNullException(nameof(containerName));
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var blobContainerClient = blobServiceClient.GetBlobContainerClient(_containerName);
        var blobName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var blobClient = blobContainerClient.GetBlobClient(blobName);

        await using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(stream, true);

        return blobClient.Uri.ToString();
    }
}
