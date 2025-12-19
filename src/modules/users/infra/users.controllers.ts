import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import type { CreateUserDto } from '../domain/dto/create-user.dto';
import type { UpdateUserDto } from '../domain/dto/update-user.dto';
import { CreateUserService } from '../services/create.service';
import { FindAllUsersService } from '../services/find-all.service';
import { FindOneUserService } from '../services/find-one.service';
import { UpdateUserService } from '../services/update.service';
import { DeleteUserService } from '../services/remove.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';


@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly createService: CreateUserService,
    private readonly findAllService: FindAllUsersService,
    private readonly findOneService: FindOneUserService,
    private readonly updateService: UpdateUserService,
    private readonly deleteService: DeleteUserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.createService.execute(createUserDto);
  }

  @Get()
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneService.execute(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateService.execute(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.deleteService.execute(+id);
  }
}