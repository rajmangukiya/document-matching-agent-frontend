import type {
  FieldType,
  MatchCandidate,
  TemplateDetail,
  TemplateListItem,
  TemplatePayload,
} from '../../types/template';
import apiCall from '../../utils/api-call';

// Document skeletons
class TemplateService {
  private static instance: TemplateService;

  private constructor() {}

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  public list(): Promise<TemplateListItem[]> {
    return apiCall.get<TemplateListItem[]>('/templates');
  }

  public get(id: number): Promise<TemplateDetail> {
    return apiCall.get<TemplateDetail>(`/templates/${id}`);
  }

  public create(payload: TemplatePayload): Promise<TemplateDetail> {
    return apiCall.post<TemplateDetail>('/templates', payload);
  }

  public update(id: number, payload: Partial<TemplatePayload>): Promise<TemplateDetail> {
    return apiCall.patch<TemplateDetail>(`/templates/${id}`, payload);
  }

  public remove(id: number): Promise<null> {
    return apiCall.delete<null>(`/templates/${id}`);
  }

  public matchCandidates(id: number): Promise<MatchCandidate[]> {
    return apiCall.get<MatchCandidate[]>(`/templates/${id}/match-candidates`);
  }

  public addField(id: number, payload: { name: string; type: FieldType }): Promise<TemplateDetail> {
    return apiCall.post<TemplateDetail>(`/templates/${id}/fields`, payload);
  }

  public updateField(
    id: number,
    fieldId: number,
    payload: { name?: string; type?: FieldType },
  ): Promise<TemplateDetail> {
    return apiCall.patch<TemplateDetail>(`/templates/${id}/fields/${fieldId}`, payload);
  }

  public removeField(id: number, fieldId: number): Promise<TemplateDetail> {
    return apiCall.delete<TemplateDetail>(`/templates/${id}/fields/${fieldId}`);
  }

  public addMatch(id: number, fieldId: number, matchFieldId: number): Promise<TemplateDetail> {
    return apiCall.post<TemplateDetail>(`/templates/${id}/fields/${fieldId}/matches`, {
      matchFieldId,
    });
  }

  public removeMatch(id: number, fieldId: number, matchFieldId: number): Promise<TemplateDetail> {
    return apiCall.delete<TemplateDetail>(
      `/templates/${id}/fields/${fieldId}/matches/${matchFieldId}`,
    );
  }
}

export default TemplateService.getInstance();
