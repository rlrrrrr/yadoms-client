import { axiosInstance } from '@yadoms/shared';
import { KeywordsResponse } from '../model/KeywordsResponse';

class KeywordsApi {
  async loadKeywords(
    currentPage = 0,
    pageSize = 10
  ): Promise<KeywordsResponse> {
    try {
      const response = await axiosInstance.get<KeywordsResponse>(`/keywords`, {
        params: {
          page: currentPage,
          perPage: pageSize,
        },
      });
      if (response.status === 204) {
        return {
          keywords: [],
          paging: {
            currentPage: 1,
            totalPage: 1,
            pageSize: 0,
          },
        };
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching keywords : ', error);
      throw error;
    }
  }

  async sendCommand(keywordId: number, command: string) {
    try {
      await axiosInstance.post(
        '/keywords/' + keywordId + '/command/' + command
      );
    } catch (error) {
      console.error('Error starting/stoping plugin instance : ', error);
      throw error;
    }
  }
}

export const keywordsApi = new KeywordsApi();
