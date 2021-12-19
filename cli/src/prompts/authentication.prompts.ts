import { Command } from "@oclif/core";
import { prompt } from "enquirer";
import color from "@oclif/color";

export interface AuthPromptResponse {
  username: string;
  password: string;
}

export async function authPrompt(this: Command): Promise<AuthPromptResponse> {
  this.log(`Not currently ${color.red("logged in")}...`);

  const response = await prompt<AuthPromptResponse>([
    {
      type: "input",
      name: "username",
      message: "What is your username?",
    },
    {
      type: "password",
      name: "password",
      message: "What is your password?",
    },
  ]);

  return response;
}
