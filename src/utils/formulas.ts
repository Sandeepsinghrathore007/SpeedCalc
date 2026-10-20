// Mental Math Formulas, Shortcuts, & Mnemonic Knowledge Base

export function getTableHint(row: number, col: number, operation: 'multiply' | 'add' | 'subtract' = 'multiply') {
  if (operation === 'multiply') {
    const tens = Math.floor(row / 10) * 10;
    const units = row % 10;

    if (row === 5 || col === 5) {
      return {
        tag: 'Halve & Ten Rule',
        formula: `${row} × ${col} = (${row === 5 ? col : row} ÷ 2) × 10 = ${row * col}`,
        explanation: 'Multiply by 10 and divide by 2 for instantaneous recall with zero carryover.'
      };
    }

    if (row === 9 || col === 9) {
      const other = row === 9 ? col : row;
      return {
        tag: 'Base 10 Deficit',
        formula: `${row} × ${col} = (${other} × 10) - ${other} = ${other * 10} - ${other} = ${row * col}`,
        explanation: 'Treat 9 as (10 - 1). Multiply by 10 and subtract the number once.'
      };
    }

    if (tens > 0 && units !== 0) {
      const part1 = tens * col;
      const part2 = units * col;
      return {
        tag: 'Tens Split & Merge',
        formula: `(${tens} × ${col} = ${part1}) + (${units} × ${col} = ${part2}) = ${part1 + part2}`,
        explanation: `Deconstruct ${row} into round tens (${tens}) and single unit (${units}). Sum the two elementary products.`
      };
    }

    return {
      tag: 'Direct Product',
      formula: `${row} × ${col} = ${row * col}`,
      explanation: 'Core multiplication anchor. Memorize this cell as an instantaneous reflex.'
    };
  }

  if (operation === 'add') {
    const tens = Math.floor(row / 10) * 10;
    const units = row % 10;
    return {
      tag: 'Round Base Addition',
      formula: `(${tens} + ${col}) + ${units} = ${tens + col + units}`,
      explanation: 'Jump to the nearest round ten, then add the residual digit.'
    };
  }

  // subtract
  return {
    tag: 'Complement Subtraction',
    formula: `${row} − ${col} = (${row} − 10) + ${10 - col} = ${row - col}`,
    explanation: 'Subtract to 10 base first, then add back the 10-complement.'
  };
}

export function getSquareHint(num: number) {
  if (num % 10 === 5) {
    const ten = Math.floor(num / 10);
    return {
      tag: 'Ending in 5 Law',
      formula: `${num}² = [${ten} × (${ten} + 1)] || 25 = [${ten * (ten + 1)}]25 = ${num * num}`,
      explanation: 'Multiply the ten digit by its consecutive successor and append 25.'
    };
  }

  if (num >= 40 && num <= 60) {
    const diff = num - 50;
    const prefix = 25 + diff;
    const suffix = (diff * diff).toString().padStart(2, '0');
    return {
      tag: 'Base 50 Expansion',
      formula: `${num}² = (25 + ${diff}) || (${diff})² = ${prefix}${suffix} = ${num * num}`,
      explanation: 'Compare to Base 50. Left digits = (25 + deviation). Right two digits = deviation squared.'
    };
  }

  if (num >= 20 && num <= 30) {
    const diff = num - 25;
    return {
      tag: 'Base 25 Pivot',
      formula: `${num}² = 625 + (${diff} × 50) + ${diff * diff} = ${num * num}`,
      explanation: 'Pivot around 25² (625) using algebraic expansion (25 + d)².'
    };
  }

  const tens = Math.floor(num / 10) * 10;
  const d = num % 10;
  return {
    tag: '(a + b)² Expansion',
    formula: `(${tens} + ${d})² = ${tens * tens} + 2(${tens}×${d}) + ${d * d} = ${num * num}`,
    explanation: 'Split into tens and units: a² + 2ab + b².'
  };
}

export const CUBES_DATA = [
  { n: 1, cube: 1, unit: 1 },
  { n: 2, cube: 8, unit: 8 },
  { n: 3, cube: 27, unit: 7 },
  { n: 4, cube: 64, unit: 4 },
  { n: 5, cube: 125, unit: 5 },
  { n: 6, cube: 216, unit: 6 },
  { n: 7, cube: 343, unit: 3 },
  { n: 8, cube: 512, unit: 2 },
  { n: 9, cube: 729, unit: 9 },
  { n: 10, cube: 1000, unit: 0 },
  { n: 11, cube: 1331, unit: 1 },
  { n: 12, cube: 1728, unit: 8 },
  { n: 13, cube: 2197, unit: 7 },
  { n: 14, cube: 2744, unit: 4 },
  { n: 15, cube: 3375, unit: 5 },
];

export const FRACTIONS_DATA = [
  { frac: '1/2', pct: 50, str: '50%' },
  { frac: '1/3', pct: 33.33, str: '33.33%' },
  { frac: '2/3', pct: 66.67, str: '66.67%' },
  { frac: '1/4', pct: 25, str: '25%' },
  { frac: '3/4', pct: 75, str: '75%' },
  { frac: '1/5', pct: 20, str: '20%' },
  { frac: '2/5', pct: 40, str: '40%' },
  { frac: '3/5', pct: 60, str: '60%' },
  { frac: '4/5', pct: 80, str: '80%' },
  { frac: '1/6', pct: 16.67, str: '16.67%' },
  { frac: '5/6', pct: 83.33, str: '83.33%' },
  { frac: '1/7', pct: 14.28, str: '14.28%' },
  { frac: '2/7', pct: 28.57, str: '28.57%' },
  { frac: '3/7', pct: 42.85, str: '42.85%' },
  { frac: '1/8', pct: 12.5, str: '12.5%' },
  { frac: '3/8', pct: 37.5, str: '37.5%' },
  { frac: '5/8', pct: 62.5, str: '62.5%' },
  { frac: '7/8', pct: 87.5, str: '87.5%' },
  { frac: '1/9', pct: 11.11, str: '11.11%' },
  { frac: '2/9', pct: 22.22, str: '22.22%' },
  { frac: '1/10', pct: 10, str: '10%' },
  { frac: '1/11', pct: 9.09, str: '9.09%' },
  { frac: '1/12', pct: 8.33, str: '8.33%' },
  { frac: '5/12', pct: 41.67, str: '41.67%' },
  { frac: '7/12', pct: 58.33, str: '58.33%' },
];

export const OPPOSITE_PAIRS: Record<string, string> = {
  A: 'Z', B: 'Y', C: 'X', D: 'W', E: 'V', F: 'U', G: 'T',
  H: 'S', I: 'R', J: 'Q', K: 'P', L: 'O', M: 'N',
  N: 'M', O: 'L', P: 'K', Q: 'J', R: 'I', S: 'H', T: 'G',
  U: 'F', V: 'E', W: 'D', X: 'C', Y: 'B', Z: 'A'
};

export const EJOTY_ANCHORS = [
  { char: 'E', pos: 5 },
  { char: 'J', pos: 10 },
  { char: 'O', pos: 15 },
  { char: 'T', pos: 20 },
  { char: 'Y', pos: 25 },
];
