# Hadith Database

This directory contains data for the hadith database used in the Quranly web application.

## Structure

- `manifest.json` - Contains metadata about all available hadith collections and their source URLs
- Each collection is loaded dynamically from the remote source when needed

## Collections

The database includes 17 hadith collections:

1. Sahih al-Bukhari
2. Sahih Muslim
3. Sunan Abi Dawud
4. Jami` at-Tirmidhi
5. Sunan an-Nasa'i
6. Sunan Ibn Majah
7. Muwatta Malik
8. Musnad Ahmad
9. Sunan ad-Darimi
10. Riyad as-Salihin
11. Shamail al-Muhammadiyah
12. Bulugh al-Maram
13. Al-Adab Al-Mufrad
14. Mishkat al-Masabih
15. The Forty Hadith of al-Imam an-Nawawi
16. The Forty Hadith Qudsi
17. The Forty Hadith of Shah Waliullah

## Implementation Details

The hadith database is implemented with the following features:

1. **Dynamic Loading**: Collections are loaded on-demand when a user selects them
2. **Caching**: Once loaded, collections are cached in memory to avoid repeated network requests
3. **Search**: Users can search across collections to find relevant hadiths
4. **Browsing**: Users can browse collections by book and view individual hadiths

## Data Source

The hadith data is sourced from the [hadith-json](https://github.com/AhmedBaset/hadith-json) repository. Each collection is loaded directly from the raw GitHub content URLs.

## API

The hadith database is accessed through the `hadithDatabase.ts` utility file, which provides the following functions:

- `loadManifest()` - Loads the manifest file with collection information
- `getCollectionInfo(collectionId)` - Gets information about a specific collection
- `listCollections()` - Lists all available collections
- `loadCollection(collectionId)` - Loads a specific collection's data
- `getHadithByIndex(collectionId, index)` - Gets a hadith by its index in a collection
- `getHadith(collectionId, bookNumber, hadithNumber)` - Gets a specific hadith
- `getBooks(collectionId)` - Gets all books in a collection
- `getHadithsByBook(collectionId, bookNumber)` - Gets all hadiths in a specific book
- `getAllHadiths(collectionId)` - Gets all hadiths in a collection
- `searchHadiths(query, collectionIds)` - Searches for hadiths matching a query 