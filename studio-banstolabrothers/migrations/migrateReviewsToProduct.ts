/**
 * Migration Script: Category-based → Product-based Reviews
 * Run with: npx sanity exec migrations/migrateReviewsToProduct.ts --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient()

export default async function migrateReviewsToProduct() {
  console.log('🚀 Starting migration from category-based to product-based reviews...\n')

  // Step 1: Fetch all existing review documents
  const query = `*[_type == "review" && defined(category)] {
    _id,
    _rev,
    category,
    reviews[] {
      reviewimage,
      reviewDate,
      username,
      description,
      profilePicture,
      product,
      rating,
      productReviewImages,
      reply
    }
  }`

  try {
    const oldReviews = await client.fetch(query)
    console.log(`📦 Found ${oldReviews.length} review documents to migrate`)

    if (oldReviews.length === 0) {
      console.log('✅ No reviews to migrate!')
      return
    }

    // Step 2: Group reviews by product
    const reviewsByProduct = new Map()

    oldReviews.forEach((doc) => {
      doc.reviews?.forEach((review) => {
        if (review.product?._ref) {
          const productId = review.product._ref

          if (!reviewsByProduct.has(productId)) {
            reviewsByProduct.set(productId, {
              productRef: productId,
              categoryRef: doc.category?._ref,
              reviews: [],
            })
          }

          // Remove product field from individual review
          const {product, ...reviewWithoutProduct} = review
          reviewsByProduct.get(productId).reviews.push(reviewWithoutProduct)
        }
      })
    })

    console.log(`📊 Grouped into ${reviewsByProduct.size} product documents\n`)

    // Step 3: Create new review documents
    const transaction = client.transaction()
    let successCount = 0

    for (const [productId, data] of reviewsByProduct) {
      const newReviewDoc = {
        _type: 'review',
        product: {
          _type: 'reference',
          _ref: productId,
        },
        category: data.categoryRef
          ? {
              _type: 'reference',
              _ref: data.categoryRef,
            }
          : undefined,
        reviews: data.reviews,
      }

      transaction.create(newReviewDoc)
      successCount++
    }

    // Step 4: Commit transaction
    await transaction.commit()

    const totalReviews = Array.from(reviewsByProduct.values()).reduce(
      (sum, data) => sum + data.reviews.length,
      0,
    )

    console.log('✅ Migration Complete!\n')
    console.log(`📊 Summary:`)
    console.log(`   - Old Documents: ${oldReviews.length}`)
    console.log(`   - New Documents: ${successCount}`)
    console.log(`   - Total Reviews Migrated: ${totalReviews}\n`)
    console.log('⚠️  Old documents are kept as backup.')
    console.log('   After verification, run cleanup script to remove them.\n')

    return {
      success: true,
      oldDocuments: oldReviews.length,
      newDocuments: successCount,
      totalReviews,
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}
