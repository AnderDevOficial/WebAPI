namespace Inventory.Application.Exceptions;

public sealed class NotFoundException(string resourceName, object key)
    : AppException($"No se encontró {resourceName} con identificador '{key}'.");
