import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPost } from '../../actions/post';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';

/*state.post একটা object যার মধ্যে posts, post, loading, error এই চারটা field আছে, সেখান থেকে post ও loading কে destructure করে নেয়া হচ্ছে যেন props.posts.post ও props.posts.loading এর জায়গায় শুধু post ও loading লেখা যায়। mapStateToProps function এর মধ্যে posts: state.post লেখায় ও function টা connect() use করে এই component এর সাথে cpnnect করায় এই component এর props এর মধ্যে props.post আকারে হুবহু state.post জমা হচ্ছে।
props.match এর params এর মধ্যে url এর শেষে যে id আছে সেটা আছে, সেজন্য সেটাকেও destructure করা হচ্ছে যেন props.match এর জায়গায় শুধু match লেখা যায়*/
const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post, //এখানে post মানে post reducer এর ভিতরের সম্পূর্ণ state object টা।
});
export default connect(mapStateToProps, { getPost })(Post);
