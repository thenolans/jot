var alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

var alphabets13 = [
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
];

export default function scramble(str: string) {
  return str.replace(/[A-Z]/gi, rot13);

  function rot13(char: string) {
    const isUppercase = char === char.toUpperCase();
    const charIndex = alphabets.findIndex((c) => c === char.toUpperCase());
    const newChar = alphabets13[charIndex];
    return isUppercase ? newChar : newChar.toLocaleLowerCase();
  }
}
