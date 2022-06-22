/**
* Genrate random int
* @param min 
* @param max 
* @returns random int - min & max inclusive
*/
export const generateRandomNumber = (min: number, max: number) => {
  const minimum: number = Math.ceil(min);
  const maximum: number = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum; 
}
