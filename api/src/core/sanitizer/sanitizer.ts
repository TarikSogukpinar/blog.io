import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export function Sanitize(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'sanitize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string'; // Temel kontrol
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains invalid characters`;
        },
      },
      async: false,
    });
  };
}

export function sanitizeInput(value: any): any {
  if (typeof value === 'string') {
    // İlk olarak sanitize-html kullanarak HTML ve JavaScript etiketlerini temizle
    value = sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Özel karakterleri regex ile temizle
    // Örneğin: ½, $, {, #, @ gibi karakterleri temizlemek için
    value = value.replace(/[½$#{@}]/g, '');

    return value;
  }
  return value;
}
