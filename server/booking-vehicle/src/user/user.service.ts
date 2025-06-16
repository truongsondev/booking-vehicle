import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { DbService } from 'src/db/db.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  private readonly dbService: DbService;
  async register(registerUsserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();
    const exitingUser = users.find(
      (user) => user.accountName === registerUsserDto.accountName,
    );
    if (exitingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = new User();
    user.accountName = registerUsserDto.accountName;
    user.password = registerUsserDto.password;

    users.push(user);

    this.dbService.write(users);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();
    const user = users.find(
      (user) => user.accountName === loginUserDto.accountName,
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (user.password !== loginUserDto.password) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
