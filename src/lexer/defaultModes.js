export function createDefaultModes(baseReaders, TemplateStringReader, RegexOrDivideReader, JSXReader) {
  const shared = [...baseReaders];
  return {
    default: [...shared],
    do_block: [...shared],
    module_block: [...shared],
    template_string: [TemplateStringReader],
    regex: [RegexOrDivideReader],
    jsx: [JSXReader],
  };
}
