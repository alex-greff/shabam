import { Command, Flags } from "@oclif/core";
import color from "@oclif/color";
import { GetF } from "../../types";
import { AuthenticationService } from "../../services/authentication.service";
import * as AuthenticationPrompts from "../../prompts/authentication.prompts";

interface Args {
  username?: string;
  password?: string;
}

export default class Signin extends Command {
  static description = "Signin to Shabam.";

  static flags = {
    username: Flags.string({
      char: "u",
      description: "Username to signin with.",
    }),
    password: Flags.string({
      char: "p",
      description: "Password to signin with.",
      dependsOn: ["username"],
    }),
  };

  static args = [
    {
      name: "username",
      description: "Username to signin with.",
    },
    {
      name: "password",
      description: "Password to signin with.",
    },
  ];

  static examples = [
    `$ shabam signin test@example.com myPassword`,
    `$ shabam signin --email test@example.com --password myPassword`,
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse<GetF<typeof Signin>, Args>(Signin);

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
      await auth.hydrateAuthToken(username, password, "signin");
    } catch (err) {
      this.error(color.red(`Unable to signin!`));
    }

    this.log(`Signed in as ${color.blueBright(username)}!`);
  }
}
