import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  
  export function IsValidName(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isValidName',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            if (typeof value !== 'string') {
              return false;
            }
            const pattern = /^[a-zA-Z\s]+$/;
            return pattern.test(value) && !value.startsWith(' ');
          },
          defaultMessage(args: ValidationArguments) {
            return `Name should contain only alphabetic characters, not start with a space, and contain no special characters.`;
          },
        },
      });
    };
  }
  