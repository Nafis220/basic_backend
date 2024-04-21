import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFiel: {
      type: String, //coudinary url
      required: true,
    },
    thumbnail: {
      type: String, //coudinary url
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //coundinary url, it also provides the duration
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: { type: Boolean, default: true },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(aggregatePaginate);
// new plugins can be added into mongoose and the aggregation pipeline is used through new plugin.
export const Video = mongoose.model("Video", videoSchema);
