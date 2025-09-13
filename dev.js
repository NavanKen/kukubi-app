import { exec } from "child_process";
import chalk from "chalk";

const banner = `
██╗  ██╗██╗   ██╗██╗  ██╗██╗   ██╗██████╗ ██╗
██║ ██╔╝██║   ██║██║ ██╔╝██║   ██║██╔══██╗██║
█████╔╝ ██║   ██║█████╔╝ ██║   ██║██████╔╝██║
██╔═██╗ ██║   ██║██╔═██╗ ██║   ██║██╔══██╗██║
██║  ██╗╚██████╔╝██║  ██╗╚██████╔╝██████╔╝██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝
`;

console.log(chalk.hex("#ea580c")(banner));
console.log(chalk.gray("Develop by Naufal Afandi"));
const child = exec("next dev");
child.stdout?.on("data", (data) => process.stdout.write(data));
child.stderr?.on("data", (data) => process.stderr.write(data));
