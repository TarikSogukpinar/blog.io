import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super("User doesn't exist", HttpStatus.NOT_FOUND);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}

export class PassportCannotBeTheSameException extends HttpException {
  constructor() {
    super('Passport cannot be the same', HttpStatus.BAD_REQUEST);
  }
}

export class FailedToLocationUserException extends HttpException {
  constructor() {
    super('Failed to locate user', HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.CONFLICT);
  }
}

export class EmailNotFoundException extends HttpException {
  constructor() {
    super('Email not found', HttpStatus.NOT_FOUND);
  }
}

export class CategoryNotFoundException extends HttpException {
  constructor() {
    super('Category not found', HttpStatus.NOT_FOUND);
  }
}

export class CategoryNotCreatedException extends HttpException {
  constructor() {
    super('Category not created', HttpStatus.NOT_FOUND);
  }
}

export class CategoryAlreadyExistsException extends HttpException {
  constructor() {
    super('Category already exists', HttpStatus.CONFLICT);
  }
}

export class CategoryNotUpdatedException extends HttpException {
  constructor() {
    super('Category not updated', HttpStatus.NOT_FOUND);
  }
}

export class CategoryNotDeletedException extends HttpException {
  constructor() {
    super('Category not deleted', HttpStatus.NOT_FOUND);
  }
}

export class TagNotFoundException extends HttpException {
  constructor() {
    super('Tag not found', HttpStatus.NOT_FOUND);
  }
}

export class TagNotCreatedException extends HttpException {
  constructor() {
    super('Tag not created', HttpStatus.NOT_FOUND);
  }
}

export class PostNotFoundException extends HttpException {
  constructor() {
    super('Post not found', HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedAccessException extends HttpException {
  constructor() {
    super('Unauthorized this resource', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidUUIDException extends HttpException {
  constructor() {
    super('Invalid UUID', HttpStatus.BAD_REQUEST);
  }
}

export class UUIDCannotBeNotEmptyException extends HttpException {
  constructor() {
    super('UUID cannot be not empty found', HttpStatus.NOT_FOUND);
  }
}

export class AccountIsAlreadyDeactivatedException extends HttpException {
  constructor() {
    super('Account is already deactivated', HttpStatus.CONFLICT);
  }
}

export class NoActiveSessionsFoundException extends HttpException {
  constructor() {
    super('No active sessions found', HttpStatus.NOT_FOUND);
  }
}
