import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "../domain/repositories/IUser.repository";
import type { CreateUserDto } from "../domain/dto/create-user.dto";
import { User } from "../domain/entities/user";
import bcrypt from "node_modules/bcryptjs";

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException('Nome de usuário ou Email já em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = new User();
    Object.assign(newUser, createUserDto);
    newUser.password = hashedPassword;

    return this.userRepository.create(newUser);
  }
}