import Media from "../models/mediaModel.js";

export const uploadMedia = async (req, res) => {
  const {description, mediaType } = req.body;

  const user = req.user;
  if (!['image', 'video'].includes(mediaType)) {
    return res.status(400).json({ message: 'Invalid media type. Use "image" or "video".' });
  }

  try {
    const media = await Media.create({
      description,
      mediaUrl: req.file.path, 
      mediaType,
      uploadedBy: req.user._id, 
    });
    user.uploads.push(media._id);
    await user.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const userIds = [...req.user.following, req.user._id];
    const posts = await Media.find({
      uploadedBy: { $in: userIds }
    })
    .populate('uploadedBy', 'name avatar')
    .sort({ createdAt: -1 });
    
    res.json(posts);
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

export const toggleLike = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        const likeIndex = media.likes.indexOf(req.user._id);
        
        if (likeIndex === -1) {
            media.likes.push(req.user._id);
        } else {
            media.likes.splice(likeIndex, 1);
        }
        
        await media.save();
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        media.comments.push({
            user: req.user._id,
            text: req.body.text
        });
        await media.save();
        
        const populatedMedia = await Media.findById(media._id)
            .populate('comments.user', 'name avatar');
            
        res.json(populatedMedia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleSavePost = async (req, res) => {
    try {
        const user = req.user;
        const postId = req.params.id;
        
        const saveIndex = user.savedPosts.indexOf(postId);
        if (saveIndex === -1) {
            user.savedPosts.push(postId);
        } else {
            user.savedPosts.splice(saveIndex, 1);
        }
        
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
