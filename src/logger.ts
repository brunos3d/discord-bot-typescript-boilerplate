import chalk from 'chalk';

export function log(title: string, ...message: any[]) {
  console.log(`[${chalk.blueBright(title)}] ${chalk.gray.bold(getFormattedTime())}`, ...message);
}

export function error(title: string, ...message: any[]) {
  console.error(`${chalk.gray.bold(getFormattedTime())} [${chalk.red(title)}]`, ...message);
}

function getFormattedTime() {
  const date = new Date();
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
}

export default { log, error };
