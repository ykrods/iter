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
  const { origin, project, key } = options;
  const r = new URL(url, [origin, project, key].join("/"));
  return r.pathname;
}

export function rewriteImageURL(
  url: string,
  options: RewriteURLOptions,
): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const { origin, project, key } = options;
  const baseURL = [origin, "raw", project, key].join("/");

  if (url.startsWith("/")) {
    const r = new URL(`/raw/${project}${url}`, baseURL);
    return r.pathname;
  }
  const r = new URL(url, baseURL);
  return r.pathname;
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
