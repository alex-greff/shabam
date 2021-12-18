import { Command, Flags } from "@oclif/core";

export abstract class AuthenticatedCommand extends Command {
  static flags = {
    email: Flags.string({
      char: "e",
      description: "Email to login with (if not logged in already).",
    }),
    password: Flags.string({
      char: "p",
      description: "Password to login with (if not logged in already).",
    }),
  };

  async run(): Promise<void> {
    this.log("TODO: implement authentication check/prompt");
  }
}
