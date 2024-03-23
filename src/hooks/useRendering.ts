/* eslint-disable no-await-in-loop */
import { useCallback, useMemo, useState } from 'react';

import { z } from 'zod';

import { getProgress, renderVideo } from '../lambda/api';
import { CompositionProps } from '../types/constants';

export type State =
  | {
      status: 'init';
    }
  | {
      status: 'invoking';
    }
  | {
      renderId: string;
      bucketName: string;
      progress: number;
      status: 'rendering';
    }
  | {
      renderId: string | null;
      status: 'error';
      error: Error;
    }
  | {
      url: string;
      size: number;
      status: 'done';
    };

const wait = async (milliSeconds: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliSeconds);
  });
};

export const useRendering = (id: string, inputProps: z.infer<typeof CompositionProps>) => {
  const [state, setState] = useState<State>({
    status: 'init',
  });

  // eslint-disable-next-line react-func/max-lines-per-function
  const renderMedia = useCallback(async () => {
    setState({
      status: 'invoking',
    });
    try {
      const { renderId, bucketName } = await renderVideo({ id, inputProps });
      setState({
        status: 'rendering',
        progress: 0,
        renderId,
        bucketName,
      });

      let pending = true;

      while (pending) {
        const result = await getProgress({
          id: renderId,
          bucketName,
        });
        // eslint-disable-next-line default-case
        switch (result.type) {
          case 'error': {
            setState({
              status: 'error',
              renderId,
              error: new Error(result.message),
            });
            pending = false;
            break;
          }
          case 'done': {
            setState({
              size: result.size,
              url: result.url,
              status: 'done',
            });
            pending = false;
            break;
          }
          case 'progress': {
            setState({
              status: 'rendering',
              bucketName,
              progress: result.progress,
              renderId,
            });
            await wait(1000);
          }
        }
      }
    } catch (err) {
      setState({
        status: 'error',
        error: err as Error,
        renderId: null,
      });
    }
  }, [id, inputProps]);

  const undo = useCallback(() => {
    setState({ status: 'init' });
  }, []);

  return useMemo(() => {
    return {
      renderMedia,
      state,
      undo,
    };
  }, [renderMedia, state, undo]);
};
