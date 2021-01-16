const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newRow = () => {
  return {
    meters: Math.floor(Math.random() * 30),
    feet: Math.floor(Math.random() * 30),
    fspl: Math.floor(Math.random() * 30),
    beacondbm: Math.floor(Math.random() * 30),
    powerdbm: Math.floor(Math.random() * 30),
    powerw: Math.floor(Math.random() * 30),
    rfefficiency: Math.floor(Math.random() * 30),
    rectefficiency: Math.floor(Math.random() * 30),
    pdcw: Math.floor(Math.random() * 30),
  };
};

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newRow(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
