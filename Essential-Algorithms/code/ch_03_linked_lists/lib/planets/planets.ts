// tslint:disable: max-line-length
/*
                                MERCURY   VENUS 	  EARTH   MOON    MARS    JUPITER   SATURN    URANUS    NEPTUNE
    Mass (1024kg)	              0.330	    4.87	    5.97    0.073	  0.642	  1898	    568       86.8	    102
    Diameter (km)	              4879	    12,104    12,756  3475	  6792	  142,984	  120,536	  51,118	  49,528
    Distance from Sun (106 km)	57.9	    108.2	    149.6   0.384*	227.9	  778.6	    1433.5	  2872.5	  4495.1
*/

import { Planet, PlanetName, ThreadName } from './types';

const mercury = planet(PlanetName.Mecury, 0.330, 4879, 57.9);
const venus = planet(PlanetName.Venus, 4.87, 12104, 108.2);
const earth = planet(PlanetName.Earth, 5.97, 12756, 149.6);
const mars = planet(PlanetName.Mars, 0.642, 6792, 227.9);
const jupiter = planet(PlanetName.Jupiter, 1898, 142984, 778.6);
const saturn = planet(PlanetName.Saturn, 568, 120536, 1433.5);
const uranus = planet(PlanetName.Uranus, 86.8, 51118, 2872.5);
const neptune = planet(PlanetName.Neptune, 102, 49582, 4495.1);

const planetsByName:  Readonly<Record<PlanetName, Planet>> = Object.freeze({
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
});

const planets: ReadonlyArray<Planet> = Object.values(planetsByName);

function planet(name: PlanetName, mass: number, diameter: number, distanceToSun: number): Readonly<Planet> {
  return Object.freeze({
    name,
    mass,
    diameter,
    distanceToSun,
    threads: {},
  });
}

export {
  planets,
  planetsByName,
}
