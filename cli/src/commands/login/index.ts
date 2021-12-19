import { Command, Flags } from "@oclif/core";
import cli from "cli-ux";
import { GetF } from "../../types";
import { AuthenticationService } from "../../services/authentication.service";

interface Args {
  username?: string;
  password?: string;
}

export default class Login extends Command {
  static description = "Login to the Shabam CLI.";

  static flags = {
    username: Flags.string({
      char: "u",
      description: "Username to login with.",
    }),
    password: Flags.string({
      char: "p",
      description: "Password to login with.",
    }),
  };

  static args = [
    {
      name: "username",
      description: "Username to login with.",
    },
    {
      name: "password",
      description: "Password to login with.",
    },
  ];

  static examples = [
    `$ shabam login test@example.com myPassword`,
    `$ shabam login --email test@example.com --password myPassword`,
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse<GetF<typeof Login>, Args>(Login);

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

    cli.action.start("Logging in");

    const auth = new AuthenticationService(this);

    try {
      await auth.hydrateAuthToken(username, password);
    } catch(err) {
      this.error("Failed to login.");
    }

    cli.action.stop();
  }
}
