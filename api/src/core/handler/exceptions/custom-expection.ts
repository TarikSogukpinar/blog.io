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

export class TagNotFoundException extends HttpException {
  constructor() {
    super('Tag not found', HttpStatus.NOT_FOUND);
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

