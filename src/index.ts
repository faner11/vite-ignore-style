import type { Plugin } from 'vite'
interface Options {
    libraryName: string;
    style?: string;
}
  
const ignoreStylePlugin = (options:Options|Options[]) => {
    const getStyleRule = (libraryName: string, style = 'style'): string => `${libraryName}/(es|lib)/[-\\w+]+/(${style}|${style}.js|${style}/index.js|${style}/index.less|${style}|${style}.less)$`
    const flattenId = (id: string): string => id.replace(/(\s*>\s*)/g, '__').replace(/[/.]/g, '_')
    const libraryConfigs = Array.isArray(options) ? options : [options]
    const externalRule = libraryConfigs.map((value) => {
        const { libraryName, style = 'style' } = value as unknown as Options
        return getStyleRule(libraryName, style)
    }).join('|')
    const obj: Plugin = {
        name: 'vite-ignore-style',
        enforce: 'pre',
        resolveId (id) {
        if (id.match(new RegExp(flattenId(externalRule))) || id.match(new RegExp(externalRule))) {
            return '@null-module'
        }
        },
        load (id: string) {
        if (id === '@null-module') {
            return ''
        }
        }
    }
    return obj
}
export default ignoreStylePlugin