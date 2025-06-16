import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Account name is required' })
  accountName: string;
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
