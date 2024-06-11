import { Schema, model } from "mongoose";

export type VideoSchemaType = {
  title: string;
  description: string;
  url: string;
  createdAt?: Date;
  completed: boolean;
};

export const VideoSchema = new Schema<VideoSchemaType>({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const video = model("video", VideoSchema);

export default video;