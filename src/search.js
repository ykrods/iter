/**
 * Result : { model, displayText, url }
 */
export async function search(project, input) {
  if (!project || input.length < 2) {
    return [];
  }
  const re = new RegExp(input);

  let query = await project.db.issues
      .filter(o => re.test(o.body) || re.test(o.title))
      .toArray();

  let ret = query.map((issue) => {
    return {
      model: "Issue",
      displayText: issue.title,
      url: project.url(`/issues/${issue.id}`),
    }
  });

  query = await project.db.wiki_pages.filter(o => re.test(o.body)).toArray();
  ret = ret.concat(query.map((wiki_page) => {
    return {
      model: "Wiki",
      displayText: wiki_page.heading,
      url: project.url(`/wiki/${wiki_page.path}`),
    };
  }));

  query = await project.db.notes.filter(o => re.test(o.body)).toArray();
  ret = ret.concat(query.map((note) => {
    return {
      model: "Note",
      displayText: note.heading, // TODO: should be matched statement.
      url: project.url(`/notes?id=${note.id}`),
    };
  }));
  return ret;
}
