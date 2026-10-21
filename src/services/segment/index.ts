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

  public rename(id: string, name: string): Promise<JourneyDetail> {
    return apiCall.patch<JourneyDetail>(`/segments/${id}`, { name });
  }

  public remove(id: string): Promise<JourneyDetail> {
    return apiCall.delete<JourneyDetail>(`/segments/${id}`);
  }

  public addDocument(id: string, documentSkeletonId: string): Promise<JourneyDetail> {
    return apiCall.post<JourneyDetail>(`/segments/${id}/documents`, { documentSkeletonId });
  }
}

export default SegmentService.getInstance();
