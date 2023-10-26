using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.json");

// Add services to the container.
// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
            .AllowAnyMethod() // Allows all methods.
            .AllowAnyHeader(); // Allows all headers.;
        });
});

// Retrieve the Blob Storage connection string
var blobStorageConnectionString = builder.Configuration.GetConnectionString("BlobStorageConnection");
if (string.IsNullOrEmpty(blobStorageConnectionString))
{
    throw new ArgumentException("Blob Storage connection string is missing in the configuration");
}
var containerName = "container-spiceswap";
builder.Services.AddSingleton(new BlobStorageService(blobStorageConnectionString, containerName));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Check for valid keystring
var tokenKey = builder.Configuration.GetSection("SecurityStrings:Token").Value;
if (string.IsNullOrEmpty(tokenKey))
{
    throw new ArgumentException("Token key is missing in the configuration");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// Use Cors
app.UseCors("MyCorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
