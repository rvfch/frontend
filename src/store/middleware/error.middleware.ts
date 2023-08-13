import { toast } from 'react-toastify';
import { Middleware, AnyAction } from '@reduxjs/toolkit';

const errorMiddleware: Middleware = () => (next) => (action: AnyAction) => {
  // Check if action has a payload, contains a message, and the status code lies in the error range
  if (
    action.payload &&
    'message' in action.payload &&
    'statusCode' in action.payload &&
    action.payload.statusCode >= 400 &&
    action.payload.statusCode <= 599
  ) {
    // Display the error message
    toast.error(action.payload?.message);
  }
  // call the next function
  return next(action);
};

export default errorMiddleware;
