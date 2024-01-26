===========
Iter
===========

build
==========

- Pygments の css は以下のコマンド or スクリプトで生成する

  ::

    $ pygmentize -f html -S default > src/static/public/pygments-default.css

  .. code-block:: python

    from pygments.formatters import HtmlFormatter
    print(HtmlFormatter().get_style_defs('.document'))
