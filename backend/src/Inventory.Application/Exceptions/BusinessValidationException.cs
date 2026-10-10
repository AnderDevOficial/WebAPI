namespace Inventory.Application.Exceptions;

public sealed class BusinessValidationException : AppException
{
    public BusinessValidationException(string field, string error)
        : base("Se produjeron uno o más errores de validación.")
    {
        Errors = new Dictionary<string, string[]> { [field] = [error] };
    }

    public IReadOnlyDictionary<string, string[]> Errors { get; }
}
