import Message from './Message';
import http from 'http/http';
import { saveAs } from 'file-saver';
import { VersionedType } from 'model/VersionedType';
import { EXPORT_STATUS } from 'model/enums';
import Line from './Line';

export type ExportLineAssociation = VersionedType & {
  lineRef?: string;
  line?: Line[];
};

export type Export = VersionedType & {
  name: string;
  exportStatus?: EXPORT_STATUS;
  dryRun: boolean;
  downloadUrl?: string;
  messages?: Message[];
  lineAssociations?: ExportLineAssociation[];
};

export const newExport = (): Export => {
  return { name: '', dryRun: false };
};

export const toPayload = (selectedExport: Export): Export => {
  const { exportStatus, downloadUrl, messages, ...rest } = selectedExport;
  return rest;
};

export const download = async (selectedExport: Export, token: string) => {
  try {
    // feature detection
    // eslint-disable-next-line
    const isFileSaverSupported = !!new Blob();

    const { data } = await http.get(`/uttu/${selectedExport.downloadUrl}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const id = selectedExport.id ?? 'EXPORT_ID';

    saveAs(data, `${id.replace(':', '-')}-${selectedExport.created}.zip`);
  } catch (e) {
    alert('Sorry, your browser is not supported for downloads.');
  }
};
