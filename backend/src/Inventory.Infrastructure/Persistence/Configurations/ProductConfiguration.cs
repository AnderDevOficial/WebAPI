using Inventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.Infrastructure.Persistence.Configurations;

internal sealed class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(product => product.Id);

        builder.Property(product => product.Name)
            .HasMaxLength(Product.NameMaxLength)
            .IsRequired();

        builder.Property(product => product.Description)
            .HasMaxLength(Product.DescriptionMaxLength);

        builder.Property(product => product.Sku)
            .HasMaxLength(Product.SkuMaxLength)
            .IsRequired();

        builder.Property(product => product.Price)
            .HasPrecision(10, 2);

        builder.Property(product => product.IsActive)
            .HasDefaultValue(true);

        builder.Property(product => product.CreatedAt).IsRequired();

        builder.HasIndex(product => product.Sku).IsUnique();
        builder.HasIndex(product => product.Name);

        builder.HasData(SeedData.Products);
    }
}
