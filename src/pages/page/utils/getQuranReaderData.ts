import { PagesLookUpResponse, VersesResponse } from '@/types/ApiResponses';

const getQuranReaderData = (
  pagesLookupData: PagesLookUpResponse,
  pageVersesData: VersesResponse,
) => {
  return {
    ...pageVersesData,
    pageVerses: { pagesLookup: pagesLookupData },
    metaData: { numberOfVerses: pageVersesData.verses.length },
  };
};

export default getQuranReaderData;
