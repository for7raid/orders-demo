export interface IValidationError {
    isValid?: boolean;
    name: string;
    errors?: IValidationError[]
}