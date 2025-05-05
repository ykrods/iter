"""
Setup mermaid directive

Example:

::

  .. mermaid::

    graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;

This directive is based on `sphinxcontrib-mermaid`, and modified to available
with only docutils.

* `shinxcontrib-mermaid <https://github.com/mgaitan/sphinxcontrib-mermaid>`_
"""
from docutils import nodes
from docutils.parsers.rst import (
    Directive,
    directives,
)
from docutils.writers.html5_polyglot import HTMLTranslator
from html import escape

class mermaid(nodes.General, nodes.Inline, nodes.Element):
    pass


class Mermaid(Directive):
    required_arguments = 0
    optional_arguments = 0
    final_argument_whitespace = True
    has_content = True

    def run(self):
        node = mermaid()
        node['code'] = "\n".join(self.content)

        if not node['code'].strip():
            # TODO: return warning
            return []

        return [node]


def html_visit_mermaid(self, node):
    # initialzation of mermaid.js is delegated to client app
    code = escape(node['code'])
    html = f'<div class="mermaid">{code}</div>'
    self.body.append(html)


def html_depart_mermaid(self, node):
    pass


def setup_mermaid():
    directives.register_directive("mermaid", Mermaid)

    setattr(HTMLTranslator, "visit_mermaid", html_visit_mermaid)
    setattr(HTMLTranslator, "depart_mermaid", html_depart_mermaid)
