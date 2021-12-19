import { Command, Flags } from "@oclif/core";
import color from "@oclif/color";
import { GetF } from "../../types";
import { AuthenticationService } from "../../services/authentication.service";
import * as AuthenticationPrompts from "../../prompts/authentication.prompts";

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
      dependsOn: ["username"],
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

    let username = args.username ?? flags.username;
    let password = args.password ?? flags.password;

    if (flags.username && args.username)
      this.warn(
        `Multiple username inputs detected, using username provided in ${color.blue(
          "arguments"
        )}.`
      );
    if (flags.password && args.password)
      this.warn(
        `Multiple password inputs detected, using password provided in ${color.blue(
          "arguments"
        )}.`
      );

    // Prompt user for username and password if one is missing
    if (!username || !password) {
      const response = await AuthenticationPrompts.authPrompt.bind(this)();

      username = response.username;
      password = response.password;
    }

    // TODO: validate username and password

    const auth = new AuthenticationService(this);

    try {
      await auth.hydrateAuthToken(username, password, "signup");
    } catch (err) {
      this.error(color.red(`Unable to signup!`));
    }

    this.log(`Signed up as ${color.blueBright(username)}!`);
  }
}
