from importlib.metadata import version

for pkg in ["docutils", "Pygments"]:
    print(pkg + ': ' + version(pkg))
