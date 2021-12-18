import { Command, Flags } from "@oclif/core";
import { GetF } from "../../utilities";

interface Args {
  email?: string;
  password?: string;
}

export default class Login extends Command {
  static description = "Login to the Shabam CLI.";

  static flags = {
    email: Flags.string({
      char: "e",
      description: "Email to login with.",
    }),
    password: Flags.string({
      char: "p",
      description: "Password to login with.",
    }),
  };

  static args = [
    {
      name: "email",
      description: "Email to login with.",
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

    const email = args.email ?? flags.email;
    const password = args.password ?? flags.password;

    // TODO: validate that email and password are provided
    // TODO: add some explicit message if arg is used over flag version

    this.log("TODO: implement login");
  }
}
