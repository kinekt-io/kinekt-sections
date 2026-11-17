/**
 * Payload entrypoint for the article-driven Case Studies contract.
 *
 * Consumers MUST package this conditional export with the matching `.types`
 * export. The CMS request path, not this package, hydrates `carousel.items`
 * from the selected published, Region-scoped articles and resolves canonical
 * article links before calling the adapter.
 */
export { caseStudiesAllentownToProps, createCaseStudiesAllentownBlock } from './case-studies-allentown.contract.js'
export type {
  CaseStudiesAllentownAdapterOptions,
  CaseStudiesArticleTypeOption,
  CaseStudiesSelectionMode,
  CreateCaseStudiesAllentownBlockOptions,
} from './case-studies-allentown.contract.js'
