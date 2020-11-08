/*
  Write a program that builds a multithreaded linked list of the
  planets, as described in the section “Multithreaded Linked
  Lists.” Let the user click a radio button or select from a
  combo box to display the planets ordered by the different
  threads. (Hint: Make a Planet class with fields Name,
  DistanceToSun, Mass, Diameter, NextDistance, NextMass, and
  NextDiameter. Then make an AddPlanetToList method that adds a
  planet to the threads in sorted order.)
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createPlanetList } from './lib/planets';
import { planetsByName } from './lib/planets/planets';
import { PlanetList, PlanetName, ThreadName } from './lib/planets/types';

const getPlanetOrder = (list: PlanetList, thread: ThreadName) =>
  list
    .toArray(thread)
    .map((planet) => planet.name);

const data = {
  diameter: {
    sut: (list: PlanetList) => getPlanetOrder(list, ThreadName.NextDiameter),
    expected: [
      PlanetName.Mecury,
      PlanetName.Mars,
      PlanetName.Venus,
      PlanetName.Earth,
      PlanetName.Neptune,
      PlanetName.Uranus,
      PlanetName.Saturn,
      PlanetName.Jupiter,
    ],
  },
  mass: {
    sut: (list: PlanetList) => getPlanetOrder(list, ThreadName.NextMass),
    expected: [
      PlanetName.Mecury,
      PlanetName.Mars,
      PlanetName.Venus,
      PlanetName.Earth,
      PlanetName.Uranus,
      PlanetName.Neptune,
      PlanetName.Saturn,
      PlanetName.Jupiter
    ],
  },
  distance: {
    sut: (list: PlanetList) => getPlanetOrder(list, ThreadName.NextDistance),
    expected: [
      PlanetName.Mecury,
      PlanetName.Venus,
      PlanetName.Earth,
      PlanetName.Mars,
      PlanetName.Jupiter,
      PlanetName.Saturn,
      PlanetName.Uranus,
      PlanetName.Neptune
    ],
  },
};

describe(basename, () => {

  Object.entries(data).forEach(([metric, { sut, expected }]) => {

    it(`should return planets sorted by ${metric}`, () => {
      const planetList = createPlanetList();
      const actual = sut(planetList);
      expect(actual).to.eql(expected);
    });

  });

});
