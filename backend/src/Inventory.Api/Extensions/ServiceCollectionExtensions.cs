using System.Text.Json.Serialization;
using Inventory.Api.Infrastructure;
using Inventory.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Inventory.Api.Extensions;

internal static class ServiceCollectionExtensions
{
    public const string FrontendCorsPolicy = "Frontend";

    public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddControllers()
            .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var problem = context.HttpContext.RequestServices
                        .GetRequiredService<ProblemDetailsFactory>()
                        .CreateValidationProblemDetails(
                            context.HttpContext,
                            context.ModelState,
                            StatusCodes.Status400BadRequest,
                            title: "Se produjeron uno o más errores de validación.");
                    return new BadRequestObjectResult(problem);
                };
            });

        services.AddProblemDetails(options =>
            options.CustomizeProblemDetails = context =>
                context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier);
        services.AddExceptionHandler<GlobalExceptionHandler>();

        services.AddOpenApi();

        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        services.AddCors(options => options.AddPolicy(FrontendCorsPolicy, policy =>
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

        services.AddHealthChecks().AddDbContextCheck<InventoryDbContext>("database");

        return services;
    }
}
