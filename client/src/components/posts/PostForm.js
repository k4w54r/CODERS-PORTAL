import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');
  //text নামে একটা component state তৈরি করা হচ্ছে, যার initial value '' এবং যার value setText নামক function দিয়ে change করা যাবে। এই text redux এর state না, অর্থাৎ এর সাথে redux store এর কোনো সম্পর্ক নাই। এই state এর value শুধু এই component এর ভিতরেই setText function use করে change করা যাবে, অন্য কোথাও না।
  return (
    <div class='post-form'>
      <div class='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        class='form my-1'
        onSubmit={(e) => {
          e.preventDefault();
          addPost({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type='submit' class='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
