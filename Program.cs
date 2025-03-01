﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Kamran_Portfolio.Data;
using Kamran_Portfolio.BackgroundTask.Tasks;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<Kamran_PortfolioContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Kamran_PortfolioContext") ?? throw new InvalidOperationException("Connection string 'Kamran_PortfolioContext' not found.")));

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

#region Sessioin and coockies settings
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});
#endregion

#region Background Task
//builder.Services.AddHostedService<MyBackgroundTask>();
#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseSession();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
