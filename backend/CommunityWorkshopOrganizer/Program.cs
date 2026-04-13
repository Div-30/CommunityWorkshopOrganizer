using CommunityWorkshopOrganizer.Data;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddDbContext<ApiContext>(options =>
    options.UseInMemoryDatabase("CommunityWorkshopOrganizerDb"));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//  Add this line to make backend accept frontend codes
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add this — must be BEFORE UseAuthorization and MapControllers
app.UseCors("AllowFrontEnd");

app.UseAuthorization();
app.MapControllers();
app.Run();
