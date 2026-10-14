import type { DocumentDetail } from '../../types/document';
import type { JourneyDetail } from '../../types/journey';
import apiCall from '../../utils/api-call';

class DocumentService {
  private static instance: DocumentService;

  private constructor() {}

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  public get(id: number): Promise<DocumentDetail> {
    return apiCall.get<DocumentDetail>(`/documents/${id}`);
  }

  // Returns the refreshed journey
  public remove(id: number): Promise<JourneyDetail> {
    return apiCall.delete<JourneyDetail>(`/documents/${id}`);
  }

  public uploadFiles(
    id: number,
    files: File[],
    onProgress?: (percent: number) => void,
  ): Promise<DocumentDetail> {
    const body = new FormData();
    files.forEach((file) => body.append('files', file));
    return apiCall.upload<DocumentDetail>(`/documents/${id}/files`, body, onProgress);
  }

  public removeFile(id: number, fileId: number): Promise<DocumentDetail> {
    return apiCall.delete<DocumentDetail>(`/documents/${id}/files/${fileId}`);
  }

  public downloadUrl(id: number, fileId: number): string {
    return apiCall.url(`/documents/${id}/files/${fileId}/download`);
  }

  // null clears a manual value and restores the extracted one
  public setFieldValue(id: number, fieldId: number, value: string | null): Promise<DocumentDetail> {
    return apiCall.put<DocumentDetail>(`/documents/${id}/fields/${fieldId}/value`, { value });
  }
}

export default DocumentService.getInstance();
