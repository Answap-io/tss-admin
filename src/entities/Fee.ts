export default class Fee {
  public constructor(public min: string, public max: string) {}

  public static createNull(): Fee {
    return new Fee("", "");
  }
}
