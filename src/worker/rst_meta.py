from docutils import nodes
from docutils.core import ( publish_doctree )


try:
    from js import Object
    from pyodide.ffi import to_js
except:
    pass


def rst_meta(rst):
    """
    rst example:

    ::

      content

      .. meta::
        :it-foo: bar
        :it-baz: 1
    """

    d = publish_doctree(rst)

    ret = [
        { "key": m.get("name").replace("it-", ""), "value": m.get("content") }
        for m
        in filter(
            lambda m: m.get("name").startswith("it-"),
            d.findall(nodes.meta)
        )
    ]
    try:
        return to_js(ret, dict_converter=Object.fromEntries)
    except:
        return ret
