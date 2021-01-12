import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType({ description: 'Credentials input for user login' })
export class UserCredentialsInput {
  @Field({ description: 'The username of the user.' })
  username: string;

  @Field({ description: 'The password (in clear) of the user. ' })
  password: string;
}

@InputType({ description: 'Credentials input for updating a user account.' })
export class UpdateUserCredentialsInput {
  @Field({ description: 'The username of the user.', nullable: true })
  @IsOptional()
  username: string;

  @Field({
    description: 'The password (in clear) of the user.',
    nullable: true,
  })
  @IsOptional()
  password: string;
}
