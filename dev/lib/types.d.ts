declare module '*.fs' {
  export const code: string
}

declare module '*.vs' {
  export const code: string
}

declare module '*.frag' {
  export const code: string
}

declare module '*.vert' {
  export const code: string
}

declare module '*.glsl' {
  export const code: string
}

declare module '*.txt' {
  const content: string
  export default content
}

declare module '*.html' {
  const content: string
  export default content
}

declare module '*.node' {
  const content: any
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}
