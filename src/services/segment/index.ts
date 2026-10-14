import type { JourneyDetail } from '../../types/journey';
import apiCall from '../../utils/api-call';

// Segment mutations return the refreshed journey
class SegmentService {
  private static instance: SegmentService;

  private constructor() {}

  public static getInstance(): SegmentService {
    if (!SegmentService.instance) {
      SegmentService.instance = new SegmentService();
    }
    return SegmentService.instance;
  }

  public rename(id: number, name: string): Promise<JourneyDetail> {
    return apiCall.patch<JourneyDetail>(`/segments/${id}`, { name });
  }

  public remove(id: number): Promise<JourneyDetail> {
    return apiCall.delete<JourneyDetail>(`/segments/${id}`);
  }

  public addDocument(id: number, templateId: number): Promise<JourneyDetail> {
    return apiCall.post<JourneyDetail>(`/segments/${id}/documents`, { templateId });
  }
}

export default SegmentService.getInstance();
