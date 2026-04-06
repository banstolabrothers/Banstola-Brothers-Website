import {category} from './category'
import {review} from './review'
import {product} from './product'
import {socialmedia} from './socialmedia'
import {blogs} from './blogs'
import {tags} from './tags'
import {faqs} from './faqs'
import {faqTopic} from './topic'
// import {review} from './reviewsupdated'
export {reviewWithHooks as review} from './review'

export const schemaTypes = [category, review, product, socialmedia, blogs, tags, faqs, faqTopic]
