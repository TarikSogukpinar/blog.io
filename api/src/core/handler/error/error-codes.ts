export class ErrorCodes {
  static readonly InvalidToken = 'Invalid or expired token';
  static readonly UserNotFound = "User doesn't exist";
  static readonly InvalidCredentials = 'Invalid credentials';
  static readonly UserAlreadyExists = 'User already exists';
  static readonly NoLogsFound = 'No logs found';
  static readonly TokenBlacklisted = 'Token blacklisted';
  static readonly UnauthorizedAccess = 'Unauthorized access';
  static readonly PermissionNotFound = 'Permission not found';
  static readonly UserAlreadyHasPermission = 'User already has this permission';
  static readonly InvalidUuid = 'Invalid UUID format';  
}
