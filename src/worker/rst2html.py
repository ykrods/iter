from docutils.core import (
    publish_parts,
)
from docutils.writers.html5_polyglot import Writer

try:
    from pyodide.ffi import to_js
except:
    def to_js(x): return x


settings_overrides = {
    'output_encoding': 'unicode',
    'doctitle_xform': False,
    'file_insertion_enabled': False,
    'raw_enabled': False,
    'syntax_highlight': 'short',
}

def rst2html(rst):
    try:
        result = publish_parts(
            source=rst,
            writer=Writer(),
            settings_overrides=settings_overrides,
        )
        html = result['html_body']

        # Since docutils 0.17, document root node is translated to <main> tag.
        # Because main tag is not recommended to use multiple times in a document,
        # Replace to div here.
        html = html.replace("<main>", "<div class='document'>")
        html = html.replace("</main>", "</div>")

        return to_js(html)
    except Exception:
        # Exceptions may be thrown when parsing fails,
        # but the error is output by docutils, so there is nothing to do.
        return to_js(None)
