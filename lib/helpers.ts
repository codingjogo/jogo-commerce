
export function capitalizeWords(input: string) {
  return input
    .toLowerCase() // Convert the entire string to lowercase
    .split(" ") // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}

export function validateColorName(color: string) {
  const style = new Option().style;
  style.color = color;
 
  // Check if the computed color is the same as the input color
  return style.color == color;
 }

 export function stringToSlug(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing spaces
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with a hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
}