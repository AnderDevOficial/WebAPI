using Inventory.Domain.Entities;

namespace Inventory.Infrastructure.Persistence.Configurations;

internal static class SeedData
{
    private static readonly DateTime SeedDate = new(2026, 10, 10, 5, 0, 0, DateTimeKind.Utc);

    public static readonly Category[] Categories =
    [
        new() { Id = 1, Name = "Electrónica", Description = "Dispositivos y accesorios electrónicos.", CreatedAt = SeedDate },
        new() { Id = 2, Name = "Hogar", Description = "Artículos para el hogar y la cocina.", CreatedAt = SeedDate },
        new() { Id = 3, Name = "Oficina", Description = "Papelería y mobiliario de oficina.", CreatedAt = SeedDate }
    ];

    public static readonly Product[] Products =
    [
        new() { Id = 1, Name = "Teclado mecánico", Sku = "ELEC-0001", Price = 1299.00m, Stock = 25, CategoryId = 1, IsActive = true, CreatedAt = SeedDate, Description = "Teclado mecánico retroiluminado con switches rojos." },
        new() { Id = 2, Name = "Mouse inalámbrico", Sku = "ELEC-0002", Price = 449.90m, Stock = 60, CategoryId = 1, IsActive = true, CreatedAt = SeedDate, Description = "Mouse ergonómico con conexión Bluetooth." },
        new() { Id = 3, Name = "Monitor 27\"", Sku = "ELEC-0003", Price = 5899.00m, Stock = 8, CategoryId = 1, IsActive = true, CreatedAt = SeedDate, Description = "Monitor IPS 2K de 27 pulgadas." },
        new() { Id = 4, Name = "Cafetera de goteo", Sku = "HOG-0001", Price = 899.50m, Stock = 15, CategoryId = 2, IsActive = true, CreatedAt = SeedDate, Description = "Cafetera programable de 12 tazas." },
        new() { Id = 5, Name = "Juego de sartenes", Sku = "HOG-0002", Price = 1499.00m, Stock = 0, CategoryId = 2, IsActive = false, CreatedAt = SeedDate, Description = "Set de 3 sartenes antiadherentes." },
        new() { Id = 6, Name = "Silla ergonómica", Sku = "OFI-0001", Price = 3499.00m, Stock = 5, CategoryId = 3, IsActive = true, CreatedAt = SeedDate, Description = "Silla de oficina con soporte lumbar." },
        new() { Id = 7, Name = "Paquete de hojas carta", Sku = "OFI-0002", Price = 119.90m, Stock = 200, CategoryId = 3, IsActive = true, CreatedAt = SeedDate, Description = "Paquete de 500 hojas tamaño carta." }
    ];
}
