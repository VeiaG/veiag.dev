/*
    This plugin resolves/calculates CSS variables within color-mix() functions so they can be calculated using postcss-color-mix-function
    Exception: dynamic values like currentColor
*/

// const colorMixVarResolverPlugin = () => {
//   return {
//     postcssPlugin: 'postcss-color-mix-var-resolver',

//     Once(root) {
//       const cssVariables = {}

//       // 1. Collect all CSS variable definitions from tailwind
//       root.walkRules((rule) => {
//         if (!rule.selectors) return

//         const isRootOrHost = rule.selectors.some(
//           (sel) => sel.includes(':root') || sel.includes(':host'),
//         )

//         if (isRootOrHost) {
//           // Collect all --var declarations in this rule
//           rule.walkDecls((decl) => {
//             if (decl.prop.startsWith('--')) {
//               cssVariables[decl.prop] = decl.value.trim()
//             }
//           })
//         }
//       })

//       // 2. Parse each declaration's value and replace var(...) in color-mix(...)
//       root.walkDecls((decl) => {
//         const originalValue = decl.value
//         if (!originalValue || !originalValue.includes('color-mix(')) return

//         const parsed = valueParser(originalValue)
//         let modified = false

//         parsed.walk((node) => {
//           if (node.type === 'function' && node.value === 'color-mix') {
//             node.nodes.forEach((childNode) => {
//               if (
//                 childNode.type === 'function' &&
//                 childNode.value === 'var' &&
//                 childNode.nodes.length > 0
//               ) {
//                 const varName = childNode.nodes[0]?.value
//                 if (!varName) return

//                 const resolvedVarName =
//                   cssVariables[varName] === undefined ? 'black' : cssVariables[varName] // fall back to black if var is undefined
//                 // add whitespace because it might just be a part of a color notation e.g. #fff 10%
//                 const resolved = `${resolvedVarName} ` || `var(${varName})`

//                 childNode.type = 'word'
//                 childNode.value = resolved
//                 childNode.nodes = []
//                 modified = true
//               }
//             })
//           }
//         })

//         if (modified) {
//           const newValue = parsed.toString()
//           decl.value = newValue
//         }
//       })
//     },
//   }
// }

// colorMixVarResolverPlugin.postcss = true
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    // colorMixVarResolverPlugin,
    '@csstools/postcss-oklab-function': { preserve: true },
    '@csstools/postcss-color-mix-function': { preserve: true },

    // autoprefixer: {},
  },
}
export default config
