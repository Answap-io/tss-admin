export default interface IPayment {
  publicKey: string;
  paymentHash: string;
  lastModifiedTime: number;
  balance: string;
}
