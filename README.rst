========
iter
========

Portable project management application on browser.

Features
===========

* Issue management
* Wiki
* Note
* File upload
* Export json or zip
* Import json
* Support reStructuredText
* Support `Mermaid <http://mermaid-js.github.io/mermaid/>`_
* Using indexedDB as datastore, so all data are stored into browser and will not be sent to the outside.

TIPS
=======

mermaid example
--------------------

::

  .. mermaid::

    graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;

* for more diagram examples: https://mermaid-js.github.io/mermaid/#/

wiki and wiki link
---------------------

To create new page,

1. Create a link on wiki.

   Example:

   ::

     * `spec <spec>`_

2. Click link and edit wiki content.

file link
---------------

For export zip, it's recommended to use relative url.

::

  .. image:: ../files/foo-diagram.png
