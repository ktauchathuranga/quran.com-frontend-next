import { useCallback, useEffect, useState, useRef, useContext } from 'react';

import { useRouter } from 'next/router';
import { VirtuosoHandle } from 'react-virtuoso';

import DataContext from '@/contexts/DataContext';
import Verse from '@/types/Verse';
import { getPageNumberFromIndexAndPerPage } from '@/utils/number';
import { isValidVerseId } from '@/utils/validator';
import { QuranReaderDataType } from 'types/QuranReader';
import ScrollAlign from 'types/ScrollAlign';

/**
 * This hook listens to startingVerse query param and navigate to
 * the location where the verse is in the virtualized list.
 *
 * [NOTE]: This is meant to be used for TranslationView only.
 *
 * @param {QuranReaderDataType} quranReaderDataType
 * @param {React.MutableRefObject<VirtuosoHandle>} virtuosoRef
 * @param {Record<number, Verse[]>} apiPageToVersesMap
 * @param {string} chapterId
 * @param {number} versesPerPage
 */
const useScrollToVirtualizedTranslationView = (
  quranReaderDataType: QuranReaderDataType,
  virtuosoRef: React.MutableRefObject<VirtuosoHandle>,
  apiPageToVersesMap: Record<number, Verse[]>,
  chapterId: string,
  versesPerPage: number,
) => {
  const router = useRouter();
  const chaptersData = useContext(DataContext);
  const [shouldReadjustScroll, setShouldReadjustScroll] = useState(false);

  const { startingVerse } = router.query;
  const startingVerseNumber = Number(startingVerse);
  const isValidStartingVerse =
    startingVerse && isValidVerseId(chaptersData, chapterId, String(startingVerse));

  const scrollToBeginningOfVerseCell = useCallback(
    (verseNumber: number) => {
      const verseIndex = verseNumber - 1;
      virtuosoRef.current.scrollToIndex({
        index: verseIndex,
        align: ScrollAlign.Start,
        // this offset is to push the scroll a little bit down so that the context menu doesn't cover the verse
        offset: -70,
      });
    },
    [virtuosoRef],
  );

  // this effect runs when there is initially a `startingVerse` in the url or when the user navigates to a new verse
  // it scrolls to the beginning of the verse cell and we set `shouldReadjustScroll` to true so that the other effect
  // adjusts the scroll to the correct position
  useEffect(() => {
    if (quranReaderDataType === QuranReaderDataType.Chapter && isValidStartingVerse) {
      scrollToBeginningOfVerseCell(startingVerseNumber);
      setShouldReadjustScroll(true);
    }
  }, [
    quranReaderDataType,
    startingVerseNumber,
    isValidStartingVerse,
    scrollToBeginningOfVerseCell,
  ]);

  const oldApiPageToVersesMap = useRef<Record<number, Verse[]>>(apiPageToVersesMap);

  // this effect handles the case when the user navigates to a verse that is not yet loaded
  // we need to wait for the verse to be loaded and then scroll to it
  useEffect(() => {
    if (
      quranReaderDataType === QuranReaderDataType.Chapter &&
      isValidStartingVerse &&
      // we only want to run this effect when the user navigates to a new verse
      // and not when the user is scrolling through the verses while apiPageToVersesMap is being populated
      shouldReadjustScroll
    ) {
      const pageNumber = getPageNumberFromIndexAndPerPage(startingVerseNumber - 1, versesPerPage);
      const isFirstVerseInPage = startingVerseNumber % versesPerPage === 1;
      const isLastVerseInPage = startingVerseNumber % versesPerPage === 0;

      const isNewPageLoaded = (page: number) => {
        return !oldApiPageToVersesMap.current[page] && apiPageToVersesMap[page];
      };

      if (
        isNewPageLoaded(pageNumber) ||
        (pageNumber > 1 && isFirstVerseInPage && isNewPageLoaded(pageNumber - 1)) ||
        (isLastVerseInPage && isNewPageLoaded(pageNumber + 1))
      ) {
        scrollToBeginningOfVerseCell(startingVerseNumber);
      } else {
        setTimeout(() => {
          scrollToBeginningOfVerseCell(startingVerseNumber);
        }, 1000);

        setShouldReadjustScroll(false);
      }
    }

    oldApiPageToVersesMap.current = apiPageToVersesMap;
  }, [
    shouldReadjustScroll,
    startingVerseNumber,
    isValidStartingVerse,
    apiPageToVersesMap,
    quranReaderDataType,
    versesPerPage,
    scrollToBeginningOfVerseCell,
    virtuosoRef,
  ]);
};

export default useScrollToVirtualizedTranslationView;
