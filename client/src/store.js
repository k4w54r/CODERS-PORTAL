import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

/*Redux Thunk middleware allows you to write action creators that return a function instead of an action.
Motivation:
https://www.npmjs.com/package/redux-thunk*/
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// store টা reducer use করার জন্য rootReducer function টা কে call করবে, store এর state হিসেবে initialState এর ভিতরে যা আছে তা use করবে এবং applyMiddleware র মাধ্যমে middleware array এর মধ্যে যতগুলা middleware আছে, সে সবগুলা middleware use করবে

export default store;
