export interface IDog {
  name: string;
}

export interface ICanine {
  dog: IDog;
}

export interface IAnimal {
  canine: ICanine;
}

export interface Example {
  Foo: string;
}
