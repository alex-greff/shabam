import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Min, Max } from 'class-validator';

@InputType({ description: 'Credentials input for user login' })
export class UserDataInput {
  @Field({ description: 'The username of the user.' })
  @Min(6)
  @Max(15)
  username: string;

  @Field({ description: 'The password (in clear) of the user. ' })
  @Min(6)
  password: string;
}

@InputType({ description: 'Credentials input for updating a user account.' })
export class UpdateUserCredentialsInput {
  @Field({ description: 'The username of the user.', nullable: true })
  @IsOptional()
  @Min(6)
  @Max(15)
  username?: string;

  @Field({
    description: 'The password (in clear) of the user.',
    nullable: true,
  })
  @IsOptional()
  password?: string;
}
