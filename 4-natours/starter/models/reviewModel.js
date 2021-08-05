const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    review: {
      type: String,
      required: [true, 'Review cant be emptied '],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to Tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must have author'],
    },
  },
  // makes calcuated/aggregated fields visible
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//populating
/* reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
  next();
}); */
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//POST /tour/tourId/reviews =>Nested Route
//GET /tour/tourId/reviews
//Get /tour/tourId/reviews/reviewId

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
