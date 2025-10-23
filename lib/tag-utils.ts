// Extract tags from text using #tag_name syntax
export function extractTagsFromText(text: string): string[] {
  const tagRegex = /#(\w+)/g
  const matches = text.matchAll(tagRegex)
  const tags = Array.from(matches, (match) => match[1])
  return [...new Set(tags)] // Remove duplicates
}

// Generate a consistent color for a tag based on its name
export function getTagColor(tag: string): string {
  // Simple hash function to generate a number from string
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Generate HSL color with good saturation and lightness for readability
  const hue = Math.abs(hash % 360)
  const saturation = 65 + (Math.abs(hash) % 20) // 65-85%
  const lightness = 45 + (Math.abs(hash >> 8) % 15) // 45-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Get contrasting text color (white or black) based on background
export function getContrastColor(backgroundColor: string): string {
  // Extract HSL values
  const match = backgroundColor.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
  if (!match) return "#ffffff"

  const lightness = Number.parseInt(match[3])
  return lightness > 50 ? "#000000" : "#ffffff"
}
