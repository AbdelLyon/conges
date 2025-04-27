import dayjs from "dayjs";

export const downloadFile = (
   blobDocument: BlobPart,
   MIMEtype = 'application/vnd.ms-excel',
   fileName = '',
   extension = 'xls'
): void => {
   if (!blobDocument) return;

   const blob = new Blob([blobDocument], { type: MIMEtype });
   const url = window.URL.createObjectURL(blob);
   const link = document.createElement('a');

   const isDate = dayjs(fileName, 'DD-MM-YYYY', true).isValid();

   const finalFileName = isDate
      ? `${fileName}.${extension}`
      : `${fileName ? `${fileName}-` : ''}${dayjs().format(
         'DD-MM-YYYY'
      )}.${extension}`;

   link.setAttribute('href', url);
   link.setAttribute('download', finalFileName);
   document.body.appendChild(link);
   link.click();

   setTimeout(() => {
      window.URL.revokeObjectURL(url);
      link.remove();
   }, 100);
};
