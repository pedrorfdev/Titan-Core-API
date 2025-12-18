import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./domain/entities/user";
import { USER_REPOSITORY_TOKEN } from "./domain/repositories/IUser.repository";
import { UserRepository } from "./infra/users.repository";
import { CreateUserService } from "./services/create.service";
import { UserController } from "./infra/users.controllers";
import { FindAllUsersService } from "./services/find-all.service";
import { FindOneUserService } from "./services/find-one.service";
import { UpdateUserService } from "./services/update.service";
import { DeleteUserService } from "./services/remove.service";
import { FindByEmailService } from "./services/find-by-email.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    CreateUserService,
    FindAllUsersService,
    FindOneUserService,
    FindByEmailService,
    UpdateUserService,
    DeleteUserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository
    }
  ],
  exports: [TypeOrmModule, FindByEmailService, CreateUserService, UpdateUserService]
})
export class UserModule{}