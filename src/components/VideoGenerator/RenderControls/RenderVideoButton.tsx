import React from 'react';

import useTranslation from 'next-translate/useTranslation';

import Button from '@/dls/Button/Button';
import Progress from '@/dls/Progress';
import { RenderStatus, useGenerateMediaFile } from '@/hooks/auth/useGenerateMediaFile';
import IconDownload from '@/icons/download.svg';
import IconRender from '@/icons/slow_motion_video.svg';
import { MediaType } from '@/types/Media/GenerateMediaFileRequest';

type Props = {
  inputProps: any;
};

const RenderVideoButton: React.FC<Props> = ({ inputProps }) => {
  const { t } = useTranslation('video-generator');
  const { renderMedia, state } = useGenerateMediaFile(inputProps);

  const isInitOrInvokingOrError = [
    RenderStatus.INIT,
    RenderStatus.INVOKING,
    RenderStatus.ERROR,
  ].includes(state.status);

  const isRenderingOrDone = [RenderStatus.RENDERING, RenderStatus.DONE].includes(state.status);

  const isRendering = state.status === RenderStatus.RENDERING;
  return (
    <div>
      {isInitOrInvokingOrError && (
        <>
          <Button
            prefix={<IconRender />}
            isDisabled={state.status === RenderStatus.INVOKING}
            isLoading={state.status === RenderStatus.INVOKING}
            onClick={() => {
              renderMedia(MediaType.VIDEO);
            }}
          >
            {t('render-video')}
          </Button>
          {state.status === RenderStatus.ERROR && <div>{state.error.message}</div>}
        </>
      )}
      {isRenderingOrDone && (
        <>
          <Progress value={isRendering ? state.progress : 100} />
          <br />
          <Button
            prefix={<IconDownload />}
            isDisabled={isRendering}
            isLoading={isRendering}
            href={state.status === RenderStatus.DONE ? state.url : ''}
          >
            {t('download-video')}
          </Button>
        </>
      )}
    </div>
  );
};

export default RenderVideoButton;
