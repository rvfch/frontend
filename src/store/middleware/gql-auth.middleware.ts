import { ApolloLink, Operation, NextLink, FetchResult, Observable } from '@apollo/client';
import { RootState, store } from '..';
import { Subscription } from 'zen-observable-ts';
import { refreshAccess } from '../../api/auth.api';

export const gqlAuthMiddleware = new ApolloLink((operation: Operation, forward: NextLink) => {
  return new Observable<FetchResult>((observer) => {
    let subscription: Subscription;
    let retried = false;
    let needTokenRefresh = false;

    const setHeaders = () => {
      const state: RootState = store.getState();
      const { accessToken, tenantId } = state.auth;

      operation.setContext({
        headers: {
          authorization: `Bearer ${accessToken}`,
          'x-api-key': tenantId,
        },
      });
    };

    const tryRefreshToken = async (): Promise<boolean> => {
      try {
        await store.dispatch(refreshAccess());
        setHeaders();
        return true;
      } catch (error) {
        observer.error(error);
        return false;
      }
    };

    const retryOriginalRequest = (): void => {
      subscription = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    };

    setHeaders();

    subscription = forward(operation).subscribe({
      next: (result) => {
        if (result.errors && result.errors.some((error) => error.message === 'Unauthorized')) {
          needTokenRefresh = true;
        } else {
          observer.next(result);
        }
      },
      complete: () => {
        if (needTokenRefresh && !retried) {
          retried = true;
          needTokenRefresh = false;
          tryRefreshToken().then((success) => {
            if (success) retryOriginalRequest();
            else observer.complete();
          });
        } else {
          observer.complete();
        }
      },
      error: observer.error.bind(observer),
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  });
});
