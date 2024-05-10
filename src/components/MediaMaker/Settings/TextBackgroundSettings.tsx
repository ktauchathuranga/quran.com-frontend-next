import React from 'react';

import useTranslation from 'next-translate/useTranslation';

import BackgroundColors from './BackgroundColors';

import Section from '@/components/Navbar/SettingsDrawer/Section';
import Switch from '@/dls/Switch/Switch';
import { MediaSettingsProps } from '@/types/Media/MediaSettings';

interface Props extends MediaSettingsProps {
  opacity: string;
  shouldHaveBorder: string;
  backgroundColorId: number;
}

const TextBackgroundSettings: React.FC<Props> = ({
  onSettingsUpdate,
  opacity,
  shouldHaveBorder,
  backgroundColorId,
}) => {
  const { t } = useTranslation('quran-media-maker');

  const onOpacitySelect = (newOpacity: string) => {
    if (newOpacity === opacity) {
      return;
    }
    onSettingsUpdate({ opacity: newOpacity }, 'opacity', newOpacity);
  };

  const onShouldHaveBorderSelect = (newShouldHaveBorder: string) => {
    onSettingsUpdate(
      { shouldHaveBorder: newShouldHaveBorder },
      'shouldHaveBorder',
      newShouldHaveBorder,
    );
  };

  return (
    <Section>
      <Section.Title>{t('background')}</Section.Title>
      <Section.Row>
        <BackgroundColors
          backgroundColorId={backgroundColorId}
          onSettingsUpdate={onSettingsUpdate}
        />
      </Section.Row>
      <br />
      <>
        <Section.Label>{t('opacity')}</Section.Label>
        <Section.Row>
          <Switch
            items={[
              { name: '0%', value: '0' },
              { name: '20%', value: '0.2' },
              { name: '40%', value: '0.4' },
              { name: '60%', value: '0.6' },
              { name: '80%', value: '0.8' },
              { name: '100%', value: '1' },
            ]}
            selected={opacity}
            onSelect={onOpacitySelect}
          />
        </Section.Row>
        <br />
        <Section.Label>{t('border')}</Section.Label>
        <Section.Row>
          <Switch
            items={[
              { name: 'Yes', value: 'true' },
              { name: 'No', value: 'false' },
            ]}
            selected={shouldHaveBorder.toString()}
            onSelect={onShouldHaveBorderSelect}
          />
        </Section.Row>
      </>
    </Section>
  );
};
export default TextBackgroundSettings;
