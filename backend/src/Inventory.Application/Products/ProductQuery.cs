using System.ComponentModel.DataAnnotations;
using Inventory.Application.Common;

namespace Inventory.Application.Products;

public sealed record ProductQuery : PaginationQuery
{
    [StringLength(100, ErrorMessage = "La búsqueda no puede superar los {1} caracteres.")]
    public string? Search { get; init; }

    public int? CategoryId { get; init; }

    public bool? IsActive { get; init; }

    public ProductSortField SortBy { get; init; } = ProductSortField.Name;

    public bool Descending { get; init; }
}

public enum ProductSortField
{
    Name,
    Price,
    Stock,
    CreatedAt
}
