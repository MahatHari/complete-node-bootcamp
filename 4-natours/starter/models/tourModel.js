const slugify = require('slugify');
const mongoose = require('mongoose');

//Schema for Data model
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equal than 40 char',
      ],
      minlength: [
        10,
        'A tour name must be greate than 10 character',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty level'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message:
          'Difficulty is either: easy, medium, difficulty',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Minimum rating must be'],
      max: [5, ' Must be 5 at max'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have price'],
    },
    priceDiscout: {
      type: Number,
      validate: {
        validator: function (val) {
          // this does work only on create not on update
          return this.price > val;
        },
        message:
          'Discount ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual schema

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* //post middleware
tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
}); */

// QUERRY MIDDLEWARE
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//for all find query
tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// using post query middle ware
tourSchema.post('/^find/', function (docs, next) {
  console.log(
    `Query took ${Date.now() - this.start} miliseconds`
  );
  //console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  console.log(this.pipeline);
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

//creating  data model from schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
