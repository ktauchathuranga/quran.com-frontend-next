import classNames from 'classnames';
import Image from 'next/image';

import styles from '../MediaMaker.module.scss';

import { MediaSettingsProps } from '@/types/Media/MediaSettings';
import { getVideosArray } from '@/utils/media/utils';

const videos = getVideosArray();

interface Props extends MediaSettingsProps {
  videoId: number;
}

const BackgroundVideos: React.FC<Props> = ({ onSettingsUpdate, videoId }) => {
  const onVideoSelected = (newVideId: number) => {
    onSettingsUpdate({ videoId: newVideId }, 'videoId', newVideId);
  };

  return (
    <div className={styles.BackgroundVideosWrapper}>
      {videos.map((video) => (
        <Image
          key={video.id}
          className={classNames(styles.img, {
            [styles.selectedSetting]: video.id === videoId,
          })}
          onClick={() => {
            onVideoSelected(video.id);
          }}
          src={video.thumbnailSrc}
          width="300px"
          height="300px"
        />
      ))}
    </div>
  );
};

export default BackgroundVideos;
