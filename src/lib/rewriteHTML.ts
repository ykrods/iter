type RewriteURLOptions = {
  origin: string,
  project: string,
  key: string
}

export function rewriteURL(
  url: string,
  options: RewriteURLOptions,
): string {
  if (
    url.startsWith("http://")
      || url.startsWith("https://")
      || url.startsWith("#")
  ) {
    return url;
  }

  return new URL(url, options.origin + '/' + options.key);
}

export function rewriteImageURL(
  url: string,
  options: RewriteURLOptions,
): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const { origin, project, key } = options
  const baseURL = `${origin}/raw/${project}/${key}`;

  if (url.startsWith("/")) {
    const r = new URL(`/raw/${project}${url}`, baseURL);
    return r.toString();
  }
  const r = new URL(url, baseURL);
  return r.toString();
}

export default function rewriteHTML(
  html: string,
  options: RewriteURLOptions,
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // fix link href
  doc.querySelectorAll("a").forEach((e) => {
    const url = rewriteURL(e.getAttribute("href")!, options);
    e.setAttribute("href", url);
  });

  // fix image src
  doc.querySelectorAll("img").forEach((e) => {
    const url = rewriteImageURL(e.getAttribute("src")!, options);
    e.setAttribute("src", url);
  });

  return doc.body.innerHTML;
}
