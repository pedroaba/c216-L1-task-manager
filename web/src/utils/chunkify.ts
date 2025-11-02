export function* chunkify<T>(array: T[], size: number): Generator<T[]> {
  if (size <= 0) {
    throw new Error("Size must be greater than 0");
  }

  for (let i = 0; i < array.length; i += size) {
    const currentChunk = new Array<T>(size);
    const stopPointer = Math.min(size, array.length - i);

    for (let k = 0; k < stopPointer; k++) {
      currentChunk[k] = array[i + k];
    }

    yield currentChunk;
  }
}
