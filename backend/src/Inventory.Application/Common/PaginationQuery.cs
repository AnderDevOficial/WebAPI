using System.ComponentModel.DataAnnotations;

namespace Inventory.Application.Common;

public abstract record PaginationQuery
{
    public const int DefaultPageSize = 10;
    public const int MaxPageSize = 100;

    [Range(1, int.MaxValue, ErrorMessage = "La página debe ser mayor o igual a 1.")]
    public int Page { get; init; } = 1;

    [Range(1, MaxPageSize, ErrorMessage = "El tamaño de página debe estar entre 1 y 100.")]
    public int PageSize { get; init; } = DefaultPageSize;
}
