import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseUUIDPipe } from 'src/common/pipes/parce-uuid.pipe';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password-user.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return new User(await this.usersService.create(createUserDto));
  }

  @Put(':id')
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException();

    const result = await this.usersService.updatePassword(
      user,
      updatePasswordDto,
    );
    if (!result)
      throw new HttpException('Wrong old password', HttpStatus.FORBIDDEN);

    return new User(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.delete(id);
    if (!user) throw new NotFoundException();
  }
}
