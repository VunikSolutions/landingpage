const n = str.length;
const baseLength = Math.floor(n / x);
const extra = n % x;

const lines = [];
let index = 0;

for (let i = 0; i < x; i++) {
  let currentLength = baseLength + (i < extra ? 1 : 0);
  lines.push(str.slice(index, index + currentLength));
  index += currentLength;
}

for (let i = 0; i < lines.length; i++) {
  if (i % 2 === 1) {
    lines[i] = lines[i].split('').reverse().join('');
  }
}

const solucao = lines.join('');
return solucao;
