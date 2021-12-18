import { Command, Flags } from "@oclif/core";
import { GetF } from "../../utilities";
import { AuthenticationService } from "../../services/authentication.service";

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

    if (!email)
      this.error("No email provided.");
    if (!password)
    this.error("No password provided.");

    if (flags.email && args.email)
      this.warn(
        "Multiple email inputs detected, using email provided in arguments."
      );
    if (flags.password && args.password)
      this.warn(
        "Multiple password inputs detected, using password provided in arguments."
      );

    // TODO: validate email and password
      
    const auth = new AuthenticationService(this);

    await auth.hydrateAuthToken(email, password);
  }
}
