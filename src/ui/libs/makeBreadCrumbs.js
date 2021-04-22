export function makeBreadCrumbs(project, path) {
  if (path === "Home") {
    return [{ name: "Home" }];
  }

  const ret = [{ name: "wiki", link: project.url("/wiki/") }];
  const arr = path.split("/");

  for (let i = 0; i < arr.length; i++) {
    const bc = { name: arr[i] };
    if (i < arr.length - 1) {
      bc.link = `${ret[i].link}${arr[i]}/`;
    }
    ret.push(bc);
  }
  return ret;
}
