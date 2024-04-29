export function generateSlug(text: string): string {
  return (
    text
      // decompõe os caracteres acentuados em caracteres base e acentos. ex:, transforma "á" em "a´"
      .normalize('NFD')
      // remove todos os acentos
      .replace(/[\u0300-\u036f]/g, '')
      // coloca minúsculo
      .toLowerCase()
      // remove todos os caracteres que não são letras, números, espaços em branco ou hífens
      .replace(/[^\w\s-]/g, '')
      // substitui todos os espaços em branco por hífens
      .replace(/\s+/g, '-')
  )
}
