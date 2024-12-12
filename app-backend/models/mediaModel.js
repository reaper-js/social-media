import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    description: { 
        type: String,
    }, 
    mediaUrl: { 
        type: String, 
        required: true 
    },
    mediaType: { 
      type: String, 
      enum: ['image', 'video'],
      required: true 
    },
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
  },
  { 
    timestamps: true 
  });

  const Media = mongoose.model("Media", mediaSchema);

  export default Media;