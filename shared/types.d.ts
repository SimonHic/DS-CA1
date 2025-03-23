// export type Language = 'English' | 'Frenc

export type Game =   {
  id: number,
  original_language: string,
  original_title: string,
  adult: boolean,
  overview: string,
  release_date: string,
  title: string,
  vote_average: number,
  vote_count: number
}

export type GamePublisher = {
  gameId: number;
  publisherName: string;
  publisherCountry: string;
  publisherDescription: string;
};
// Used to validate the query string of HTTP Get requests
export type GamePublisherQueryParams = {
  gameId: string;
  publisherName?: string;
  publisherCountry?: string
} 