import {Game, GamePublisher} from '../shared/types'

export const games : Game[] = [
  {
    adult: false,
    id: 1234,
    original_language: 'en',
    original_title: 'Monopoly',
    overview: 'Monopoly is a board game that involves buying and selling properties on a board. The goal of the game is to bankrupt other players by charging them for landing on your owned tiles.',
    release_date: '1935',
    title: 'Monopoly',
    vote_average: 6.4,
    vote_count: 750
  },
  {
    adult: false,
    id: 2345,
    original_language: 'en',
    original_title: 'Sorry',
    overview: "The objective of Sorry is to be the first player to house all three of their selected coloured pawns from their start space to their Home. The pawns have to make a full rotation of the board and avoid being sent back by other players.",
    release_date: '1934',
    title: 'Sorry',
    vote_average: 6.5,
    vote_count: 299
  },
  {
    adult: true,
    id: 695721,
    original_language: 'en',
    original_title: 'Cards Against Humanity',
    overview: 'To play Cards Against Humanity, one person is selected as the Card Czar to read out played cards. They draw a black card which has a promt with a blank space and other players must draw white cards and decide what to put in as the prompt, the Card Czar then chooses which one they liked best and that player scores a point.',
    release_date: '2011',
    title: 'Cards Against Humanity',
    vote_average: 7.2,
    vote_count: 1181
  },
  {
    adult: false,
    id: 1029575,
    original_language: 'en',
    original_title: 'The Game of Life',
    overview: "In The Game of Life, players must choose their path as they navigate obstacles throughout their life such as education, jobs, family, and even other players! The goal is to get to the end with the most value, this being moeny and extra winnings.",
    release_date: '1960',
    title: 'Life',
    vote_average: 7.3,
    vote_count: 457
  },
  {
    adult: false,
    id: 787699,
    original_language: 'en',
    original_title: 'Cluedo',
    overview: 'Cluedo, now known as Clue, is a deduction game where players must uncover and solve who is the murderer. Players must move around the board and ask other players about what they know, once a player decides to answer (or guess anytime I play) they can reveal to themselves whats in the envelope containing the answer...',
    release_date: '1949',
    title: 'Clue',
    vote_average: 7.2,
    vote_count: 703
  },
  {
    adult: false,
    id: 891699,
    original_language: 'en',
    original_title: 'Scrabble',
    overview: "Scrabble is played using a 15 x 15 board and letters that are each worth a certain amount. Some squares on the board can multiply your points such as triple word squares, the goal is to spell out words and aquire more points than other players. Names count though, right? ;)",
    release_date: '1948',
    title: 'Scrabble',
    vote_average: 5.8,
    vote_count: 181
  },
  {
    adult: false,
    id: 755401,
    original_language: 'en',
    original_title: 'Battleship',
    overview: 'Battleship is a two-player game that focuses on strategic placement of battleships and a divider between the players. Both players have a grid where they can place their ships of varying sizes with the goal of calling out coordinates to sink their corresponding ships. (Place them all into a corner and hope for the best!)',
    release_date: '1931',
    title: 'Battleship',
    vote_average: 7.3,
    vote_count: 8
  },
  {
    adult: false,
    id: 897087,
    original_language: 'en',
    original_title: 'Settlers of Catan',
    overview: 'Settlers of Catan, commonly known as Catan, is a strategy game that involves building settlements, obtaining resources, obtaining victory points, and arguing with your friends over trade offers! First player to 10 victory points wins the game.',
    release_date: '1995',
    title: 'Catan',
    vote_average: 6.5,
    vote_count: 390
  },
  {
    adult: false,
    id: 507089,
    original_language: 'en',
    original_title: "Connect Four",
    overview: "Connect 4 is a game in which players choose a colour and take turns dropping tokens in a grid frame. The main objective is to connect four of your colour pieces whether its straight across or diagonal you can win by aligning four. Just don't be that person who drops the discs before the other person can win!",
    release_date: '1974',
    title: "Connect 4",
    vote_average: 7.8,
    vote_count: 2993
  },
  {
    adult: false,
    id: 520758,
    original_language: 'en',
    original_title: 'Uno',
    overview: "The aim of Uno is to destroy your friends with a +4 card and ruin friendships- Uh I mean the aim of the game is to be the first player to get rid of all their cards. Players can stop others by using special cards such as +2 or skip allowing for some interesting plays. You should see how many addon packs there are now, holy (If you're interested search Uno on amazon!)",
    release_date: '1971',
    title: 'Uno',
    vote_average: 7.4,
    vote_count: 325
  }
]

export const gamePublishers: GamePublisher[] = [
  {
    gameId: 1234,
    publisherName: "Hasbro",
    publisherCountry: "United States",
    publisherDescription: "Renowned for producing popular toys and board games including Monopoly.",
  },
  {
    gameId: 897087,
    publisherName: "Catan Studio",
    publisherCountry: "United States",
    publisherDescription: "Develops and publishes the strategy Catan series.",
  },
  {
    gameId: 891699,
    publisherName: "WS Game Company",
    publisherCountry: "United States",
    publisherDescription: "Primarily known for their production of classic board games such as Scrabble.",
  },
  {
    gameId: 695721,
    publisherName: "Cards Against Humanity LLC",
    publisherCountry: "United States",
    publisherDescription: "Known for creating the adult party game Cards Against Humanity.",
  },
];
