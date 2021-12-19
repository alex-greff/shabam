import { Command, Flags } from "@oclif/core";
import cli from "cli-ux";
import { GetF } from "../../types";
import { AuthenticationService } from "../../services/authentication.service";

interface Args {
  username?: string;
  password?: string;
}

export default class Signup extends Command {
  static description = "Signup to Shabam.";

  static flags = {
    username: Flags.string({
      char: "u",
      description: "Username to signup with.",
    }),
    password: Flags.string({
      char: "p",
      description: "Password to signup with.",
    }),
  };

  static args = [
    {
      name: "username",
      description: "Username to signup with.",
    },
    {
      name: "password",
      description: "Password to signup with.",
    },
  ];

  static examples = [
    `$ shabam signup test@example.com myPassword`,
    `$ shabam signup --email test@example.com --password myPassword`,
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse<GetF<typeof Signup>, Args>(Signup);

    const username = args.username ?? flags.username;
    const password = args.password ?? flags.password;

    if (!username) this.error("No username provided.");
    if (!password) this.error("No password provided.");

    if (flags.username && args.username)
      this.warn(
        "Multiple username inputs detected, using username provided in arguments."
      );
    if (flags.password && args.password)
      this.warn(
        "Multiple password inputs detected, using password provided in arguments."
      );

    // TODO: validate username and password

    cli.action.start("Signing up");

    const auth = new AuthenticationService(this);

    try {
      await auth.hydrateAuthToken(username, password, "signup");
    } catch (err) {
      this.error("Failed to signup.");
    }

    cli.action.stop();
  }
}
