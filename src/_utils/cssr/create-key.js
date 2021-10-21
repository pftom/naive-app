export function createKey(prefix, suffix) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    prefix +
    (suffix === "default"
      ? ""
      : suffix.replace(/^[a-z]/, (startChar) => startChar.toUpperCase()))
  );
}
