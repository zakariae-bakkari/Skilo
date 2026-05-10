
import { get, post } from './client';
import { Review, PaginatedResponse } from './types';

export const reviewsApi = {
  submit: (data: {
    sessionId: string;
    globalRating: number;
    pedagogyRating?: number;
    punctualityRating?: number;
    communicationRating?: number;
    comment?: string;
  }) => post<Review>('/reviews', data),

  forUser: (userId: string) =>
    get<PaginatedResponse<Review>>(`/users/${userId}/reviews`),
};
