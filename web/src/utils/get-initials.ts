export function getInitials(name: string) {
  const names = name.split(" ");
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
