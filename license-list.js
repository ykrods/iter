import path from "path";

import { execSync } from 'child_process';
import { readFileSync } from "fs";
import { stdout } from "process";


export function getLicenses() {
  const stdout = execSync("npm ls --all --long --json");
  const data = JSON.parse(stdout.toString());

  const results = {};

  walk(results, data.dependencies);

  return Object.values(results);
}

function walk(results, node) {
  if (!node) {
    return;
  }
  for (const [name, pkg] of Object.entries(node)) {
    if (Object.keys(pkg).length === 0) {
      continue;
    }
    // fetch license and homepage from package.json
    let license;
    let homepage;
    let packageJson;
    try {
      packageJson = JSON.parse(
        readFileSync(path.join(pkg.path, "package.json"), { encoding: 'utf8' })
      );
      license = packageJson.license;
      homepage = packageJson.homepage;
    } catch(err) {
      // pass
    }

    const licenseText = detectLicenseText(pkg.path, packageJson);

    let noticeText;
    try {
      noticeText = readFileSync(path.join(pkg.path, "NOTICE"), { encoding: "utf8" });
    } catch(err) {
      // pass
    }

    results[pkg.path] = {
      name,
      version: pkg.version,
      path: path.relative(".", pkg.path),
      license,
      licenseText,
      noticeText,
      homepage,
      dev: pkg.dev,
    };

    if (pkg.dependencies) {
      walk(results, pkg.dependencies);
    }
  }
}

function getEmbettedlicenseText(textPath) {
  let text;
  try {
    text = readFileSync(textPath, { encoding: 'utf8' });
  } catch(err) {
    return undefined;
  }

  const ranges = [
    ["(The MIT License)", "SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."], // MIT
    ["Copyright (c)", "EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."], // BSD
  ];

  for (const range of ranges) {
    const start = text.indexOf(range[0]);
    const end = text.indexOf(range[1]);
    if (start !== -1 && end !== -1) {
      return text.slice(start, end + range[1].length)
    }
  }
  return undefined;
}

function detectLicenseText(pkgPath, packageJson) {
  const names = ["LICENSE", "license.txt", "license.md", "LICENSE.md"];
  for (const name of names) {
    try {
      return readFileSync(path.join(pkgPath, name), { encoding: 'utf8' });
    } catch(err) {
      // console.error(err);
    }
  }

  let text = getEmbettedlicenseText(path.join(pkgPath, "README.md"));
  if (text) {
    return text;
  }
  if (packageJson.main) {
    text = getEmbettedlicenseText(path.join(pkgPath, packageJson.main));
    if (text) {
      return text;
    }
  }
  return undefined;
}

let packages = getLicenses();

for (const pkg of packages) {
  // console.log(pkg.name, pkg.version, pkg.license, pkg.dev, !!pkg.licenseText);

  // dual license
  if (pkg.name === "dompurify") {
    pkg.license = "Apache-2.0";
  }

  if (pkg.name === "has") {
    pkg.licenseText = readFileSync(
      path.join(pkg.path, "LICENSE-MIT"),
      { encoding: 'utf8' },
    );
  }
  if (pkg.name === "through") {
    pkg.licenseText = readFileSync(
      path.join(pkg.path, "LICENSE.MIT"),
      { encoding: 'utf8' },
    );
  }
}

packages.push({
  name: "docutils",
  version: "0.16",
  homepage: "https://docutils.sourceforge.io/",
  license: "BSD-2-Clause",
  licenseText: readFileSync("public/vendor/docutils/BSD-2-Clause.txt", { encoding: 'utf8' }),
});

packages.push({
  name: "pyodide",
  version: "0.16.1",
  homepage: "https://pyodide.org/en/stable/",
  license: "MPL-2.0",
  licenseText: readFileSync("public/vendor/pyodide-0.16.1-slim/LICENSE", { encoding: 'utf8' }),
});

packages.push({
  name: "pygments",
  version: "2.6.1",
  homepage: "http://pygments.org/",
  license: "BSD-2-Clause",
  licenseText: readFileSync("public/vendor/pygments/LICENSE", { encoding: 'utf8' })
    + "\n\nAUTHERS: https://github.com/pygments/pygments/blob/2.6.1/AUTHORS",
});

packages.push({
  name: "Python",
  version: "3.8.2",
  homepage: "https://www.python.org/",
  license: "PSF-2.0",
  licenseText: `see: https://docs.python.org/3.8/license.html`
});

packages.push({
  name: "Node.js",
  version: "15.4.0",
  homepage: "https://nodejs.org/",
  license: "MIT",
  licenseText: `see: https://github.com/nodejs/node/blob/master/LICENSE`
});

packages = packages.sort((a, b) => (a.name < b.name)? -1 : 1);
stdout.write(JSON.stringify(packages, null, 2));
