function getRandomOddNumbers() {
  const oddNumbers = [];
  while (oddNumbers.length < 4) {
    const randomNumber = Math.floor(Math.random() * 36) + 1;
    if (randomNumber % 2 !== 0 && !oddNumbers.includes(randomNumber)) {
      oddNumbers.push(randomNumber);
    }
  }
  return oddNumbers.map((number) => number.toString());
}

function getRandomEvenNumbers() {
  const evenNumbers = [];
  while (evenNumbers.length < 4) {
    const randomNumber = Math.floor(Math.random() * 36) + 1;
    if (randomNumber % 2 === 0 && !evenNumbers.includes(randomNumber)) {
      evenNumbers.push(randomNumber);
    }
  }
  return evenNumbers.map((number) => number.toString());
}

module.exports = { getRandomEvenNumbers, getRandomOddNumbers };
