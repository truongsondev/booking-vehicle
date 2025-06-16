import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from './oss';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('merge/file')
  mergeFile(@Query('file') fileName: string, @Res() res: Response) {
    const nameDir = 'uploads/' + fileName;
    //read
    const files = fs.readdirSync(nameDir);

    let startPos = 0;
    let count = 0;
    files.map((file) => {
      const filePath = nameDir + '/' + file;
      const streamFile = fs.createReadStream(filePath);
      streamFile
        .pipe(
          fs.createWriteStream('uploads/merge/' + fileName, {
            start: startPos,
          }),
        )
        .on('finish', () => {
          count++;
          console.log('count>>', count);
          if (count === files.length) {
            fs.rm(nameDir, { recursive: true }, () => {});
          }
        });
      startPos += fs.statSync(filePath).size;
    });
    return res.json({
      link: `http://localhost:3000/uploads/${fileName}`,
      fileName,
    });
  }

  @Post('upload/large-file')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads/avt',
      storage: storage,
    }),
  )
  uploadLargeFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log('File uploaded body:', body);
    console.log('File uploaded :', files);
    const fileName = body.name.match(/(.+)-\d+$/)?.[1] ?? body.name;
    const nameDir = 'uploads/chunks-' + fileName;
    // mkdir
    if (!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir);
    }

    // copy files to the directory
    fs.cpSync(files[0].path, nameDir + '/' + body.name);
    fs.rmSync(files[0].path);
  }

  @Post('upload/avt')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/avt',
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 3, // 3MB
      },
      fileFilter: (req, file, cb) => {
        // extName
        const extName = path.extname(file.originalname);
        if (['.jpg', '.png', '.gif'].includes(extName)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('File uploaded:', file.path);
    return file.path;
  }

  @Post('new')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
