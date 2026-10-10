using Inventory.Application.Categories;
using Inventory.Domain.Entities;

namespace Inventory.Application.Products;

internal static class ProductMappings
{
    public static ProductResponse ToResponse(this Product product) =>
        new(
            product.Id,
            product.Name,
            product.Description,
            product.Sku,
            product.Price,
            product.Stock,
            product.IsActive,
            product.CategoryId,
            product.Category?.Name ?? string.Empty,
            product.CreatedAt,
            product.UpdatedAt);

    public static Product ToEntity(this CreateProductRequest request)
    {
        var product = new Product();
        request.Apply(product);
        return product;
    }

    public static void Apply(this ProductRequest request, Product product)
    {
        product.Name = request.Name.Trim();
        product.Description = request.Description.NormalizeOptional();
        product.Sku = NormalizeSku(request.Sku);
        product.Price = decimal.Round(request.Price, 2);
        product.Stock = request.Stock;
        product.IsActive = request.IsActive;
        product.CategoryId = request.CategoryId;
    }

    public static string NormalizeSku(string sku) => sku.Trim().ToUpperInvariant();
}
