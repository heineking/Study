export enum PlanetName {
  Mecury = 'mercury',
  Venus = 'venus',
  Earth = 'earth',
  Mars = 'mars',
  Jupiter = 'jupiter',
  Saturn = 'saturn',
  Uranus = 'uranus',
  Neptune = 'neptune',
}

export enum ThreadName {
  NextDiameter = 'nextDiameter',
  NextDistance = 'nextDistance',
  NextMass = 'nextMass',
}

export type Threads = { [name in ThreadName]?: Planet };

export interface Planet {
  readonly name: PlanetName;
  readonly distanceToSun: number;
  readonly mass: number;
  readonly diameter: number;
  readonly threads: Threads;
}

export interface PlanetList {
  add(planet: Planet): void;
  toArray(thread: ThreadName): Planet[];
}
