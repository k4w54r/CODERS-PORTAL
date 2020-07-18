import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts], //payload আগে দিসি যেন latest post UI তে সবার উপরে থাকে
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        //যে post delete করা হইসে, payload এর মধ্যে সেই post টার id আছে। সেই post টা বাদে বাকি post গুলা শুধু return করা হচ্ছে, ফলে state এর posts এর মধ্যে সেই post টা আর কখনো থাকবে না
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.id
            ? {
                ...post,
                likes: payload.likes,
                //payload এর ভিতরে পাঠানো likes এর মধ্যে database এ ঐ post এ কয়টা like আছে, সে সংখ্যাটা আছে। সেটা দিয়ে এখন state এর মধ্যে ঐ post এর like সংখ্যা update করা হচ্ছে
              }
            : post
        ),
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: payload,
        },
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            (comment) => comment._id !== payload
          ),
        },
        loading: false,
      };
    default:
      return state;
  }
}

/*Post.js এ state.post দিয়ে এই reducer এর সম্পূর্ণ state object টাকে বুঝানো হয়েছে যার ভিতরে posts, post, loading, error এই চারটা field আছে। এই reducer এর ভিতরে এই সম্পূর্ণ state object টাকে শুধু state দিয়ে denote করা হয়, state.post দিয়ে নয়, state.post দিয়ে বরং সম্পূর্ণ object এর ভিতরের post field টাকে denote করা হয়*/
