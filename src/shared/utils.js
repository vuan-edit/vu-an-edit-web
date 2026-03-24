/**
 * Wrap each word in a <span class="word"> for hover highlight effect
 */
export function wrapWords(text) {
  return text
    .split(' ')
    .map(word => `<span class="word">${word}</span>`)
    .join(' ')
}

/**
 * Create hover-word wrapped paragraph
 */
export function hw(text) {
  return `<span class="hover-word">${wrapWords(text)}</span>`
}
