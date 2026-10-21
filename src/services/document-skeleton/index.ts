import type {
  FieldType,
  MatchCandidate,
  DocumentSkeletonDetail,
  DocumentSkeletonListItem,
  DocumentSkeletonPayload,
} from '../../types/document-skeleton';
import apiCall from '../../utils/api-call';

// Document skeletons
class DocumentSkeletonService {
  private static instance: DocumentSkeletonService;

  private constructor() {}

  public static getInstance(): DocumentSkeletonService {
    if (!DocumentSkeletonService.instance) {
      DocumentSkeletonService.instance = new DocumentSkeletonService();
    }
    return DocumentSkeletonService.instance;
  }

  public list(): Promise<DocumentSkeletonListItem[]> {
    return apiCall.get<DocumentSkeletonListItem[]>('/document-skeletons');
  }

  public get(id: string): Promise<DocumentSkeletonDetail> {
    return apiCall.get<DocumentSkeletonDetail>(`/document-skeletons/${id}`);
  }

  public create(payload: DocumentSkeletonPayload): Promise<DocumentSkeletonDetail> {
    return apiCall.post<DocumentSkeletonDetail>('/document-skeletons', payload);
  }

  public update(
    id: string,
    payload: Partial<DocumentSkeletonPayload>,
  ): Promise<DocumentSkeletonDetail> {
    return apiCall.patch<DocumentSkeletonDetail>(`/document-skeletons/${id}`, payload);
  }

  public remove(id: string): Promise<null> {
    return apiCall.delete<null>(`/document-skeletons/${id}`);
  }

  public matchCandidates(id: string): Promise<MatchCandidate[]> {
    return apiCall.get<MatchCandidate[]>(`/document-skeletons/${id}/match-candidates`);
  }

  public addField(
    id: string,
    payload: { name: string; type: FieldType },
  ): Promise<DocumentSkeletonDetail> {
    return apiCall.post<DocumentSkeletonDetail>(`/document-skeletons/${id}/fields`, payload);
  }

  public updateField(
    id: string,
    fieldId: string,
    payload: { name?: string; type?: FieldType },
  ): Promise<DocumentSkeletonDetail> {
    return apiCall.patch<DocumentSkeletonDetail>(
      `/document-skeletons/${id}/fields/${fieldId}`,
      payload,
    );
  }

  public removeField(id: string, fieldId: string): Promise<DocumentSkeletonDetail> {
    return apiCall.delete<DocumentSkeletonDetail>(`/document-skeletons/${id}/fields/${fieldId}`);
  }

  public addMatch(
    id: string,
    fieldId: string,
    matchFieldId: string,
  ): Promise<DocumentSkeletonDetail> {
    return apiCall.post<DocumentSkeletonDetail>(
      `/document-skeletons/${id}/fields/${fieldId}/matches`,
      {
        matchFieldId,
      },
    );
  }

  public removeMatch(
    id: string,
    fieldId: string,
    matchFieldId: string,
  ): Promise<DocumentSkeletonDetail> {
    return apiCall.delete<DocumentSkeletonDetail>(
      `/document-skeletons/${id}/fields/${fieldId}/matches/${matchFieldId}`,
    );
  }
}

export default DocumentSkeletonService.getInstance();
