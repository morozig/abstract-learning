const randomOf = <T>(list: T[]) => list[
  Math.floor(Math.random() * list.length)
];

export {
  randomOf
};
