app.post('/api/signup', async (req, res) => {
    // Get the user's information from the request body
    const { name, email} = req.body;
  
    // Validate the user's email address
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
  
    // Check if the user's email address already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
  
    // Create a new user 
    const user = new User({ name, email,});
  
    // Save the user to the database
    await user.save();
  
    // Generate a token for the user
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
    // Return a success response
    res.json({ token });
  });
  
  app.post('/api/posts', async (req, res) => {
    // Get the user ID and content from the request body
    const { userId, content } = req.body;
  
    // Validate the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User ID not found.' });
    }
  
    // Validate the content
    if (!content) {
      return res.status(400).json({ message: 'Content cannot be empty.' });
    }
  
    // Create a new post object
    const post = new Post({ userId, content });
  
    // Save the post to the database
    await post.save();
  
    // Return a success response
    res.json({ message: 'Successfully created.' });
  });
  
  app.delete('/api/deletepost/:postId', async (req, res) => {
    // Get the post ID from the request URL
    const postId = req.params.postId;
  
    // Get the post from the database
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post ID not found.' });
    }
  
    // Check if the user is authorized to delete the post
    const userId = req.user.id;
    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this post.' });
    }
  
    // Delete the post from the database
    await post.remove();
  
    // Return a success response
    res.json({ message: 'Successful post deletion.' });
  });
  
  app.get('/API/posts/:userId', async (req, res) => {
    // Get the user ID from the request URL
    const userId = req.params.userId;
  
    // Get the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User ID not found.' });
    }
  
    // Get all of the posts from the database that belong to the user
    const posts = await Post.find({ userId });
    if (posts == null){
        return res.status(404).json({ message: 'No posts found for this user.' });
    }
    res.json({ posts });
  });
  