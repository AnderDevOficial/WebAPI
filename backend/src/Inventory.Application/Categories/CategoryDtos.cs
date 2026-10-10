using System.ComponentModel.DataAnnotations;
using Inventory.Domain.Entities;

namespace Inventory.Application.Categories;

public sealed record CategoryResponse(
    int Id,
    string Name,
    string? Description,
    int ProductCount,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed record CreateCategoryRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(Category.NameMaxLength, MinimumLength = 2,
        ErrorMessage = "El nombre debe tener entre {2} y {1} caracteres.")]
    public string Name { get; init; } = string.Empty;

    [StringLength(Category.DescriptionMaxLength,
        ErrorMessage = "La descripción no puede superar los {1} caracteres.")]
    public string? Description { get; init; }
}

public sealed record UpdateCategoryRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(Category.NameMaxLength, MinimumLength = 2,
        ErrorMessage = "El nombre debe tener entre {2} y {1} caracteres.")]
    public string Name { get; init; } = string.Empty;

    [StringLength(Category.DescriptionMaxLength,
        ErrorMessage = "La descripción no puede superar los {1} caracteres.")]
    public string? Description { get; init; }
}
