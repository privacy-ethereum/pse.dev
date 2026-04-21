declare module "feed" {
  export class Feed {
    constructor(options?: any)
    addItem(item: any): void
    addCategory(category: string): void
    addContributor(contributor: any): void
    atom1(): string
    rss2(): string
    json1(): string
  }
}
