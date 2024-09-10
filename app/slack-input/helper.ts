export const getOptions = (searchTerm: string = ""): string[] => {
  const allOptions = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Williams",
    "Emma Brown",
  ];

  if (!searchTerm) {
    return allOptions;
  }

  return allOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const highlightText = ({
  node,
  handleMouseEnter,
  handleMouseLeave,
}: {
  node: HTMLDivElement;
  handleMouseEnter: (event: MouseEvent) => void;
  handleMouseLeave: (event: MouseEvent) => void;
}) => {
  if (!node) return;

  const text = node.textContent || "";
  const options = getOptions();
  const regex = new RegExp(`@(${options.join("|")})\\b`, "gi");

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  text.replace(regex, (match, name, offset) => {
    fragment.appendChild(
      document.createTextNode(text.slice(lastIndex, offset))
    );

    const span = document.createElement("span");
    span.className = "bg-yellow-200";
    span.textContent = match;
    span.dataset.name = name;

    fragment.appendChild(span);
    lastIndex = offset + match.length;

    return match;
  });

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  node.innerHTML = "";
  node.appendChild(fragment);

  // Event delegation
  node.addEventListener("mouseenter", handleMouseEnter, true);
  node.addEventListener("mouseleave", handleMouseLeave, true);
};
