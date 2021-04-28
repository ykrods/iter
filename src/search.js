/**
 * Result : { model, displayText, url }
 */
export async function search(project, input) {
  if (!project || input.length < 2) {
    return [];
  }
  const re = new RegExp(input);
  let tmp = await project.db.notes.filter(o => re.test(o.body)).toArray();

  return tmp.map(note => {
        return {
        model: "Note",
        displayText: note.heading, // TODO: should be matched statement.
        url: project.url(`/notes?id=${note.id}`),
      };
    });
  // return [];
}
