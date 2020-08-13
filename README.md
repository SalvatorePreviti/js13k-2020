# js13k-2020 🎮

MIT License

Ben Clark, Salvatore Previti, 2020

# Build

- To starts the development server, port 3000, with hot/quick reload on file change.

```sh
npm run dev
```

- To builds the final zip file in the dist folder.

```sh
npm run build
```

- To typecheck typescript files (no compilation output)

```sh
npm run ts-check
```

- To lint and fix the whole project

```sh
npm run lint
```

- To run a generic .ts file or a .js file with es6 modules from node

```sh
npm run ts-run src/filename.ts
```

## requirements

NodeJS 14.8.0

## Modules scripts

```html
<script type="module" src="./src/hello-module1.js"></script>
<script type="module" src="./src/hello-module2.ts"></script>
<script type="module">
  document.getElementById('xxx').addEventListener('click', functionDefinedInModule1)
</script>
```

Modules scripts will be processed by rollup and esbuild as es6 modules, and will be hoisted in an isolated IIFE.
This is the default mode we want to work.
Code will be fully optimized and mangled.
TypeScript is supported.

## Global scripts

```html
<script src="./src/global.js"></script>
<script>function aFunctionInTheGlobalScope(){alert("x")}</script>

<button onclick="aFunctionInTheGlobalScope()">click me</buttom>
```

Are loaded before modules, and executed in the global scope.
Global names will NOT be mangled.
TypeScript is NOT supported.
