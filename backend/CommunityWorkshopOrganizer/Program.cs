using CommunityWorkshopOrganizer.Data;
using Microsoft.EntityFrameworkCore;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi;
using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApiContext>(options =>
    options.UseSqlite(connectionString));

// Services
builder.Services.AddScoped<IRegistrationService, RegistrationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IWorkshopService, WorkshopService>();
builder.Services.AddScoped<IResourceService, ResourceService>();
builder.Services.AddScoped<IOrganizerRequestService, OrganizerRequestService>();
builder.Services.AddSingleton<IEmailService, EmailService>();

// Controllers
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();

// Swagger (Swashbuckle v10+)
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CommunityWorkshop API", Version = "v1" });

    // Enable JWT Authorization in Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token below (WITHOUT the 'Bearer ' prefix)."
    });

    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // Allow Vercel and any other origin
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials() // Needed if we allowed any origin dynamically
              .WithExposedHeaders("WWW-Authenticate");
    });
});

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Force the old JwtSecurityTokenHandler for validation — this MUST match
        // what AuthController uses to CREATE tokens. Without this, .NET 10 uses
        // JsonWebTokenHandler by default, which is incompatible with JwtSecurityTokenHandler tokens.
        options.UseSecurityTokenValidators = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
            // Be lenient on clock skew for dev
            ClockSkew = TimeSpan.Zero
        };
        // Log exact rejection reason to backend console
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                var authHeader = ctx.Request.Headers["Authorization"].FirstOrDefault() ?? "(none)";
                var path = ctx.Request.Path;
                Console.WriteLine($"[JWT REJECTED] Path: {path}");
                Console.WriteLine($"[JWT REJECTED] Auth Header: '{authHeader}'");
                Console.WriteLine($"[JWT REJECTED] Error: {ctx.Exception.GetType().Name}: {ctx.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Auto-run migrations on startup (creates the .db file and tables)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApiContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    // Use classic Swagger
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CommunityWorkshop API v1");
    });
}

app.UseCors("AllowFrontEnd");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
