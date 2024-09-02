export function splitMarkdownByHeadings(markdown: string) {
  const sections: { [key: string]: string } = {};
  const lines = markdown.split("\n");
  let currentHeading = "";

  lines.forEach((line) => {
    // Check if the line starts with a heading format: "**Heading**:"
    if (line.startsWith("**") && line.includes(":")) {
      // Extract heading and content
      const [rawHeading, rawContent] = line.split(":");
      currentHeading = rawHeading.slice(2); // Remove "**" from the heading
      sections[currentHeading] = rawContent.slice(2); // Join the content parts
    } else if (currentHeading) {
      // Append content to the current heading
      sections[currentHeading] += "\n" + line;
    }
  });

  // Ensure each section ends without trailing newlines
  for (const heading in sections) {
    sections[heading] = sections[heading];
  }

  return sections;
}
