export type Options = {};
export type OutputMimeType =
  | "text/calendar"
  | "text/css"
  | "text/csv"
  | "text/html"
  | "text/javascript"
  | "text/plain"
  | "text/xml"
  | "application/json";
type Metadata = {
  mimeType: OutputMimeType;
};

type Output = { output: string; metadata: Metadata };
type SortFn<T> = (input: T, options: Options, metadata: Metadata) => Output;

export const sort: SortFn<string> = (
  textString: string,
  options: Options,
  metadata = { mimeType: "text/plain" }
) => {
  try {
    const json = JSON.parse(textString);

    if (Array.isArray(json)) {
      return sortJsonArray(json, options, metadata);
    } else {
      throw new Error("Can't sort json objects");
    }
  } catch (e) {
    // content is not JSON, do not continue
  }

  const lines = textString.split("\n");
  if (lines.length > 1) {
    return sortTextLines(lines, options, metadata);
  }
  if (lines.length === 0) {
    return { output: "", metadata };
  }
  const line = lines[0];
  const commaSeparated = line.split(",");
  if (commaSeparated.length > 0) {
    return sortCommaSeparatedLine(commaSeparated, options, metadata);
  }
  return { output: textString.split("\n").toSorted().join("\n"), metadata };
};

const sortJsonArray: SortFn<Array<unknown>> = (array, options, metadata) => {
  metadata.mimeType = "application/json";
  return { output: JSON.stringify(array, undefined, 2), metadata };
};

const sortTextLines: SortFn<Array<string>> = (lines, options, metadata) => {
  return { output: lines.toSorted().join("\n"), metadata };
};

const sortCommaSeparatedLine: SortFn<Array<string>> = (
  parts,
  options,
  metadata
) => {
  const output = parts
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .toSorted()
    .join("\n");

  return {
    output,
    metadata,
  };
};
