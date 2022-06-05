using API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

// Get connection string from appsettings.json file
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    // BOILER PLATE CODE

    // Identity -> Configure swager to recognize the token that will be send in the request header.
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Jwt auth header",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Add more boilerplate code
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

// Add EF service
builder.Services.AddDbContext<StoreContext>(opt => 
{
    opt.UseSqlite(connectionString);
});

// Configure CORS
builder.Services.AddCors();

// Add Identity service. This peace of code will add 8 new tables to my database.
builder.Services.AddIdentityCore<User>(options =>
{
    // this will not allow any duplicate email address in the database.
    options.User.RequireUniqueEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

// == OBS: Make sure those two services addes below the Identity service ==

// I have to tell my authentication method about what authentication scheme that we're going use here. Its JwtBearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    // add some options
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            // Here I'm defining how I'm going to validate this token.

            // Issuer is basically my API server. (http://localhost:5000)
            ValidateIssuer = false,

            // Audience are addresses of my clients on my localhost
            ValidateAudience = false,

            // True because I gave my token an expiry date.
            ValidateLifetime = true,

            // This is the part where I check the secret key that I add to my token, I wanna be sure that it matches the signarute that the server assigned it with.
            ValidateIssuerSigningKey = true,

            // So I'm creating the same key (signature) that I created on the server in the first place and compare it with the signature from the token I get back from the client.
            // If they matches then the token is valid.
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });


builder.Services.AddAuthorization();

// Add Token Service. Consider using interface instead of Classes.
//builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

// Lections 2.15
// "Using" keyword will automatically dispose connection and release resorces to the db.
using var scope = app.Services.CreateAsyncScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

// add new parameter of type UserManager to the DbInicializer class
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

// catch the exception if the one occur so that application dont crash.
try
{
    // So this command will create database. Its eqivalent to "dotnet ef update" command.
    await context.Database.MigrateAsync();

    // This command will pupulate the database with random data from DbInitializer.cs class.
    // We pass in the database connection.
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "Problem migrating data");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseMiddleware<ExceptionMiddleware>();
    //app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
}

// CORS configuration
app.UseCors(opt =>
{   
    // Without AllowCredentials() I could not pass cookies to and from client on a different domain.
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});


//app.UseHttpsRedirection();

// Identity -> add middleware for the authentication.
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
