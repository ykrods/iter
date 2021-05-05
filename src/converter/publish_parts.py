from docutils.core import (
    publish_parts,
)
from docutils.writers.html5_polyglot import Writer

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
        return result['html_body']
    except Exception:
        # Exceptions may be thrown when parsing fails,
        # but the error is output by docutils, so there is nothing to do.
        return None
