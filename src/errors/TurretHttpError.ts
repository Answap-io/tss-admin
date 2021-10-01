export default class TurretHttpError extends Error {
  public json: string;

  public constructor(error: string) {
    super(error);
    this.json = JSON.parse(error);
  }
}
