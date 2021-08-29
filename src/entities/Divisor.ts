export default class Divisor {
  public constructor(
    public upload: string,
    public run: string
  ) {
  }

  public static createNull(): Divisor {
    return new Divisor("", "");
  }
}