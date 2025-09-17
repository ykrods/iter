from importlib.metadata import version

for pkg in ["docutils", "pygments"]:
    print(pkg + ': ' + version(pkg))
