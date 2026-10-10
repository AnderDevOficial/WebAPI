using System.ComponentModel.DataAnnotations;
using Inventory.Domain.Entities;

namespace Inventory.Application.Products;

public sealed record ProductResponse(
    int Id,
    string Name,
    string? Description,
    string Sku,
    decimal Price,
    int Stock,
    bool IsActive,
    int CategoryId,
    string CategoryName,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public abstract record ProductRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(Product.NameMaxLength, MinimumLength = 2,
        ErrorMessage = "El nombre debe tener entre {2} y {1} caracteres.")]
    public string Name { get; init; } = string.Empty;

    [StringLength(Product.DescriptionMaxLength,
        ErrorMessage = "La descripción no puede superar los {1} caracteres.")]
    public string? Description { get; init; }

    [Required(ErrorMessage = "El SKU es obligatorio.")]
    [StringLength(Product.SkuMaxLength, MinimumLength = 3,
        ErrorMessage = "El SKU debe tener entre {2} y {1} caracteres.")]
    [RegularExpression("^[A-Za-z0-9-]+$",
        ErrorMessage = "El SKU solo puede contener letras, números y guiones.")]
    public string Sku { get; init; } = string.Empty;

    [Range(typeof(decimal), "0", "99999999.99", ErrorMessage = "El precio debe estar entre {1} y {2}.")]
    public decimal Price { get; init; }

    [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo.")]
    public int Stock { get; init; }

    public bool IsActive { get; init; } = true;

    [Range(1, int.MaxValue, ErrorMessage = "Debe seleccionar una categoría válida.")]
    public int CategoryId { get; init; }
}

public sealed record CreateProductRequest : ProductRequest;

public sealed record UpdateProductRequest : ProductRequest;
