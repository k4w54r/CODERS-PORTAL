import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
export default combineReducers({
  alert,
  auth,
  profile,
});

//এটা হল rootReducer. ./reducer হিসেবে export করলে combineReducers function টা export হবে কারণ এ function টা এ file টার default export আর এ file টা reducer folder এর index.js file
//combineReducer function টা alert, auth, profile এই তিনটা reducer কে combine করতেসে যেন শুধু rootReducer function কে call করলেই এই তিনটা reducer store এর সাথে যুক্ত হয়ে যায়
//কোনো action dispatch হলে combineReducer এ থাকা প্রত্যেকটা reducer এর মধ্যেই গিয়ে check করা হবে কোন reducer সেই action টা handle করছে। একটা reducer এ সে action টা পাওয়া গেলেই সে অনুযায়ী কাজ হবে, আর অন্য reducer এ check করা হবে না
