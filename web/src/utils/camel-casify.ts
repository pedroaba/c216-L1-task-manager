const REGEX_TO_SPLIT = /[\s\-_.]+/;

type CamelCasifyOptions = {
  keepFirstLetterUpperCase?: boolean;
};

export function camelCasify(
  str: string,
  options: CamelCasifyOptions = { keepFirstLetterUpperCase: false }
): string {
  // Remove espaços no início e fim
  const trimmed = str.trim();

  // Se a string estiver vazia, retorna vazia
  if (!trimmed) {
    return "";
  }

  // Divide a string por separadores comuns (espaço, hífen, underscore, etc)
  // e também por transições de minúscula para maiúscula (camelCase/PascalCase)
  return (
    trimmed
      // Adiciona um separador antes de letras maiúsculas precedidas por minúsculas
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // Adiciona um separador antes de números precedidos por letras
      .replace(/([a-zA-Z])(\d)/g, "$1-$2")
      // Divide por separadores comuns (espaço, hífen, underscore, ponto)
      .split(REGEX_TO_SPLIT)
      // Filtra strings vazias
      .filter((word) => word.length > 0)
      // Transforma em camelCase
      .map((word, index) => {
        const lowerWord = word.toLowerCase();
        if (index === 0) {
          if (options.keepFirstLetterUpperCase) {
            return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
          }

          return lowerWord;
        }

        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
      })
      .join("")
  );
}
