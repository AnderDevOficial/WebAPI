using Inventory.Domain.Entities;

namespace Inventory.Application.Categories;

internal static class CategoryMappings
{
    public static CategoryResponse ToResponse(this Category category, int productCount) =>
        new(category.Id, category.Name, category.Description, productCount, category.CreatedAt, category.UpdatedAt);

    public static Category ToEntity(this CreateCategoryRequest request) =>
        new()
        {
            Name = request.Name.Trim(),
            Description = request.Description.NormalizeOptional()
        };

    public static void Apply(this UpdateCategoryRequest request, Category category)
    {
        category.Name = request.Name.Trim();
        category.Description = request.Description.NormalizeOptional();
    }

    internal static string? NormalizeOptional(this string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
