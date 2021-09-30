export default class Payment {
  constructor(
    public publicKey: string,
    public paymentHash: string,
    public lastModifiedTime: number,
    public balance: string
  ) {}

  public static createNull(): Payment {
    return new Payment("", "", 0, "");
  }
}
