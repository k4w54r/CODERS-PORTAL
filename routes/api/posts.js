const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const hauth = require('../../handlers/hauth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [hauth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const post = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private

router.get('/', hauth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private

router.get('/:id', hauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private

router.delete('/:id', hauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private

router.put('/like/:id', hauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked by this user
    if (
      post.likes.filter((like) => {
        return like.user.toString() === req.user.id;
      }).length > 0
      //post টার likes array তে গিয়ে array টার যে যে element এর user req.user.id এর সমান সে element গুলো filter করে বের করতেসে এবং .length দিয়ে দেখতেসে এরকম  কয়টা element arrray টাতে আছে। এরকম যতোটা element array টাতে আছে, ঐ user ঐ post এ ততোবার like দিসে। length>0 হওয়ার অর্থ ঐ user already ঐ পোস্টে এক/একাধিকবার like দিসে।
      //.toString() use করা হইতেসে কারণ likes array তে user ObjectId হিসেবে থাকে আর req.user.id একটা string.তাই, compare করার আগে ObjectId টাকে string এ convert করা হইতেসে।
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private

router.put('/unlike/:id', hauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked by this user
    if (
      post.likes.filter((like) => {
        return like.user.toString() === req.user.id;
      }).length === 0
      //length 0 হওয়ার অর্থ ঐ user ঐ পোস্টে এখনো like দেয় নাই।
    ) {
      return res.status(400).json({ msg: 'Post has not been liked yet' });
    }

    //Get remove index

    const removeIndex = post.likes
      .map((like) => {
        return like.user.toString();
      })
      .indexOf(req.user.id);
    //post টার likes array তে গিয়ে array টার প্রত্যেকটা element এর user কে string এ convert করা হইতেসে এবং যে element এর user req.user.id, সে element টার index return করে removeIndex এ জমা করা হইতেসে।
    //.toString() use করা হইতেসে কারণ likes array তে user ObjectId হিসেবে থাকে আর req.user.id একটা string.তাই, কোন element এর user req.user.id তা দেখার আগে সব element এর user কে ObjectId থেকে string এ convert করা হইতেসে।
    post.likes.splice(removeIndex, 1);
    //post টার likes array টার ঐ index থেকে শুরু করে 1টা element remove করা হইতেসে।
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [hauth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const comment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(comment);

      await post.save();

      res.json(post.comments);

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private

router.delete('/comment/:id/:comment_id', hauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Get the comment
    const comment = post.comments.find((comment) => {
      return comment.id === req.params.comment_id;
    });

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    //Get remove index
    const removeIndex = post.comments
      .map((comment) => {
        return comment.user.toString();
      })
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

/*The map method is used to convert each item of an array, while the filter method is used to select certain items of an array. The filter method returns an array containing the items where the inner function returns true.
https://stackoverflow.com/questions/2442798/javascript-filter-vs-map-problem*/
