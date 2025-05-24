class Logger {
  log(message: string, data?: object) {
    console.log(this.prepareMessage(message, data));
  }

  error(message: string, data?: object) {
    console.error(this.prepareMessage(message, data));
  }

  private prepareMessage(message: string, data?: object) {
    return { date: new Date().toISOString(), message, data: data || {} };
  }
}

export const logger = new Logger();
