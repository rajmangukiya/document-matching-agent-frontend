import type { JourneyDetail, JourneyListItem, JourneyPayload } from '../../types/journey';
import apiCall from '../../utils/api-call';

class JourneyService {
  private static instance: JourneyService;

  private constructor() {}

  public static getInstance(): JourneyService {
    if (!JourneyService.instance) {
      JourneyService.instance = new JourneyService();
    }
    return JourneyService.instance;
  }

  public list(): Promise<JourneyListItem[]> {
    return apiCall.get<JourneyListItem[]>('/journeys');
  }

  public get(id: number): Promise<JourneyDetail> {
    return apiCall.get<JourneyDetail>(`/journeys/${id}`);
  }

  public create(payload: JourneyPayload): Promise<JourneyDetail> {
    return apiCall.post<JourneyDetail>('/journeys', payload);
  }

  public update(id: number, payload: Partial<JourneyPayload>): Promise<JourneyDetail> {
    return apiCall.patch<JourneyDetail>(`/journeys/${id}`, payload);
  }

  public remove(id: number): Promise<null> {
    return apiCall.delete<null>(`/journeys/${id}`);
  }

  public addSegment(id: number, name: string): Promise<JourneyDetail> {
    return apiCall.post<JourneyDetail>(`/journeys/${id}/segments`, { name });
  }
}

export default JourneyService.getInstance();
