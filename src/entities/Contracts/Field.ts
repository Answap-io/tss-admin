export default class Field {
  constructor(
    public name: string,
    public type: string,
    public description: string,
    public rule: RuleTypes
  ) {}

  public static createNull(): Field {
    return new Field("", "", "", RuleTypes.Optional);
  }
}

export enum RuleTypes {
  Required = "Required",
  Optional = "Optional",
}
