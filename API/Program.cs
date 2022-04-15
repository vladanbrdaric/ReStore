using API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;

var builder = WebApplication.CreateBuilder(args);

// Get connection string from appsettings.json file
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors();

// Add EF service
builder.Services.AddDbContext<StoreContext>(opt => 
{
    opt.UseSqlite(connectionString);
});

var app = builder.Build();

// Lections 2.15
// "Using" keyword will automatically dispose connection and release resorces to the db.
using var scope = app.Services.CreateAsyncScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

// catch the exception if the one occur so that application dont crash.
try
{
    // So this command will create database. Its eqivalent to "dotnet ef update" command.
    context.Database.MigrateAsync();

    // This command will pupulate the database with random data from DbInitializer.cs class.
    // We pass in the database connection.
    DbInitializer.Initialize(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "Problem migrating data");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
}

// CORS configuration
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
});


//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
