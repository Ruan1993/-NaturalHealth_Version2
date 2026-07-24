export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export const lerp = (from, to, amount) => from + (to - from) * amount;
export const mapRange = (value, inputMin, inputMax, outputMin, outputMax) => outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
