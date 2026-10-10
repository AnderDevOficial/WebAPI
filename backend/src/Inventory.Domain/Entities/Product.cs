using Inventory.Domain.Common;

namespace Inventory.Domain.Entities;

public class Product : BaseEntity
{
    public const int NameMaxLength = 150;
    public const int DescriptionMaxLength = 1000;
    public const int SkuMaxLength = 50;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Sku { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public bool IsActive { get; set; } = true;

    public int CategoryId { get; set; }

    public Category? Category { get; set; }
}
