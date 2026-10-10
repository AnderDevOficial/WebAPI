using Inventory.Domain.Common;

namespace Inventory.Domain.Entities;

public class Category : BaseEntity
{
    public const int NameMaxLength = 100;
    public const int DescriptionMaxLength = 500;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
