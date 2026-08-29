const fs = require("fs");
const path = require("path");

function getLucideExportMap() {
  const packageRoot = path.dirname(
    require.resolve("lucide-react-native/package.json"),
  );
  const barrelPath = path.join(
    packageRoot,
    "dist",
    "esm",
    "lucide-react-native.js",
  );
  const barrel = fs.readFileSync(barrelPath, "utf8");
  const exportMap = new Map();
  const exportPattern =
    /export\s*\{([^}]+)\}\s*from\s*["']\.\/icons\/([^"']+\.js)["'];?/g;

  for (const match of barrel.matchAll(exportPattern)) {
    const specifiers = match[1];
    const fileName = match[2];

    for (const specifier of specifiers.split(",")) {
      const alias = specifier
        .trim()
        .match(/^default\s+as\s+([A-Za-z0-9_$]+)$/);

      if (alias) {
        exportMap.set(
          alias[1],
          `lucide-react-native/dist/esm/icons/${fileName}`,
        );
      }
    }
  }

  return exportMap;
}

const lucideExportMap = getLucideExportMap();

function lucideDirectImports({ types: t }) {
  return {
    name: "jod-lucide-direct-imports",
    visitor: {
      ImportDeclaration(importPath) {
        if (importPath.node.source.value !== "lucide-react-native") return;

        const replacements = [];
        const passthrough = [];

        for (const specifier of importPath.node.specifiers) {
          if (
            t.isImportSpecifier(specifier) &&
            importPath.node.importKind !== "type" &&
            specifier.importKind !== "type"
          ) {
            const importedName = t.isIdentifier(specifier.imported)
              ? specifier.imported.name
              : specifier.imported.value;
            const directModule = lucideExportMap.get(importedName);

            if (directModule) {
              replacements.push(
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(specifier.local.name))],
                  t.stringLiteral(directModule),
                ),
              );
            } else {
              // Keep uncommon non-icon exports on Lucide's public entrypoint
              // rather than generating a module path that may not exist.
              passthrough.push(specifier);
            }
            continue;
          }

          if (
            t.isImportSpecifier(specifier) &&
            (importPath.node.importKind === "type" ||
              specifier.importKind === "type")
          ) {
            continue;
          }

          passthrough.push(specifier);
        }

        if (passthrough.length > 0) {
          replacements.unshift(
            t.importDeclaration(
              passthrough,
              t.stringLiteral("lucide-react-native"),
            ),
          );
        }

        if (replacements.length === 0) importPath.remove();
        else importPath.replaceWithMultiple(replacements);
      },
    },
  };
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [lucideDirectImports, "react-native-reanimated/plugin"],
  };
};
