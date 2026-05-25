import { pgTable, uuid, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core'

export const watchedMovies = pgTable('watched_movies', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  tmdbId: integer('tmdb_id').notNull(),
  title: text('title').notNull(),
  posterUrl: text('poster_url'),
  genres: text('genres').array(),
  runtime: integer('runtime'),
  overview: text('overview'),
  voteAverage: numeric('vote_average', { precision: 3, scale: 1 }),
  watchedAt: timestamp('watched_at').defaultNow(),
  userRating: integer('user_rating'),
})
