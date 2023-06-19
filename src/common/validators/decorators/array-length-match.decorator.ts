import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'arrayLengthMatch', async: false })
export class ArrayLengthMatchConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!Array.isArray(value) || !Array.isArray(relatedValue)) {
      return false;
    }

    return value.length === relatedValue.length;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `The length of ${args.property} must be equal to the length of ${relatedPropertyName}.`;
  }
}

export const ArrayLengthMatch = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'arrayLengthMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: ArrayLengthMatchConstraint,
    });
  };
};
