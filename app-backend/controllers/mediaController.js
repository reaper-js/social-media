import Media from "../models/mediaModel.js";

export const uploadMedia = async (req, res) => {
  const { title, description, mediaType } = req.body;

 
  if (!['image', 'video'].includes(mediaType)) {
    return res.status(400).json({ message: 'Invalid media type. Use "image" or "video".' });
  }

  try {
    const media = await Media.create({
      title,
      description,
      mediaUrl: req.file.path, 
      mediaType,
      uploadedBy: req.user.id, 
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().populate('uploadedBy', 'name avatar');
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
