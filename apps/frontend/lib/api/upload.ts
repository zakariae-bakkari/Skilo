
import { request } from './client';

export const uploadApi = {
  avatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const fd = new FormData();
    fd.append('file', file);
    return request<{ avatarUrl: string }>('POST', '/upload', fd, true);
  },
};
