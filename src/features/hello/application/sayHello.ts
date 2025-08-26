export function sayHello(name?: string) {
  return { text: `Hello ${name || "World"}` };
}
